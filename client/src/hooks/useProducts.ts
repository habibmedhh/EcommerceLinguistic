import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product, ProductFilters } from "@/types";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["/api/products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.categoryId) params.append("categoryId", filters.categoryId.toString());
      if (filters?.featured !== undefined) params.append("featured", filters.featured.toString());
      if (filters?.onSale !== undefined) params.append("onSale", filters.onSale.toString());
      if (filters?.search) params.append("search", filters.search);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json() as Product;
    },
    enabled: !!id,
  });
};

export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ["/api/products/featured", limit],
    queryFn: async () => {
      const response = await fetch(`/api/products/featured?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return response.json() as Product[];
    },
  });
};

export const useSaleProducts = (limit = 6) => {
  return useQuery({
    queryKey: ["/api/products/sale", limit],
    queryFn: async () => {
      const response = await fetch(`/api/products/sale?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch sale products");
      return response.json() as Product[];
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
};
