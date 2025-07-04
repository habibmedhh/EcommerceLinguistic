import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Fonction pour vérifier si la base de données est vide (première installation)
async function checkFirstInstall() {
  try {
    const admins = await storage.getAllAdmins();
    
    if (admins.length === 0) {
      log("=== PREMIÈRE INSTALLATION DÉTECTÉE ===");
      log("Aucun administrateur trouvé dans la base de données");
      log("L'utilisateur devra créer son premier compte admin via l'interface de configuration");
      log("=========================================");
      return true;
    }

    // Si des admins existent, vérifier qu'au moins un est actif
    const activeAdmins = admins.filter(admin => admin.isActive);
    
    if (activeAdmins.length === 0) {
      log("⚠️  Aucun administrateur actif trouvé, réactivation nécessaire...");
      
      // Vérifier si un compte admin existe déjà mais est inactif
      const existingAdmin = await storage.getAdminByUsername('admin');
      
      if (existingAdmin) {
        // Activer le compte existant
        await storage.updateAdmin(existingAdmin.id, { 
          isActive: true,
          firstName: 'Administrateur',
          lastName: 'Principal'
        });
        log("✅ Compte administrateur par défaut réactivé");
      }
    }
    
    return false;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de la première installation:", error);
    return false;
  }
}

// Configure sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Vérifier si c'est la première installation
  await checkFirstInstall();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // Production static file serving
    try {
      serveStatic(app);
    } catch (error) {
      console.error("Failed to setup static file serving:", error);
      // Fallback static serving for production
      const path = await import("path");
      const fs = await import("fs");
      
      // Try multiple possible locations for the built assets
      const possiblePaths = [
        path.resolve(process.cwd(), "dist", "public"),
        path.resolve(process.cwd(), "public"),
        path.resolve(import.meta.dirname, "public"),
        path.resolve(import.meta.dirname, "..", "dist", "public")
      ];
      
      let distPath = null;
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          distPath = testPath;
          break;
        }
      }
      
      if (distPath) {
        console.log(`Serving static files from: ${distPath}`);
        app.use(express.static(distPath));
        
        // fall through to index.html if the file doesn't exist
        app.use("*", (_req, res) => {
          res.sendFile(path.resolve(distPath, "index.html"));
        });
      } else {
        console.error("Could not find built assets in any expected location");
        console.log("Searched paths:", possiblePaths);
        // Serve a basic error page
        app.use("*", (_req, res) => {
          res.status(503).json({ 
            error: "Application is being deployed", 
            message: "Please try again in a moment.",
            paths: possiblePaths 
          });
        });
      }
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
