import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  lastLogin: Date | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  admin: AdminUser;
  token: string;
}

export const useAdminAuth = () => {
  const queryClient = useQueryClient();

  const { data: admin, isLoading } = useQuery({
    queryKey: ['/api/admin/me'],
    queryFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return null;
      
      try {
        const response = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('adminToken');
            return null;
          }
          throw new Error('Erreur de vérification');
        }
        
        return await response.json();
      } catch (error) {
        localStorage.removeItem('adminToken');
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de connexion');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.token);
      queryClient.setQueryData(['/api/admin/me'], data.admin);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    },
    onSuccess: () => {
      localStorage.removeItem('adminToken');
      queryClient.setQueryData(['/api/admin/me'], null);
      queryClient.clear();
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (adminData: any) => {
      return await apiRequest('/api/admin/create', {
        method: 'POST',
        body: adminData,
      });
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    createAdmin: createAdminMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isCreatingAdmin: createAdminMutation.isPending,
    loginError: loginMutation.error?.message,
    createAdminError: createAdminMutation.error?.message,
  };
};