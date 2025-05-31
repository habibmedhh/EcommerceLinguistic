import { useState } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from "@/hooks/useCart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, ShoppingCart, Plus, Minus, Truck, RotateCcw, Shield } from "lucide-react";
import { OrderForm } from "./OrderForm";
import type { Product } from "@/types";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const { data: settings } = useSettings();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (!product) return null;

  const getName = () => {
    switch (language) {
      case 'ar': return product.nameAr;
      case 'fr': return product.nameFr;
      default: return product.name;
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ar': return product.descriptionAr;
      case 'fr': return product.descriptionFr;
      default: return product.description;
    }
  };

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const currentPrice = salePrice || price;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: t.products.addToCart,
      description: `${getName()} added to cart`,
    });
  };

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  if (showOrderForm) {
    return (
      <OrderForm
        open={open}
        onClose={() => {
          setShowOrderForm(false);
          onClose();
        }}
        initialItems={[
          {
            productId: product.id,
            quantity,
            price: currentPrice.toString(),
            productName: getName()
          }
        ]}
        totalAmount={(currentPrice * quantity).toString()}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={getName()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.onSale && (
                  <Badge variant="destructive" className="animate-pulse">
                    {discount}% OFF
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-green-500">
                    {t.common.new}
                  </Badge>
                )}
              </div>

              {/* Like Button */}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${getName()} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{getName()}</DialogTitle>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(parseFloat(product.rating || "0")) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {salePrice ? (
                <>
                  <span className="text-4xl font-bold text-purple-600">
                    ${salePrice.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    Save {discount}%
                  </Badge>
                </>
              ) : (
                <span className="text-4xl font-bold text-purple-600">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {getDescription() && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{getDescription()}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">{t.common.quantity}:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (product.stock || 999)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stock && product.stock < 10 && (
                <span className="text-red-500 text-sm">
                  Only {product.stock} left in stock
                </span>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-semibold py-6"
                onClick={handleOrderNow}
              >
                {t.products.orderNow} - ${(currentPrice * quantity).toFixed(2)}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full text-lg font-semibold py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t.products.addToCart}
              </Button>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="h-5 w-5 text-purple-500" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <RotateCcw className="h-5 w-5 text-purple-500" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Shield className="h-5 w-5 text-purple-500" />
                <span>1-year warranty included</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
