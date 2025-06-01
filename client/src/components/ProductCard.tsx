import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from "@/hooks/useCart";
import { useScrollAnimation } from "@/hooks/useAnimations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const { data: settings } = useSettings();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const animationRef = useScrollAnimation();

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: t.common.save,
      description: `${getName()} added to cart`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card 
        ref={animationRef}
        className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white cursor-pointer"
      >
        <div className="relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.onSale && (
            <Badge variant="destructive" className="animate-pulse">
              {discount}% {t.products.sale}
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-green-500">
              {t.common.new}
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div className="h-64 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={getName()}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Link href={`/product/${product.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(parseFloat(product.averageRating || "0")) ? 'fill-current' : ''}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.displayReviewCount || product.reviewCount || 0})</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {getName()}
        </h3>

        {/* Description */}
        {getDescription() && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {getDescription()}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {salePrice ? (
            <>
              <span className="text-2xl font-bold text-purple-600">
                {salePrice.toFixed(2)}{settings?.currencySymbol || (language === 'ar' ? ' د.م' : '€')}
              </span>
              <span className="text-lg text-gray-500 line-through">
                {price.toFixed(2)}{settings?.currencySymbol || (language === 'ar' ? ' د.م' : '€')}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-purple-600">
              {price.toFixed(2)}{settings?.currencySymbol || (language === 'ar' ? ' د.م' : '€')}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t.products.addToCart}
          </Button>
        </div>
      </div>
      </Card>
    </Link>
  );
}
