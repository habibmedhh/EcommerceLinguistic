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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowLeft,
  Download,
  Plus,
  Calendar,
  PieChart
} from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
  const [timePeriod, setTimePeriod] = useState("7"); // 7 days, 30 days, 90 days
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: ordersData, isLoading: ordersLoading } = useOrders();
  const { data: orderAnalytics } = useOrderAnalytics();
  const { data: productAnalytics } = useProductAnalytics();
  const { data: dailyStats } = useDailyStats(parseInt(timePeriod));
  const { data: settings } = useSettings();

  const products = productsData?.products || [];
  const orders = ordersData?.orders || [];

  // Use real analytics data - sort by revenue and sales
  const topProductsByRevenue = productAnalytics?.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 4) || [];
  const topProductsBySales = productAnalytics?.sort((a, b) => b.totalSales - a.totalSales).slice(0, 5) || [];
  const topProductsByProfit = productAnalytics?.sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 4) || [];
  
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
              <Link href="/admin/settings">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Store Settings
                </Button>
              </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
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

            {/* Performance Chart with Time Filter */}
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 relative">
                  {dailyStats && dailyStats.length > 0 ? (
                    <div className="w-full h-full">
                      {/* Line Chart Area */}
                      <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 overflow-hidden">
                        <div className="absolute inset-0 bg-grid opacity-5"></div>
                        
                        {/* Revenue Line */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Revenue Area */}
                          <path
                            d={`M 0,${240 - (dailyStats[0]?.revenue || 0) / Math.max(...dailyStats.map(d => d.revenue)) * 200} ${dailyStats.map((day, i) => 
                              `L ${(i / (dailyStats.length - 1)) * 100}%,${240 - (day.revenue / Math.max(...dailyStats.map(d => d.revenue))) * 200}`
                            ).join(' ')} L 100%,240 L 0,240 Z`}
                            fill="url(#revenueGradient)"
                          />
                          
                          {/* Profit Area */}
                          <path
                            d={`M 0,${240 - (dailyStats[0]?.profit || 0) / Math.max(...dailyStats.map(d => d.profit)) * 180} ${dailyStats.map((day, i) => 
                              `L ${(i / (dailyStats.length - 1)) * 100}%,${240 - (day.profit / Math.max(...dailyStats.map(d => d.profit))) * 180}`
                            ).join(' ')} L 100%,240 L 0,240 Z`}
                            fill="url(#profitGradient)"
                          />
                          
                          {/* Revenue Line */}
                          <path
                            d={`M 0,${240 - (dailyStats[0]?.revenue || 0) / Math.max(...dailyStats.map(d => d.revenue)) * 200} ${dailyStats.map((day, i) => 
                              `L ${(i / (dailyStats.length - 1)) * 100}%,${240 - (day.revenue / Math.max(...dailyStats.map(d => d.revenue))) * 200}`
                            ).join(' ')}`}
                            stroke="#3B82F6"
                            strokeWidth="3"
                            fill="none"
                            className="drop-shadow-sm"
                          />
                          
                          {/* Profit Line */}
                          <path
                            d={`M 0,${240 - (dailyStats[0]?.profit || 0) / Math.max(...dailyStats.map(d => d.profit)) * 180} ${dailyStats.map((day, i) => 
                              `L ${(i / (dailyStats.length - 1)) * 100}%,${240 - (day.profit / Math.max(...dailyStats.map(d => d.profit))) * 180}`
                            ).join(' ')}`}
                            stroke="#10B981"
                            strokeWidth="3"
                            fill="none"
                            className="drop-shadow-sm"
                          />
                          
                          {/* Data Points */}
                          {dailyStats.map((day, i) => (
                            <g key={day.date}>
                              <circle
                                cx={`${(i / (dailyStats.length - 1)) * 100}%`}
                                cy={240 - (day.revenue / Math.max(...dailyStats.map(d => d.revenue))) * 200}
                                r="4"
                                fill="#3B82F6"
                                className="drop-shadow-sm hover:r-6 transition-all"
                              />
                              <circle
                                cx={`${(i / (dailyStats.length - 1)) * 100}%`}
                                cy={240 - (day.profit / Math.max(...dailyStats.map(d => d.profit))) * 180}
                                r="4"
                                fill="#10B981"
                                className="drop-shadow-sm hover:r-6 transition-all"
                              />
                            </g>
                          ))}
                        </svg>
                        
                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium">Revenue</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Profit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No performance data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Revenue Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Revenue by Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {topProductsByRevenue.length > 0 ? (
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {topProductsByRevenue.slice(0, 5).map((product, index) => {
                            const total = topProductsByRevenue.reduce((sum, p) => sum + p.totalRevenue, 0);
                            const percentage = (product.totalRevenue / total) * 100;
                            const strokeDasharray = `${percentage * 2.51} 251`;
                            const strokeDashoffset = -index * 2.51 * topProductsByRevenue.slice(0, index).reduce((sum, p) => sum + (p.totalRevenue / total) * 100, 0);
                            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                            
                            return (
                              <circle
                                key={product.id}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={colors[index]}
                                strokeWidth="8"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300 hover:stroke-width-10"
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {settings?.currencySymbol || '$'}{topProductsByRevenue.reduce((sum, p) => sum + p.totalRevenue, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">Total Revenue</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No revenue data</div>
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-2 mt-4">
                    {topProductsByRevenue.slice(0, 5).map((product, index) => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
                      return (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                            <span className="truncate max-w-32">{product.name}</span>
                          </div>
                          <span className="font-medium">{settings?.currencySymbol || '$'}{product.totalRevenue}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Profit Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Profit by Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {topProductsByProfit.length > 0 ? (
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {topProductsByProfit.slice(0, 5).map((product, index) => {
                            const total = topProductsByProfit.reduce((sum, p) => sum + p.totalProfit, 0);
                            const percentage = (product.totalProfit / total) * 100;
                            const strokeDasharray = `${percentage * 2.51} 251`;
                            const strokeDashoffset = -index * 2.51 * topProductsByProfit.slice(0, index).reduce((sum, p) => sum + (p.totalProfit / total) * 100, 0);
                            const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
                            
                            return (
                              <circle
                                key={product.id}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={colors[index]}
                                strokeWidth="8"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300 hover:stroke-width-10"
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {settings?.currencySymbol || '$'}{topProductsByProfit.reduce((sum, p) => sum + p.totalProfit, 0).toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-500">Total Profit</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No profit data</div>
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-2 mt-4">
                    {topProductsByProfit.slice(0, 5).map((product, index) => {
                      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
                      return (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                            <span className="truncate max-w-32">{product.name}</span>
                          </div>
                          <span className="font-medium">{settings?.currencySymbol || '$'}{product.totalProfit.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Best Selling Products */}
            <Card>
              <CardHeader>
                <CardTitle>Best Selling Products (By Quantity)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProductsBySales.length > 0 ? topProductsBySales.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.totalSales} units sold</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{settings?.currencySymbol || '$'}{product.totalRevenue.toLocaleString()}</div>
                        <div className="text-sm text-green-600">{settings?.currencySymbol || '$'}{product.totalProfit.toFixed(2)} profit</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-500 text-center p-8">No sales data available yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

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
