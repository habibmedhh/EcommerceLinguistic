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
}

export const useAdminAuth = () => {
  const queryClient = useQueryClient();

  const { data: admin, isLoading } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await apiRequest('POST', '/api/admin/login', credentials);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/admin/me'], data.admin);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/admin/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/admin/me'], null);
      queryClient.clear();
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (adminData: any) => {
      const response = await apiRequest('POST', '/api/admin/create', adminData);
      return await response.json();
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