import { useState } from "react";
import { Link, useParams } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  Phone,
  MapPin,
  User
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = parseInt(id || "0");
  const { t, language } = useI18n();
  const { data: product, isLoading } = useProduct(productId);
  const { addToCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // États du formulaire de commande
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: ''
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="bg-gray-200 h-96 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/4"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getLocalizedText = (field: string) => {
    if (language === 'ar') return (product as any)[`${field}Ar`] || (product as any)[field];
    if (language === 'fr') return (product as any)[`${field}Fr`] || (product as any)[field];
    return (product as any)[field];
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    setIsOrderFormOpen(true);
  };

  const handleOrderFormChange = (field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.deliveryAddress) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        customerName: orderForm.customerName,
        customerPhone: orderForm.customerPhone,
        customerEmail: '',
        deliveryAddress: orderForm.deliveryAddress,
        items: [{
          productId: product.id,
          quantity,
          price: discountedPrice ? discountedPrice.toString() : product.price,
          productName: getLocalizedText('name')
        }],
        totalAmount: (discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)
      };

      await createOrder.mutateAsync(orderData);
      
      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été enregistrée avec succès",
      });
      
      // Réinitialiser le formulaire
      setOrderForm({ customerName: '', customerPhone: '', deliveryAddress: '' });
      setIsOrderFormOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre commande",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je souhaite commander:\n\n${getLocalizedText('name')}\nQuantité: ${quantity}\nPrix: ${discountedPrice ? discountedPrice * quantity : originalPrice * quantity}€`;
    const whatsappUrl = `https://wa.me/+33123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const productImages = Array.isArray(product.images) ? product.images : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'];
  const currentImage = productImages[selectedImage] || '/placeholder-image.jpg';

  const discountedPrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const originalPrice = parseFloat(product.price);
  const discountPercentage = discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-purple-600 transition-colors">
            {t.products.title}
          </Link>
          <span>/</span>
          <span className="text-purple-600 font-medium">
            {getLocalizedText('name')}
          </span>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <div className="aspect-square relative">
                <img
                  src={currentImage}
                  alt={getLocalizedText('name')}
                  className="w-full h-full object-cover"
                />
                {product.salePrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500">
                    Featured
                  </Badge>
                )}
              </div>
            </Card>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-purple-500' 
                        : 'hover:ring-2 hover:ring-purple-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-square">
                      <img
                        src={image}
                        alt={`${getLocalizedText('name')} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getLocalizedText('name')}
              </h1>
              <p className="text-gray-600 mb-4">
                SKU: {product.sku || `PRD-${product.id}`}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(parseFloat(product.rating || "0"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold text-purple-600">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-purple-600">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {getLocalizedText('description') || 'No description available.'}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border-0 focus:ring-0"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1"
                  variant="outline"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t.products.addToCart}
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  {t.products.orderNow}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  Add to Wishlist
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-700">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de commande pour mobile - avant les tabs */}
        <div className="block md:hidden">
          <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  🛒 {t.order.title}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder={`👤 ${t.order.name}`}
                    value={orderForm.customerName}
                    onChange={(e) => handleOrderFormChange('customerName', e.target.value)}
                    className="pl-4 py-3 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div className="relative">
                  <Input
                    placeholder={`📱 ${t.order.phone}`}
                    value={orderForm.customerPhone}
                    onChange={(e) => handleOrderFormChange('customerPhone', e.target.value)}
                    className="pl-4 py-3 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div className="relative">
                  <textarea
                    placeholder={`🏠 ${t.order.address}`}
                    value={orderForm.deliveryAddress}
                    onChange={(e) => handleOrderFormChange('deliveryAddress', e.target.value)}
                    rows={3}
                    className="w-full pl-4 py-3 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg resize-none"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                {/* Résumé de commande avec animation LED */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">💰 Total:</span>
                    <span className="text-2xl font-bold text-green-600 animate-pulse">
                      {(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} DH
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">📦 Quantité:</span>
                    <span className="text-lg font-semibold text-gray-700">{quantity}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={createOrder.isPending}
                  className="w-full py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {createOrder.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Commande en cours...
                      </>
                    ) : (
                      <>
                        🚀 {t.order.submit}
                        <div className="w-2 h-2 bg-white rounded-full animate-ping ml-2"></div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details Tabs */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">{t.admin.description || 'Description'}</TabsTrigger>
                <TabsTrigger value="specifications">{t.admin.specifications || 'Specifications'}</TabsTrigger>
                <TabsTrigger value="reviews">{t.admin.reviews || 'Reviews'}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {getLocalizedText('description') || 'Detailed product description coming soon.'}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-700">Brand</dt>
                      <dd className="text-gray-600">{product.brand || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">SKU</dt>
                      <dd className="text-gray-600">{product.sku || `PRD-${product.id}`}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Weight</dt>
                      <dd className="text-gray-600">{product.weight || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Dimensions</dt>
                      <dd className="text-gray-600">{product.dimensions || 'Not specified'}</dd>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Formulaire de commande intégré */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl mt-8">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Commander ce produit</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet *
                  </Label>
                  <Input
                    id="customerName"
                    value={orderForm.customerName}
                    onChange={(e) => handleOrderFormChange('customerName', e.target.value)}
                    placeholder="Votre nom complet"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone *
                  </Label>
                  <Input
                    id="customerPhone"
                    value={orderForm.customerPhone}
                    onChange={(e) => handleOrderFormChange('customerPhone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse de livraison *
                  </Label>
                  <Textarea
                    id="deliveryAddress"
                    value={orderForm.deliveryAddress}
                    onChange={(e) => handleOrderFormChange('deliveryAddress', e.target.value)}
                    placeholder="Adresse complète de livraison"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Résumé de la commande</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Produit:</span>
                      <span className="font-medium">{getLocalizedText('name')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantité:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix unitaire:</span>
                      <span className="font-medium">{discountedPrice ? `${discountedPrice}€` : `${originalPrice}€`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleSubmitOrder}
                    className="w-full purple-gradient text-white hover:scale-105 transition-transform"
                    size="lg"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? "Traitement..." : "Commander maintenant"}
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppOrder}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Commander via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boutons flottants pour mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden z-50">
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmitOrder}
            className="flex-1 purple-gradient text-white font-bold py-3"
            disabled={createOrder.isPending}
          >
            Commander
          </Button>
          <Button 
            onClick={handleWhatsAppOrder}
            className="px-4 bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}