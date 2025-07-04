import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingFirstInstall, setIsCheckingFirstInstall] = useState(true);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, isLoggingIn, loginError, isAuthenticated } = useAdminAuth();

  // Vérifier si c'est la première installation
  useEffect(() => {
    const checkFirstInstall = async () => {
      try {
        const response = await apiRequest('GET', '/api/admin/first-install');
        const data = await response.json();
        
        if (data.isFirstInstall) {
          // Rediriger vers la page de première installation
          setLocation('/admin/first-install');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      } finally {
        setIsCheckingFirstInstall(false);
      }
    };

    checkFirstInstall();
  }, [setLocation]);

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  // Afficher un loader pendant la vérification
  if (isCheckingFirstInstall) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Vérification du statut...</p>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: () => {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        setLocation("/admin");
      },
      onError: (error) => {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte administrateur
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder au panel d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Votre mot de passe"
                />
              </div>

              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}