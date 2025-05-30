import type { Product, Category, Order, OrderItem, Promotion } from "@shared/schema";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
}

export interface ProductFilters {
  categoryId?: number;
  featured?: boolean;
  onSale?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'created' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: {
    productId: number;
    quantity: number;
    price: string;
    productName: string;
  }[];
  totalAmount: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  pendingOrders: number;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
}

export type { Product, Category, Order, OrderItem, Promotion };
