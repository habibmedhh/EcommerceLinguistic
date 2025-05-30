import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { useOrderStats } from "@/hooks/useOrders";
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
  const { data: stats, isLoading } = useOrderStats();

  const mockChartData = [
    { name: 'Mon', orders: 24, revenue: 2400 },
    { name: 'Tue', orders: 18, revenue: 1800 },
    { name: 'Wed', orders: 32, revenue: 3200 },
    { name: 'Thu', orders: 28, revenue: 2800 },
    { name: 'Fri', orders: 35, revenue: 3500 },
    { name: 'Sat', orders: 42, revenue: 4200 },
    { name: 'Sun', orders: 38, revenue: 3800 },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 129.99, status: 'pending' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'confirmed' },
    { id: '#ORD-003', customer: 'Ahmed Ali', amount: 249.99, status: 'delivered' },
    { id: '#ORD-004', customer: 'Marie Dubois', amount: 159.75, status: 'shipped' },
  ];

  const topProducts = [
    { name: 'Premium Sneakers', sales: 156, revenue: 20124 },
    { name: 'Wireless Headphones', sales: 142, revenue: 28400 },
    { name: 'Designer Watch', sales: 98, revenue: 39200 },
    { name: 'Laptop Backpack', sales: 87, revenue: 8700 },
  ];

  if (isLoading) {
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
                  <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last month
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
                  <div className="text-2xl font-bold">${stats?.avgOrderValue?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -2.1% from last month
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
                    {/* Mock Chart Display */}
                    <div className="w-full h-full flex items-end justify-between px-8 py-4">
                      {mockChartData.map((data, index) => (
                        <div key={data.name} className="flex flex-col items-center">
                          <div 
                            className="bg-purple-500 w-8 rounded-t"
                            style={{ height: `${(data.orders / 50) * 100}%`, minHeight: '20px' }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{data.name}</span>
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
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-sm text-gray-600">{order.customer}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-bold">${order.amount}</div>
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
                  ))}
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
