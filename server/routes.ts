import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertPromotionSchema, insertAdminSchema } from "@shared/schema";
import { z } from "zod";

// Cache simple en mémoire pour améliorer les performances
const cache = new Map();
const CACHE_TTL = 60000; // 60 secondes pour une meilleure performance

function getCacheKey(path: string, query?: any): string {
  return `${path}${query ? JSON.stringify(query) : ''}`;
}

function getFromCache(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  // Nettoyer le cache si trop d'entrées
  if (cache.size > 100) {
    const entries = Array.from(cache.entries());
    entries.slice(0, 50).forEach(([key]) => cache.delete(key));
  }
}

// Middleware d'authentification admin basé sur les sessions
const authenticateAdminSession = async (req: any, res: any, next: any) => {
  try {
    const session = req.session as any;
    if (!session || !session.adminId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const admin = await storage.getAdmin(session.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Session invalide ou compte désactivé' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

// Middleware d'authentification admin (legacy - avec token)
const authenticateAdmin = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const admin = await storage.getAdminBySession(token);
    if (!admin) {
      return res.status(401).json({ error: 'Session invalide' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const cacheKey = getCacheKey('/api/categories');
      let categories = getFromCache(cacheKey);
      
      if (!categories) {
        categories = await storage.getCategories();
        setCache(cacheKey, categories);
      }
      
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid category data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid category data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        featured,
        onSale,
        search,
        limit = "20",
        offset = "0"
      } = req.query;

      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === "true" ? true : featured === "false" ? false : undefined,
        onSale: onSale === "true" ? true : onSale === "false" ? false : undefined,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const cacheKey = getCacheKey('/api/products/featured', { limit });
      let products = getFromCache(cacheKey);
      
      if (!products) {
        products = await storage.getFeaturedProducts(limit);
        setCache(cacheKey, products);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/sale", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const cacheKey = getCacheKey('/api/products/sale', { limit });
      let products = getFromCache(cacheKey);
      
      if (!products) {
        products = await storage.getSaleProducts(limit);
        setCache(cacheKey, products);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sale products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      console.log("Received product data:", JSON.stringify(req.body, null, 2));
      const productData = insertProductSchema.parse(req.body);
      console.log("Parsed product data:", JSON.stringify(productData, null, 2));
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        console.log("Create product error:", error);
        res.status(500).json({ error: "Failed to create product" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update product" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const {
        status,
        dateFrom,
        dateTo,
        limit = "20",
        offset = "0"
      } = req.query;

      const filters = {
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await storage.getOrders(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/stats", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order statistics" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  const createOrderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    customerEmail: z.string().email().optional().or(z.literal("")),
    deliveryAddress: z.string().min(1),
    items: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.string(),
      productName: z.string()
    })).min(1),
    totalAmount: z.string()
  });

  app.post("/api/orders", async (req, res) => {
    try {
      console.log("Received order data:", JSON.stringify(req.body, null, 2));
      const orderData = createOrderSchema.parse(req.body);
      const { items, ...orderInfo } = orderData;
      
      const order = await storage.createOrder(orderInfo, items);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Order validation errors:", error.errors);
        res.status(400).json({ error: "Invalid order data", details: error.errors });
      } else {
        console.log("Create order error:", error);
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid status data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update order status" });
      }
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Update order customer information
      const updated = await storage.updateOrderCustomerInfo(id, updateData);
      
      if (!updated) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteOrder(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/orders", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      const orders = await storage.getOrders({ limit: 1000 });
      
      const deliveredOrders = orders.orders.filter(o => o.status === 'delivered').length;
      const cancelledOrders = orders.orders.filter(o => o.status === 'cancelled').length;
      
      // Calculate profit (assuming 30% profit margin if no cost data)
      const totalProfit = stats.totalRevenue * 0.3;
      
      // Calculate monthly growth (simplified)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthOrders = orders.orders.filter(o => 
        new Date(o.createdAt!) >= thisMonth
      );
      const lastMonthOrders = orders.orders.filter(o => 
        new Date(o.createdAt!) >= lastMonth && new Date(o.createdAt!) < thisMonth
      );
      
      const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      const monthlyGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
      
      res.json({
        ...stats,
        totalProfit,
        deliveredOrders,
        cancelledOrders,
        monthlyGrowth
      });
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      res.status(500).json({ error: "Failed to fetch order analytics" });
    }
  });

  app.get("/api/analytics/products", async (req, res) => {
    try {
      const orders = await storage.getOrders({ limit: 1000 });
      const products = await storage.getProducts({ limit: 100 });
      
      // Get all order items from all orders
      const allOrderItems = [];
      for (const order of orders.orders) {
        const fullOrder = await storage.getOrder(order.id);
        if (fullOrder && fullOrder.items) {
          fullOrder.items.forEach(item => {
            allOrderItems.push({
              ...item,
              orderId: order.id,
              orderStatus: order.status,
              orderDate: order.createdAt
            });
          });
        }
      }
      
      const productStats = products.products.map(product => {
        const productItems = allOrderItems.filter(item => item.productId === product.id);
        
        // Calculate total sales (quantity)
        const totalSales = productItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        // Calculate total revenue from actual order items
        const totalRevenue = productItems.reduce((sum, item) => {
          return sum + (parseFloat(item.price || '0') * (item.quantity || 0));
        }, 0);
        
        // Calculate profit using cost price from product or estimate
        const productPrice = parseFloat(product.price || '0');
        const costPrice = parseFloat(product.costPrice || '0');
        const profitPerUnit = costPrice > 0 ? productPrice - costPrice : productPrice * 0.3; // 30% profit margin if no cost
        const totalProfit = totalSales * profitPerUnit;
        
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        
        return {
          id: product.id,
          name: product.name,
          totalSales,
          totalRevenue,
          totalProfit,
          averageOrderValue,
          conversionRate: 0 // Would need view data to calculate
        };
      });
      
      // Sort by total revenue and filter out products with no sales
      const activeProducts = productStats.filter(p => p.totalSales > 0);
      activeProducts.sort((a, b) => b.totalRevenue - a.totalRevenue);
      
      res.json(activeProducts);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      res.status(500).json({ error: "Failed to fetch product analytics" });
    }
  });

  app.get("/api/analytics/daily", async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const daysCount = parseInt(days as string);
      
      const orders = await storage.getOrders({ limit: 1000 });
      
      const dailyStats = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.orders.filter(order => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr;
        });
        
        const revenue = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        
        // Calculate real profit based on actual order items
        let profit = 0;
        for (const order of dayOrders) {
          const fullOrder = await storage.getOrder(order.id);
          if (fullOrder && fullOrder.items) {
            for (const item of fullOrder.items) {
              const itemPrice = parseFloat(item.price || '0');
              const itemQuantity = item.quantity || 0;
              // Use 30% profit margin on actual sale price
              const itemProfit = itemPrice * itemQuantity * 0.3;
              profit += itemProfit;
            }
          }
        }
        
        dailyStats.push({
          date: dateStr,
          orders: dayOrders.length,
          revenue: Math.round(revenue * 100) / 100,
          profit: Math.round(profit * 100) / 100
        });
      }
      
      res.json(dailyStats);
    } catch (error) {
      console.error('Error fetching daily analytics:', error);
      res.status(500).json({ error: "Failed to fetch daily analytics" });
    }
  });

  // Promotions
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  app.post("/api/promotions", async (req, res) => {
    try {
      const promotionData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(promotionData);
      res.status(201).json(promotion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid promotion data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create promotion" });
      }
    }
  });

  // Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const cacheKey = getCacheKey('/api/settings');
      let settings = getFromCache(cacheKey);
      
      if (!settings) {
        settings = await storage.getSettings();
        setCache(cacheKey, settings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        res.status(404).json({ error: "Setting not found" });
        return;
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { value, description } = req.body;
      const setting = await storage.setSetting(req.params.key, value, description);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value, description } = req.body;
      console.log('POST /api/settings received:', { key, value: typeof value });
      const setting = await storage.setSetting(key, value, description);
      console.log('Setting saved successfully:', setting);
      res.json(setting);
    } catch (error) {
      console.error('Failed to save setting:', error);
      res.status(500).json({ error: "Failed to save setting" });
    }
  });

  // Route pour vérifier si c'est la première installation
  app.get('/api/admin/first-install', async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      res.json({ isFirstInstall: admins.length === 0 });
    } catch (error) {
      console.error("Error checking first install:", error);
      res.status(500).json({ message: "Erreur lors de la vérification" });
    }
  });

  // Route pour créer le premier administrateur (uniquement si la base est vide)
  app.post('/api/admin/first-install', async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      
      // Vérifier que la base de données est vraiment vide
      if (admins.length > 0) {
        return res.status(400).json({ message: "La base de données contient déjà des administrateurs" });
      }

      const { username, password, email, firstName, lastName } = req.body;

      // Validation des données
      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Le nom d'utilisateur doit contenir au moins 3 caractères" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
      }

      // Créer le premier administrateur
      const newAdmin = {
        username,
        password,
        email,
        firstName,
        lastName,
        role: 'super_admin' as const,
        isActive: true
      };

      const admin = await storage.createAdmin(newAdmin);
      
      // Retourner les informations sans le mot de passe
      const { password: _, ...adminResponse } = admin;
      
      res.status(201).json({ 
        message: "Premier administrateur créé avec succès",
        admin: adminResponse 
      });
    } catch (error) {
      console.error("Error creating first admin:", error);
      res.status(500).json({ message: "Erreur lors de la création du premier administrateur" });
    }
  });

  // Routes d'authentification admin
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
      }

      const admin = await storage.authenticateAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Store admin ID in session instead of creating a separate token
      (req.session as any).adminId = admin.id;
      
      res.json({
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          firstName: admin.firstName,
          lastName: admin.lastName
        }
      });
    } catch (error) {
      console.error('Erreur de connexion admin:', error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });

  app.post("/api/admin/logout", authenticateAdminSession, async (req: any, res) => {
    try {
      // Clear admin session
      (req.session as any).adminId = null;
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
  });

  app.get("/api/admin/me", authenticateAdminSession, async (req: any, res) => {
    try {
      const admin = req.admin;
      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
        lastLogin: admin.lastLogin
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération du profil" });
    }
  });

  // Admin management routes
  app.get('/api/admin/list', authenticateAdminSession, async (req, res) => {
    try {
      const adminList = await storage.getAllAdmins();
      // Remove passwords from response
      const sanitizedAdmins = adminList.map(({ password, ...admin }) => admin);
      res.json(sanitizedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  app.post('/api/admin/create', authenticateAdminSession, async (req, res) => {
    try {
      const adminData = insertAdminSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingByUsername = await storage.getAdminByUsername(adminData.username);
      const existingByEmail = await storage.getAdminByEmail(adminData.email);
      
      if (existingByUsername) {
        return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
      }
      
      if (existingByEmail) {
        return res.status(400).json({ message: "Cet email existe déjà" });
      }

      const newAdmin = await storage.createAdmin(adminData);
      // Remove password from response
      const { password, ...adminResponse } = newAdmin;
      res.status(201).json(adminResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Données invalides", details: error.errors });
      } else {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Failed to create admin" });
      }
    }
  });

  // Route pour modifier un administrateur
  app.patch('/api/admin/:id', authenticateAdminSession, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      const updates = req.body;

      // Vérifier que l'admin existe
      const existingAdmin = await storage.getAdmin(adminId);
      if (!existingAdmin) {
        return res.status(404).json({ message: "Administrateur non trouvé" });
      }

      // Vérifier l'unicité du nom d'utilisateur et de l'email si modifiés
      if (updates.username && updates.username !== existingAdmin.username) {
        const existingByUsername = await storage.getAdminByUsername(updates.username);
        if (existingByUsername) {
          return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
        }
      }

      if (updates.email && updates.email !== existingAdmin.email) {
        const existingByEmail = await storage.getAdminByEmail(updates.email);
        if (existingByEmail) {
          return res.status(400).json({ message: "Cet email existe déjà" });
        }
      }

      const updatedAdmin = await storage.updateAdmin(adminId, updates);
      if (!updatedAdmin) {
        return res.status(404).json({ message: "Échec de la mise à jour" });
      }

      // Remove password from response
      const { password, ...adminResponse } = updatedAdmin;
      res.json(adminResponse);
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ message: "Erreur lors de la modification" });
    }
  });

  app.patch('/api/admin/:id/toggle', authenticateAdminSession, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      const { isActive } = req.body;

      // Vérifier que l'admin existe
      const existingAdmin = await storage.getAdmin(adminId);
      if (!existingAdmin) {
        return res.status(404).json({ message: "Administrateur non trouvé" });
      }

      // Empêcher la désactivation si c'est le seul admin actif
      if (existingAdmin.isActive && !isActive) {
        const allAdmins = await storage.getAllAdmins();
        const activeAdmins = allAdmins.filter(admin => admin.isActive && admin.id !== adminId);
        
        if (activeAdmins.length === 0) {
          return res.status(400).json({ message: "Impossible de désactiver le dernier administrateur actif" });
        }

        // Empêcher la désactivation du compte par défaut
        if (existingAdmin.username === 'admin') {
          return res.status(400).json({ message: "Le compte administrateur par défaut ne peut pas être désactivé" });
        }
      }

      const updatedAdmin = await storage.updateAdmin(adminId, { isActive });
      if (!updatedAdmin) {
        return res.status(404).json({ message: "Échec de la mise à jour" });
      }

      // Remove password from response
      const { password, ...adminResponse } = updatedAdmin;
      res.json(adminResponse);
    } catch (error) {
      console.error("Error updating admin:", error);
      res.status(500).json({ message: "Erreur lors de la modification du statut" });
    }
  });

  // Route pour supprimer un administrateur
  app.delete('/api/admin/:id', authenticateAdminSession, async (req, res) => {
    try {
      const adminId = parseInt(req.params.id);
      
      // Vérifier que l'admin existe
      const existingAdmin = await storage.getAdmin(adminId);
      if (!existingAdmin) {
        return res.status(404).json({ message: "Administrateur non trouvé" });
      }

      // Empêcher la suppression du compte par défaut
      if (existingAdmin.username === 'admin') {
        return res.status(400).json({ message: "Le compte administrateur par défaut ne peut pas être supprimé" });
      }

      // Empêcher la suppression si c'est le seul admin actif
      const allAdmins = await storage.getAllAdmins();
      const activeAdmins = allAdmins.filter(admin => admin.isActive && admin.id !== adminId);
      
      if (activeAdmins.length === 0) {
        return res.status(400).json({ message: "Impossible de supprimer le dernier administrateur actif" });
      }

      const success = await storage.deleteAdmin(adminId);
      if (!success) {
        return res.status(500).json({ message: "Échec de la suppression" });
      }

      res.json({ message: "Administrateur supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
