import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Order, OrderWithItems, OrderRequest, AdminStats } from "@/types";

export const useOrders = (filters?: {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["/api/orders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append("status", filters.status);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["/api/orders", id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json() as OrderWithItems;
    },
    enabled: !!id,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["/api/orders/stats"],
    queryFn: async () => {
      const response = await fetch("/api/orders/stats");
      if (!response.ok) throw new Error("Failed to fetch order stats");
      return response.json() as AdminStats;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: OrderRequest) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/stats"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/stats"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/stats"] });
    },
  });
};
