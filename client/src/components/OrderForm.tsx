import { useState } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { useCreateOrder } from "@/hooks/useOrders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { Confetti } from "@/components/Confetti";
import type { OrderRequest } from "@/types";

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  initialItems?: {
    productId: number;
    quantity: number;
    price: string;
    productName: string;
  }[];
  totalAmount?: string;
}

export function OrderForm({ open, onClose, initialItems = [], totalAmount = "0" }: OrderFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      toast({
        title: t.common.error,
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderData: OrderRequest = {
      ...formData,
      items: initialItems,
      totalAmount,
    };

    try {
      await createOrder.mutateAsync(orderData);
      console.log('Order success - setting states:', { isSubmitted: true, showConfetti: true });
      setIsSubmitted(true);
      setShowConfetti(true);
      toast({
        title: t.order.success,
        description: "Your order has been placed successfully!",
      });
    } catch (error) {
      toast({
        title: t.common.error,
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setShowConfetti(false);
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: "",
    });
    onClose();
  };

  if (isSubmitted) {
    return (
      <>
        <Confetti active={showConfetti} duration={4000} pieces={80} />
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="max-w-md">
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t.order.success}
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your order! We'll contact you soon to confirm the details.
              </p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            {t.order.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {initialItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>{t.common.total}:</span>
                  <span className="text-purple-600">${parseFloat(totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerName">{t.order.name} *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder={t.order.name}
                required
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">{t.order.phone} *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder={t.order.phone}
                required
              />
            </div>

            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="deliveryAddress">{t.order.address} *</Label>
              <Textarea
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                placeholder={t.order.address}
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                disabled={createOrder.isPending}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {createOrder.isPending ? t.common.loading : t.order.submit}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
