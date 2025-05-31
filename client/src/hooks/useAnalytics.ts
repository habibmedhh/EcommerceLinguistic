import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export interface ProductAnalytics {
  id: number;
  name: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
  avgOrderValue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  monthlyGrowth: number;
}

export interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
  profit: number;
}

export const useOrderAnalytics = () => {
  return useQuery({
    queryKey: ['/api/analytics/orders'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data: any): OrderAnalytics => ({
      totalOrders: data?.totalOrders || 0,
      totalRevenue: data?.totalRevenue || 0,
      totalProfit: data?.totalProfit || 0,
      avgOrderValue: data?.avgOrderValue || 0,
      pendingOrders: data?.pendingOrders || 0,
      deliveredOrders: data?.deliveredOrders || 0,
      cancelledOrders: data?.cancelledOrders || 0,
      monthlyGrowth: data?.monthlyGrowth || 0,
    })
  });
};

export const useProductAnalytics = () => {
  return useQuery({
    queryKey: ['/api/analytics/products'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data: any[]): ProductAnalytics[] => {
      return data?.map(item => ({
        id: item.id,
        name: item.name,
        totalSales: item.totalSales || 0,
        totalRevenue: item.totalRevenue || 0,
        totalProfit: item.totalProfit || 0,
        averageOrderValue: item.averageOrderValue || 0,
        conversionRate: item.conversionRate || 0,
      })) || [];
    }
  });
};

export const useDailyStats = (days = 30) => {
  return useQuery({
    queryKey: ['/api/analytics/daily', days],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data: any[]): DailyStats[] => {
      return data?.map(item => ({
        date: item.date,
        orders: item.orders || 0,
        revenue: item.revenue || 0,
        profit: item.profit || 0,
      })) || [];
    }
  });
};