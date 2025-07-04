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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [createData, setCreateData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin',
    password: '',
    confirmPassword: ''
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
      return await apiRequest('POST', '/api/admin/create', data);
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

  // Mutation pour modifier un administrateur
  const updateAdminMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      return await apiRequest('PATCH', `/api/admin/${data.id}`, data.updates);
    },
    onSuccess: () => {
      toast({
        title: 'Administrateur modifié',
        description: 'Les informations ont été mises à jour avec succès',
      });
      setIsEditDialogOpen(false);
      setEditingAdmin(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/list'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de modification',
        description: error.message || 'Erreur lors de la modification',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour activer/désactiver un administrateur
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return await apiRequest('PATCH', `/api/admin/${id}/toggle`, { isActive });
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

  // Mutation pour supprimer un administrateur
  const deleteAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Administrateur supprimé',
        description: 'Le compte a été supprimé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/list'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de suppression',
        description: error.message || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    },
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(createData);
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditData({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      role: admin.role,
      password: '',
      confirmPassword: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editData.password && editData.password !== editData.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    const updates: any = {
      username: editData.username,
      email: editData.email,
      firstName: editData.firstName,
      lastName: editData.lastName,
      role: editData.role
    };

    if (editData.password) {
      updates.password = editData.password;
    }

    updateAdminMutation.mutate({ id: editingAdmin!.id, updates });
  };

  const handleToggleAdmin = (admin: Admin) => {
    toggleAdminMutation.mutate({ id: admin.id, isActive: !admin.isActive });
  };

  const handleDeleteAdmin = (admin: Admin) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${admin.firstName} ${admin.lastName} ?`)) {
      deleteAdminMutation.mutate(admin.id);
    }
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

        {/* Dialog de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier l'administrateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations du compte administrateur
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">Prénom</Label>
                  <Input
                    id="editFirstName"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    required
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Nom</Label>
                  <Input
                    id="editLastName"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    required
                    placeholder="Dupont"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="editUsername">Nom d'utilisateur</Label>
                <Input
                  id="editUsername"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  required
                  placeholder="admin"
                />
              </div>
              
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  required
                  placeholder="admin@store.com"
                />
              </div>

              <div>
                <Label htmlFor="editRole">Rôle</Label>
                <select
                  id="editRole"
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="text-sm font-medium text-muted-foreground">
                  Changer le mot de passe (optionnel)
                </div>
                
                <div>
                  <Label htmlFor="editPassword">Nouveau mot de passe</Label>
                  <Input
                    id="editPassword"
                    type="password"
                    value={editData.password}
                    onChange={(e) => setEditData({...editData, password: e.target.value})}
                    placeholder="Laisser vide pour conserver l'actuel"
                  />
                </div>
                
                <div>
                  <Label htmlFor="editConfirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="editConfirmPassword"
                    type="password"
                    value={editData.confirmPassword}
                    onChange={(e) => setEditData({...editData, confirmPassword: e.target.value})}
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={updateAdminMutation.isPending}>
                  {updateAdminMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sauvegarder
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateAdminMutation.isPending}
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
                        onClick={() => handleEditAdmin(admin)}
                        disabled={updateAdminMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin)}
                        disabled={deleteAdminMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
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