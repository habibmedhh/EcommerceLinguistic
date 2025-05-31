import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertPromotionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid category data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid category data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update category" });
      }
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const {
        categoryId,
        featured,
        onSale,
        search,
        limit = "20",
        offset = "0"
      } = req.query;

      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === "true" ? true : featured === "false" ? false : undefined,
        onSale: onSale === "true" ? true : onSale === "false" ? false : undefined,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/sale", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const products = await storage.getSaleProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sale products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      console.log("Received product data:", JSON.stringify(req.body, null, 2));
      const productData = insertProductSchema.parse(req.body);
      console.log("Parsed product data:", JSON.stringify(productData, null, 2));
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        console.log("Create product error:", error);
        res.status(500).json({ error: "Failed to create product" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update product" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const {
        status,
        dateFrom,
        dateTo,
        limit = "20",
        offset = "0"
      } = req.query;

      const filters = {
        status: status as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const result = await storage.getOrders(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/stats", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order statistics" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  const createOrderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    customerEmail: z.string().email().optional().or(z.literal("")),
    deliveryAddress: z.string().min(1),
    items: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.string(),
      productName: z.string()
    })).min(1),
    totalAmount: z.string()
  });

  app.post("/api/orders", async (req, res) => {
    try {
      console.log("Received order data:", JSON.stringify(req.body, null, 2));
      const orderData = createOrderSchema.parse(req.body);
      const { items, ...orderInfo } = orderData;
      
      const order = await storage.createOrder(orderInfo, items);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Order validation errors:", error.errors);
        res.status(400).json({ error: "Invalid order data", details: error.errors });
      } else {
        console.log("Create order error:", error);
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = z.object({ status: z.string() }).parse(req.body);
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid status data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update order status" });
      }
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Update order customer information
      const updated = await storage.updateOrderCustomerInfo(id, updateData);
      
      if (!updated) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteOrder(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/orders", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      const orders = await storage.getOrders({ limit: 1000 });
      
      const deliveredOrders = orders.orders.filter(o => o.status === 'delivered').length;
      const cancelledOrders = orders.orders.filter(o => o.status === 'cancelled').length;
      
      // Calculate profit (assuming 30% profit margin if no cost data)
      const totalProfit = stats.totalRevenue * 0.3;
      
      // Calculate monthly growth (simplified)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const thisMonthOrders = orders.orders.filter(o => 
        new Date(o.createdAt!) >= thisMonth
      );
      const lastMonthOrders = orders.orders.filter(o => 
        new Date(o.createdAt!) >= lastMonth && new Date(o.createdAt!) < thisMonth
      );
      
      const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      const monthlyGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
      
      res.json({
        ...stats,
        totalProfit,
        deliveredOrders,
        cancelledOrders,
        monthlyGrowth
      });
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      res.status(500).json({ error: "Failed to fetch order analytics" });
    }
  });

  app.get("/api/analytics/products", async (req, res) => {
    try {
      const orders = await storage.getOrders({ limit: 1000 });
      const products = await storage.getProducts({ limit: 100 });
      
      // Get all order items from all orders
      const allOrderItems = [];
      for (const order of orders.orders) {
        const fullOrder = await storage.getOrder(order.id);
        if (fullOrder && fullOrder.items) {
          fullOrder.items.forEach(item => {
            allOrderItems.push({
              ...item,
              orderId: order.id,
              orderStatus: order.status,
              orderDate: order.createdAt
            });
          });
        }
      }
      
      const productStats = products.products.map(product => {
        const productItems = allOrderItems.filter(item => item.productId === product.id);
        
        // Calculate total sales (quantity)
        const totalSales = productItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        // Calculate total revenue from actual order items
        const totalRevenue = productItems.reduce((sum, item) => {
          return sum + (parseFloat(item.price || '0') * (item.quantity || 0));
        }, 0);
        
        // Calculate profit using cost price from product or estimate
        const productPrice = parseFloat(product.price || '0');
        const costPrice = parseFloat(product.costPrice || '0');
        const profitPerUnit = costPrice > 0 ? productPrice - costPrice : productPrice * 0.3; // 30% profit margin if no cost
        const totalProfit = totalSales * profitPerUnit;
        
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        
        return {
          id: product.id,
          name: product.name,
          totalSales,
          totalRevenue,
          totalProfit,
          averageOrderValue,
          conversionRate: 0 // Would need view data to calculate
        };
      });
      
      // Sort by total revenue and filter out products with no sales
      const activeProducts = productStats.filter(p => p.totalSales > 0);
      activeProducts.sort((a, b) => b.totalRevenue - a.totalRevenue);
      
      res.json(activeProducts);
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      res.status(500).json({ error: "Failed to fetch product analytics" });
    }
  });

  app.get("/api/analytics/daily", async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const daysCount = parseInt(days as string);
      
      const orders = await storage.getOrders({ limit: 1000 });
      
      const dailyStats = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.orders.filter(order => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr;
        });
        
        const revenue = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        
        // Calculate real profit based on actual order items
        let profit = 0;
        for (const order of dayOrders) {
          const fullOrder = await storage.getOrder(order.id);
          if (fullOrder && fullOrder.items) {
            for (const item of fullOrder.items) {
              const itemPrice = parseFloat(item.price || '0');
              const itemQuantity = item.quantity || 0;
              // Use 30% profit margin on actual sale price
              const itemProfit = itemPrice * itemQuantity * 0.3;
              profit += itemProfit;
            }
          }
        }
        
        dailyStats.push({
          date: dateStr,
          orders: dayOrders.length,
          revenue: Math.round(revenue * 100) / 100,
          profit: Math.round(profit * 100) / 100
        });
      }
      
      res.json(dailyStats);
    } catch (error) {
      console.error('Error fetching daily analytics:', error);
      res.status(500).json({ error: "Failed to fetch daily analytics" });
    }
  });

  // Promotions
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  app.post("/api/promotions", async (req, res) => {
    try {
      const promotionData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(promotionData);
      res.status(201).json(promotion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid promotion data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create promotion" });
      }
    }
  });

  // Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        res.status(404).json({ error: "Setting not found" });
        return;
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { value, description } = req.body;
      const setting = await storage.setSetting(req.params.key, value, description);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
