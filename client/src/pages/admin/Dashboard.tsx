import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useOrderStats, useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useOrderAnalytics, useProductAnalytics, useDailyStats } from "@/hooks/useAnalytics";
import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowLeft,
  Download,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: ordersData, isLoading: ordersLoading } = useOrders();
  const { data: orderAnalytics } = useOrderAnalytics();
  const { data: productAnalytics } = useProductAnalytics();
  const { data: dailyStats } = useDailyStats(30);
  const { data: settings } = useSettings();

  const products = productsData?.products || [];
  const orders = ordersData?.orders || [];

  // Use real analytics data
  const topProducts = productAnalytics?.slice(0, 4) || [];
  const bestSellers = productAnalytics?.sort((a, b) => b.totalSales - a.totalSales).slice(0, 5) || [];
  
  // Real product statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.price || "0") * (p.stock || 0)), 0);

  // Real profit margin calculation
  const avgProfitMargin = productAnalytics && productAnalytics.length > 0 
    ? productAnalytics.reduce((sum, p) => {
        const margin = p.totalRevenue > 0 ? (p.totalProfit / p.totalRevenue) * 100 : 0;
        return sum + margin;
      }, 0) / productAnalytics.length
    : 0;

  if (statsLoading || productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Store
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{t.admin.dashboard}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Link href="/admin/products">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.admin.overview}</TabsTrigger>
            <TabsTrigger value="orders">{t.admin.orders}</TabsTrigger>
            <TabsTrigger value="products">{t.admin.products}</TabsTrigger>
            <TabsTrigger value="settings">{t.admin.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.admin.totalRevenue}</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(orderAnalytics?.totalRevenue || stats?.totalRevenue || 0).toFixed(2)}{settings?.currencySymbol || '€'}</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {orderAnalytics?.monthlyGrowth ? `${orderAnalytics.monthlyGrowth > 0 ? '+' : ''}${orderAnalytics.monthlyGrowth.toFixed(1)}%` : '+0%'} from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.admin.totalOrders}</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.admin.avgOrder}</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(orderAnalytics?.totalProfit || 0).toFixed(2)}{settings?.currencySymbol || '€'}</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Margin: {avgProfitMargin.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.admin.pendingOrders}</CardTitle>
                  <Package className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Requires attention
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                    {/* Products Revenue Chart */}
                    <div className="w-full h-full flex items-end justify-between px-8 py-4">
                      {topProducts.map((product, index) => (
                        <div key={product.name} className="flex flex-col items-center">
                          <div 
                            className="bg-gradient-to-t from-purple-600 to-purple-400 w-8 rounded-t"
                            style={{ height: `${Math.max((product.revenue / Math.max(...topProducts.map(p => p.revenue))) * 100, 10)}%`, minHeight: '20px' }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{product.name.slice(0, 8)}...</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sales} sold</div>
                          </div>
                        </div>
                        <div className="font-bold text-purple-600">${product.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length > 0 ? orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-semibold">#{order.id}</div>
                          <div className="text-sm text-gray-600">{order.customerName}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-bold">{order.totalAmount}€</div>
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'confirmed' || order.status === 'shipped' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune commande pour le moment</p>
                      <p className="text-sm">Les nouvelles commandes apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Order management interface</p>
              <Link href="/admin/orders">
                <Button>Go to Orders Management</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Product management interface</p>
              <Link href="/admin/products">
                <Button>Go to Products Management</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold mb-2">Store Configuration</h3>
                    <p className="text-gray-600">Manage store settings, payment methods, and shipping options.</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold mb-2">Multi-language Settings</h3>
                    <p className="text-gray-600">Configure translations and language preferences.</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold mb-2">WhatsApp Integration</h3>
                    <p className="text-gray-600">Set up WhatsApp number and automated messages.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
