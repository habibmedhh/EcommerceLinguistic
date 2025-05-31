import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Trash2, Edit, UserCheck, UserX } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  firstName: string | null;
  lastName: string | null;
  lastLogin: Date | null;
  createdAt: Date;
}

export default function AdminManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createData, setCreateData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer la liste des administrateurs
  const { data: admins = [], isLoading } = useQuery<Admin[]>({
    queryKey: ['/api/admin/list'],
    retry: false,
  });

  // Mutation pour créer un administrateur
  const createAdminMutation = useMutation({
    mutationFn: async (data: typeof createData) => {
      return await apiRequest('/api/admin/create', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Administrateur créé',
        description: 'Le compte administrateur a été créé avec succès',
      });
      setIsCreateDialogOpen(false);
      setCreateData({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'admin'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/list'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de création',
        description: error.message || 'Erreur lors de la création du compte',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour activer/désactiver un administrateur
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest(`/api/admin/${id}/toggle`, 'PATCH', { isActive });
    },
    onSuccess: () => {
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de l\'administrateur a été modifié',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/list'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la modification',
        variant: 'destructive',
      });
    },
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(createData);
  };

  const handleToggleAdmin = (admin: Admin) => {
    toggleAdminMutation.mutate({ id: admin.id, isActive: !admin.isActive });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Administrateurs</h1>
          <p className="text-muted-foreground">Gérez les comptes administrateurs du système</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un administrateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau compte administrateur au système
              </DialogDescription>
            </DialogHeader>
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
                  placeholder="nouvel_admin"
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

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={createAdminMutation.isPending}>
                  {createAdminMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer le compte
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createAdminMutation.isPending}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Administrateurs</CardTitle>
          <CardDescription>
            {admins.length} administrateur(s) dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin: Admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{admin.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.isActive ? 'default' : 'destructive'}>
                      {admin.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.lastLogin 
                      ? new Date(admin.lastLogin).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(admin)}
                        disabled={toggleAdminMutation.isPending}
                      >
                        {admin.isActive ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}