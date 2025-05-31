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

            {/* Sales Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Sales by Amount and Quantity by Date */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Ventes par Date
                  </CardTitle>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7j</SelectItem>
                      <SelectItem value="30">30j</SelectItem>
                      <SelectItem value="90">90j</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Sales Amount Chart */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Montant des Ventes</h4>
                      <div className="space-y-3">
                        {dailyStats && dailyStats.length > 0 ? dailyStats.filter(day => day.revenue > 0).slice(-7).map((day, index) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-20 text-sm text-gray-600">
                                {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                              </div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.max((day.revenue / Math.max(...dailyStats.map(d => d.revenue))) * 100, 2)}%` 
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-blue-600 min-w-20 text-right">
                              {settings?.currencySymbol || 'DH'} {day.revenue.toFixed(2)}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-500 py-4">Aucune vente</div>
                        )}
                      </div>
                    </div>

                    {/* Sales Quantity Chart */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Nombre de Commandes</h4>
                      <div className="space-y-3">
                        {dailyStats && dailyStats.length > 0 ? dailyStats.filter(day => day.orders > 0).slice(-7).map((day, index) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-20 text-sm text-gray-600">
                                {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                              </div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${Math.max((day.orders / Math.max(...dailyStats.map(d => d.orders))) * 100, 5)}%` 
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-indigo-600 min-w-16 text-right">
                              {day.orders} cmd
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-500 py-4">Aucune commande</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Profit by Date */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Bénéfices par Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dailyStats && dailyStats.length > 0 ? dailyStats.filter(day => day.profit > 0).slice(-7).map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString('fr-FR', { 
                                weekday: 'short', 
                                day: '2-digit', 
                                month: '2-digit' 
                              })}
                            </div>
                            <div className="text-sm text-gray-500">{day.orders} commandes</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {settings?.currencySymbol || 'DH'} {day.profit.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">bénéfice</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-500 py-8">Aucun bénéfice enregistré</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profit by Product */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Bénéfices par Produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topProductsByProfit.length > 0 ? topProductsByProfit.slice(0, 6).map((product, index) => (
                    <div key={product.id} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {settings?.currencySymbol || 'DH'} {product.totalProfit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.totalSales} unités vendues</div>
                        <div className="text-sm text-gray-500">
                          {settings?.currencySymbol || 'DH'} {product.totalRevenue.toFixed(2)} revenus
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center text-gray-500 py-8">Aucun produit vendu</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivered Orders Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivered Orders Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                    Colis Livrés - Revenus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'delivered').length > 0 ? (
                      orders.filter(order => order.status === 'delivered').slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">Commande #{order.id}</div>
                              <div className="text-sm text-gray-500">{order.customerName}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600">
                              {settings?.currencySymbol || 'DH'} {order.totalAmount}
                            </div>
                            <div className="text-xs text-gray-500">livré</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">Aucun colis livré</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivered Orders Profit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    Colis Livrés - Bénéfices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'delivered').length > 0 ? (
                      orders.filter(order => order.status === 'delivered').slice(0, 5).map((order) => {
                        const orderProfit = parseFloat(order.totalAmount) * 0.3; // 30% profit margin
                        return (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <div className="font-medium">Commande #{order.id}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.createdAt!).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-orange-600">
                                {settings?.currencySymbol || 'DH'} {orderProfit.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">bénéfice estimé</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-8">Aucun bénéfice de livraison</div>
                    )}
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
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Commandes Récentes
                </CardTitle>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">Voir Tout</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Commande #{order.id}</div>
                            <div className="text-sm text-gray-500">{order.customerName}</div>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'confirmed' || order.status === 'shipped' ? 'secondary' :
                            'destructive'
                          }
                          className="capitalize"
                        >
                          {order.status === 'pending' ? 'En attente' :
                           order.status === 'confirmed' ? 'Confirmée' :
                           order.status === 'shipped' ? 'Expédiée' :
                           order.status === 'delivered' ? 'Livrée' :
                           order.status === 'cancelled' ? 'Annulée' : order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Montant</div>
                          <div className="font-bold text-blue-600">{settings?.currencySymbol || 'DH'} {order.totalAmount}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Date</div>
                          <div className="font-medium">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: '2-digit',
                              year: '2-digit'
                            }) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Téléphone</div>
                          <div className="font-medium">{order.customerPhone}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Adresse</div>
                          <div className="font-medium text-xs truncate" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </div>
                        </div>
                      </div>
                      
                      {order.status === 'delivered' && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Bénéfice estimé: {settings?.currencySymbol || 'DH'} {(parseFloat(order.totalAmount) * 0.3).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
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
