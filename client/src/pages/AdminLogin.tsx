import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "admin"
  });

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, createAdmin, isLoggingIn, isCreatingAdmin, loginError, createAdminError, isAuthenticated } = useAdminAuth();

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    setLocation("/admin");
    return null;
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

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin(createData, {
      onSuccess: () => {
        toast({
          title: "Compte admin créé",
          description: "Le compte administrateur a été créé avec succès",
        });
        setShowCreateForm(false);
        setCreateData({
          username: "",
          password: "",
          email: "",
          firstName: "",
          lastName: "",
          role: "admin"
        });
      },
      onError: (error) => {
        toast({
          title: "Erreur de création",
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

        {!showCreateForm ? (
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

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  className="text-sm"
                >
                  Créer un compte administrateur
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte administrateur</CardTitle>
              <CardDescription>
                Créez le premier compte administrateur du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={createData.firstName}
                      onChange={(e) => setCreateData({...createData, firstName: e.target.value})}
                      required
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={createData.lastName}
                      onChange={(e) => setCreateData({...createData, lastName: e.target.value})}
                      required
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createData.email}
                    onChange={(e) => setCreateData({...createData, email: e.target.value})}
                    required
                    placeholder="admin@exemple.com"
                  />
                </div>

                <div>
                  <Label htmlFor="createUsername">Nom d'utilisateur</Label>
                  <Input
                    id="createUsername"
                    value={createData.username}
                    onChange={(e) => setCreateData({...createData, username: e.target.value})}
                    required
                    placeholder="admin"
                  />
                </div>

                <div>
                  <Label htmlFor="createPassword">Mot de passe</Label>
                  <Input
                    id="createPassword"
                    type="password"
                    value={createData.password}
                    onChange={(e) => setCreateData({...createData, password: e.target.value})}
                    required
                    placeholder="Mot de passe sécurisé"
                    minLength={6}
                  />
                </div>

                {createAdminError && (
                  <Alert variant="destructive">
                    <AlertDescription>{createAdminError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isCreatingAdmin}>
                    {isCreatingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Créer le compte
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    disabled={isCreatingAdmin}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}