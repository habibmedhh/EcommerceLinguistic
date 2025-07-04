import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Settings, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FirstInstall() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstInstall, setIsFirstInstall] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: ""
  });

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Vérifier si c'est la première installation
  useEffect(() => {
    const checkFirstInstall = async () => {
      try {
        const response = await apiRequest('GET', '/api/admin/first-install');
        const data = await response.json();
        
        if (!data.isFirstInstall) {
          // Rediriger vers la page de connexion si ce n'est pas la première installation
          setLocation('/admin/login');
          return;
        }
        
        setIsFirstInstall(true);
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setError('Erreur lors de la vérification du statut de l\'installation');
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstInstall();
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation côté client
    if (!formData.username || !formData.password || !formData.email || !formData.firstName || !formData.lastName) {
      setError('Tous les champs sont requis');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest('POST', '/api/admin/first-install', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (response.ok) {
        setSuccess(true);
        toast({
          title: "Configuration terminée !",
          description: "Votre compte administrateur a été créé avec succès",
        });
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          setLocation('/admin/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('Erreur lors de la création du compte administrateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Vérification du statut...</p>
        </div>
      </div>
    );
  }

  if (!isFirstInstall) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Configuration initiale
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Bienvenue ! Créez votre premier compte administrateur pour commencer
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800">Configuration terminée !</h3>
                <p className="text-green-600 mt-2">
                  Votre compte administrateur a été créé avec succès.
                  <br />
                  Redirection vers la page de connexion...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@votre-boutique.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <Shield className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Informations importantes :</p>
                    <ul className="mt-1 space-y-1 text-blue-700">
                      <li>• Ce compte aura tous les privilèges d'administration</li>
                      <li>• Utilisez un mot de passe sécurisé (minimum 6 caractères)</li>
                      <li>• Vous pourrez créer d'autres comptes admin plus tard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Settings className="h-5 w-5 mr-2" />
                    Créer mon compte administrateur
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}