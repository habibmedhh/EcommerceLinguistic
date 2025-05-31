import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useOrders, useOrder, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Filter,
  Calendar,
  Phone,
  MapPin,
  User,
  Package,
  Printer,
  TrendingUp,
  CalendarDays
} from "lucide-react";
import type { Order } from "@/types";

export default function OrdersManagement() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: orders, isLoading } = useOrders();
  const { data: settings } = useSettings();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Get detailed order with items when viewing details
  const { data: orderDetails } = useOrder(selectedOrderId || 0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [bulkEditData, setBulkEditData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: ""
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const filteredOrders = orders?.orders?.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    // Date filtering
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const orderDate = new Date(order.createdAt!);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        matchesDate = matchesDate && orderDate >= fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59); // End of day
        matchesDate = matchesDate && orderDate <= toDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder.mutateAsync(orderId);
        toast({
          title: "Success",
          description: "Order deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const calculateOrderProfit = (order: any) => {
    return (parseFloat(order.totalAmount) * 0.3).toFixed(2); // 30% profit margin
  };

  const printOrderLabel = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Étiquette Commande #${order.id}</title>
            <style>
              @page {
                size: 100mm 150mm;
                margin: 0;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 8mm;
                width: 84mm;
                height: 134mm;
                box-sizing: border-box;
              }
              .label { 
                border: 2px solid #000; 
                padding: 8mm;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
              }
              .header { 
                text-align: center; 
                border-bottom: 1px solid #000; 
                margin-bottom: 6mm; 
                padding-bottom: 4mm; 
              }
              .header h2 { 
                margin: 0; 
                font-size: 18px; 
                font-weight: bold; 
              }
              .section { 
                margin: 3mm 0; 
                font-size: 12px;
              }
              .bold { 
                font-weight: bold; 
                margin-bottom: 2mm;
              }
              .barcode { 
                text-align: center; 
                font-family: monospace; 
                font-size: 14px; 
                margin-top: auto;
                padding-top: 4mm;
                border-top: 1px solid #000;
              }
              .amount {
                font-size: 16px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="header">
                <h2>COMMANDE #${order.id}</h2>
              </div>
              <div class="section">
                <div class="bold">Client:</div>
                <div>${order.customerName}</div>
                <div>${order.customerPhone}</div>
              </div>
              <div class="section">
                <div class="bold">Adresse:</div>
                <div>${order.deliveryAddress}</div>
              </div>
              <div class="section">
                <div class="bold">Montant:</div>
                <div class="amount">${settings?.currencySymbol || 'DH'} ${order.totalAmount}</div>
              </div>
              <div class="section">
                <div class="bold">Statut:</div>
                <div>${order.status === 'pending' ? 'En attente' :
                       order.status === 'confirmed' ? 'Confirmée' :
                       order.status === 'shipped' ? 'Expédiée' :
                       order.status === 'delivered' ? 'Livrée' :
                       order.status === 'cancelled' ? 'Annulée' : order.status}</div>
              </div>
              <div class="section">
                <div class="bold">Date:</div>
                <div>${new Date(order.createdAt!).toLocaleDateString('fr-FR')}</div>
              </div>
              <div class="barcode">
                ||||| ${order.id.toString().padStart(8, '0')} |||||
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printMultipleLabels = () => {
    if (selectedOrderIds.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une commande",
        variant: "destructive",
      });
      return;
    }

    const selectedOrders = filteredOrders.filter(order => selectedOrderIds.includes(order.id));
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      let labelsHtml = '';
      selectedOrders.forEach((order, index) => {
        labelsHtml += `
          <div class="label" ${index > 0 ? 'style="page-break-before: always;"' : ''}>
            <div class="header">
              <h2>COMMANDE #${order.id}</h2>
            </div>
            <div class="section">
              <div class="bold">Client:</div>
              <div>${order.customerName}</div>
              <div>${order.customerPhone}</div>
            </div>
            <div class="section">
              <div class="bold">Adresse:</div>
              <div>${order.deliveryAddress}</div>
            </div>
            <div class="section">
              <div class="bold">Montant:</div>
              <div class="amount">${settings?.currencySymbol || 'DH'} ${order.totalAmount}</div>
            </div>
            <div class="section">
              <div class="bold">Statut:</div>
              <div>${order.status === 'pending' ? 'En attente' :
                     order.status === 'confirmed' ? 'Confirmée' :
                     order.status === 'shipped' ? 'Expédiée' :
                     order.status === 'delivered' ? 'Livrée' :
                     order.status === 'cancelled' ? 'Annulée' : order.status}</div>
            </div>
            <div class="section">
              <div class="bold">Date:</div>
              <div>${new Date(order.createdAt!).toLocaleDateString('fr-FR')}</div>
            </div>
            <div class="barcode">
              ||||| ${order.id.toString().padStart(8, '0')} |||||
            </div>
          </div>
        `;
      });

      printWindow.document.write(`
        <html>
          <head>
            <title>Étiquettes Multiples</title>
            <style>
              @page {
                size: 100mm 150mm;
                margin: 0;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 8mm;
                width: 84mm;
                box-sizing: border-box;
              }
              .label { 
                border: 2px solid #000; 
                padding: 8mm;
                height: 134mm;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
              }
              .header { 
                text-align: center; 
                border-bottom: 1px solid #000; 
                margin-bottom: 6mm; 
                padding-bottom: 4mm; 
              }
              .header h2 { 
                margin: 0; 
                font-size: 18px; 
                font-weight: bold; 
              }
              .section { 
                margin: 3mm 0; 
                font-size: 12px;
              }
              .bold { 
                font-weight: bold; 
                margin-bottom: 2mm;
              }
              .barcode { 
                text-align: center; 
                font-family: monospace; 
                font-size: 14px; 
                margin-top: auto;
                padding-top: 4mm;
                border-top: 1px solid #000;
              }
              .amount {
                font-size: 16px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            ${labelsHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(order => order.id));
    }
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail || '',
      deliveryAddress: order.deliveryAddress
    });
    setIsEditDialogOpen(true);
  };

  const saveOrderChanges = async () => {
    if (!editingOrder) return;
    
    try {
      // API call to update order customer info
      const response = await fetch(`/api/orders/${editingOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: editingOrder.customerName,
          customerPhone: editingOrder.customerPhone,
          customerEmail: editingOrder.customerEmail,
          deliveryAddress: editingOrder.deliveryAddress
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Informations client mises à jour",
        });
        setIsEditDialogOpen(false);
        setEditingOrder(null);
        // Refresh orders data
        window.location.reload();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ["ID Commande", "Client", "Téléphone", "Email", "Adresse", "Montant", "Bénéfice", "Statut", "Date"].join(","),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.customerName}"`,
        order.customerPhone,
        `"${order.customerEmail || 'N/A'}"`,
        `"${order.deliveryAddress}"`,
        `${settings?.currencySymbol || 'DH'} ${order.totalAmount}`,
        `${settings?.currencySymbol || 'DH'} ${calculateOrderProfit(order)}`,
        order.status === 'pending' ? 'En attente' :
        order.status === 'confirmed' ? 'Confirmée' :
        order.status === 'shipped' ? 'Expédiée' :
        order.status === 'delivered' ? 'Livrée' :
        order.status === 'cancelled' ? 'Annulée' : order.status,
        new Date(order.createdAt!).toLocaleDateString('fr-FR')
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Orders Management</h1>
            </div>
            
            <div className="flex gap-2">
              {selectedOrderIds.length > 0 && (
                <Button onClick={printMultipleLabels} variant="outline" className="bg-blue-50">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer {selectedOrderIds.length} étiquette{selectedOrderIds.length > 1 ? 's' : ''}
                </Button>
              )}
              <Button onClick={exportOrders} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, téléphone, ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Date de début"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Date de fin"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders?.total || 0}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredOrders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredOrders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={selectAllOrders}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">ID Commande</th>
                    <th className="text-left py-3 px-4 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold">Montant</th>
                    <th className="text-left py-3 px-4 font-semibold">Bénéfice</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        #{order.id.toString().padStart(4, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-purple-600">
                          {settings?.currencySymbol || 'DH'} {parseFloat(order.totalAmount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {settings?.currencySymbol || 'DH'} {calculateOrderProfit(order)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                                {order.status === 'pending' ? 'En attente' :
                                 order.status === 'confirmed' ? 'Confirmée' :
                                 order.status === 'shipped' ? 'Expédiée' :
                                 order.status === 'delivered' ? 'Livrée' :
                                 order.status === 'cancelled' ? 'Annulée' : order.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="shipped">Expédiée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt!).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setSelectedOrderId(order.id);
                              setIsOrderDialogOpen(true);
                            }}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printOrderLabel(order)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Imprimer l'étiquette"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrder(order)}
                            className="text-green-600 hover:text-green-700"
                            title="Modifier les informations"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt!).toLocaleString()}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${statusColors[selectedOrder.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Total:</span> <span className="text-purple-600 font-bold">{parseFloat(selectedOrder.totalAmount).toFixed(2)}{settings?.currencySymbol || '€'}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customerPhone}</span>
                    </p>
                    {selectedOrder.customerEmail && (
                      <p className="flex items-center gap-2">
                        <span className="text-gray-400">@</span>
                        <span>{selectedOrder.customerEmail}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </p>
                </div>
              </div>
              
              {/* Ordered Products */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produits commandés
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  {orderDetails?.items && orderDetails.items.length > 0 ? (
                    <div className="space-y-0">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="p-3 border-b last:border-b-0 flex items-center justify-between bg-gray-50">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.product.nameAr}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Quantité: {item.quantity}</p>
                            <p className="text-sm text-purple-600 font-bold">
                              {parseFloat(item.price).toFixed(2)} {settings?.currencySymbol || 'DH'}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-blue-50 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total de la commande:</span>
                          <span className="font-bold text-lg text-blue-600">
                            {parseFloat(selectedOrder.totalAmount).toFixed(2)} {settings?.currencySymbol || 'DH'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun produit trouvé pour cette commande</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier les informations client</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom du client</label>
                <Input
                  value={editingOrder.customerName}
                  onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  value={editingOrder.customerPhone}
                  onChange={(e) => setEditingOrder({...editingOrder, customerPhone: e.target.value})}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email (optionnel)</label>
                <Input
                  value={editingOrder.customerEmail}
                  onChange={(e) => setEditingOrder({...editingOrder, customerEmail: e.target.value})}
                  placeholder="Adresse email"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Adresse de livraison</label>
                <Input
                  value={editingOrder.deliveryAddress}
                  onChange={(e) => setEditingOrder({...editingOrder, deliveryAddress: e.target.value})}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={saveOrderChanges} className="flex-1">
                  Sauvegarder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
