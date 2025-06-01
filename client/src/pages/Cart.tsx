import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useCart } from "@/hooks/useCart";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  Phone,
  User,
  CheckCircle
} from "lucide-react";

export default function Cart() {
  const { t, direction } = useI18n();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { previousPath } = useNavigationHistory();
  const { 
    items, 
    getTotalPrice, 
    getTotalItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  // Order form state
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: orderForm.customerName,
        customerPhone: orderForm.customerPhone,
        customerEmail: orderForm.customerEmail,
        deliveryAddress: orderForm.deliveryAddress,
        notes: orderForm.notes,
        totalAmount: getTotalPrice(),
        status: 'pending',
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        
        toast({
          title: t.order.success,
          description: `${t.order.confirmed} #${order.id}`,
        });

        // Clear cart and redirect
        clearCart();
        setLocation('/');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: "Une erreur s'est produite lors de la création de la commande",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h1>
            <p className="text-gray-600 mb-8">Votre panier ne contient aucun article</p>
            <Link href={previousPath}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuer les achats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={previousPath}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
          <Badge variant="secondary" className="ml-auto">
            {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {direction === 'rtl' ? item.product.nameAr : item.product.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {direction === 'rtl' ? item.product.descriptionAr : item.product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            {parseFloat(item.product.price) * item.quantity} DH
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.price} DH × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Résumé de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>
                        {direction === 'rtl' ? item.product.nameAr : item.product.name} × {item.quantity}
                      </span>
                      <span>{parseFloat(item.product.price) * item.quantity} DH</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{getTotalPrice()} DH</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsOrderFormOpen(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Passer la commande
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continuer les achats
                </Button>
              </Link>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vider le panier
              </Button>
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {isOrderFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {t.order.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t.order.name} *
                    </Label>
                    <Input
                      id="customerName"
                      required
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t.order.phone} *
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      required
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      placeholder="0612345678"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={orderForm.customerEmail}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t.order.address} *
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      required
                      value={orderForm.deliveryAddress}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="Adresse complète de livraison"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Instructions spéciales pour la livraison"
                      rows={2}
                    />
                  </div>

                  <Separator />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total à payer:</span>
                      <span className="text-green-600">{getTotalPrice()} DH</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsOrderFormOpen(false)}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t.order.processing : t.order.submit}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}