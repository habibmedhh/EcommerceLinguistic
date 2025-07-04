import { useState } from "react";
import { Link, useParams } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useProduct } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const { t, language, direction } = useI18n();
  const { data: product, isLoading } = useProduct(productId);
  const { data: settings } = useSettings();
  const { addToCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  useNavigationHistory(); // Initialize navigation history tracking
  
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
  
  const [formErrors, setFormErrors] = useState({
    customerPhone: ''
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
    // Si le formulaire est complet, procéder directement à la commande
    if (isFormComplete()) {
      handleSubmitOrder();
      return;
    }
    
    // Afficher le message de validation et ouvrir le formulaire
    navigateToForm();
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) {
      return language === 'ar' ? 'يجب أن يحتوي رقم الهاتف على 10 أرقام على الأقل' : 
             language === 'fr' ? 'Le numéro de téléphone doit contenir au moins 10 chiffres' : 
             'Phone number must contain at least 10 digits';
    }
    return '';
  };

  const handleOrderFormChange = (field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
    
    // Validation en temps réel pour le téléphone
    if (field === 'customerPhone') {
      const error = validatePhoneNumber(value);
      setFormErrors(prev => ({ ...prev, customerPhone: error }));
    }
  };

  const isFormComplete = () => {
    const phoneError = validatePhoneNumber(orderForm.customerPhone);
    return orderForm.customerName.trim() && 
           orderForm.customerPhone.trim() && 
           orderForm.deliveryAddress.trim() &&
           !phoneError;
  };

  const navigateToForm = () => {
    // Afficher le message selon la langue
    const message = language === 'ar' ? 'ممتاز! طلبك جاهز 🤩' :
                   language === 'fr' ? 'Très bien ! Votre commande est prête 🤩' :
                   'Great! Your order is ready 🤩';
    
    const fillFormMessage = language === 'ar' ? 'يرجى ملء بياناتك لإتمام الطلب' :
                           language === 'fr' ? 'Remplissez vos informations pour finaliser la commande' :
                           'Please fill in your information to complete the order';

    toast({
      title: message,
      description: fillFormMessage,
      className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
    });
    
    // Ouvrir le formulaire
    setIsOrderFormOpen(true);
  };

  // Animation de confettis
  const createConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 5000);
      }, i * 100);
    }
  };



  const handleSubmitOrder = async () => {
    // Validation du téléphone avant soumission
    const phoneError = validatePhoneNumber(orderForm.customerPhone);
    if (phoneError) {
      setFormErrors(prev => ({ ...prev, customerPhone: phoneError }));
      return;
    }

    // Si le formulaire n'est pas complet, diriger vers le formulaire
    if (!isFormComplete()) {
      navigateToForm();
      return;
    }

    try {
      // Afficher le message de traitement
      toast({
        title: t.order.processing,
        description: "",
        className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0",
      });

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
      
      // Déclencher l'animation de confettis
      createConfetti();
      
      // Afficher le message de confirmation avec couleurs sympas
      toast({
        title: t.order.confirmed,
        description: t.order.success,
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
      });
      
      // Réinitialiser le formulaire
      setOrderForm({ customerName: '', customerPhone: '', deliveryAddress: '' });
      setFormErrors({ customerPhone: '' });
      setIsOrderFormOpen(false);
    } catch (error) {
      toast({
        title: "❌ " + t.common.error,
        description: "Une erreur est survenue lors de l'enregistrement de votre commande",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppOrder = () => {
    // Messages traduits selon la langue
    const greetingText = language === 'ar' ? 'السلام عليكم، أريد طلب:' :
                        language === 'fr' ? 'Bonjour, je souhaite commander:' :
                        'Hello, I would like to order:';
    
    const quantityText = language === 'ar' ? 'الكمية:' :
                        language === 'fr' ? 'Quantité:' :
                        'Quantity:';
    
    const priceText = language === 'ar' ? 'السعر:' :
                     language === 'fr' ? 'Prix:' :
                     'Price:';
    
    const totalPrice = discountedPrice ? discountedPrice * quantity : originalPrice * quantity;
    const currency = settings?.currencySymbol || (language === 'ar' ? ' د.م' : '€');
    
    const message = `${greetingText}\n\n${getLocalizedText('name')}\n${quantityText} ${quantity}\n${priceText} ${totalPrice.toFixed(2)}${currency}`;
    
    // Utiliser le numéro WhatsApp des paramètres ou un numéro par défaut
    const whatsappNumber = settings?.whatsapp || '+33123456789';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
      <SEOHead 
        title={`${getLocalizedText('name')} - ${settings?.storeName || 'Store'}`}
        description={getLocalizedText('description') || `Découvrez ${getLocalizedText('name')} au meilleur prix avec livraison rapide`}
        keywords={`${getLocalizedText('name')}, produit, shopping, e-commerce`}
        ogTitle={`${getLocalizedText('name')} - ${settings?.storeName || 'Store'}`}
        ogDescription={getLocalizedText('description') || `Découvrez ${getLocalizedText('name')} au meilleur prix`}
        ogImage={currentImage}
        ogUrl={window.location.href}
      />
      <Header />
      
      {/* Product Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4" dir={direction}>
            <Link href="/" className="hover:text-purple-600 transition-colors">
              {t.nav.home}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="hover:text-purple-600 transition-colors">
              {t.nav.products}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              {getLocalizedText('name')}
            </span>
          </nav>

          {/* Product Title and Quick Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" dir={direction}>
                {getLocalizedText('name')}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                {product.salePrice && (
                  <Badge variant="destructive" className="text-sm">
                    -{discountPercentage}% {t('sale')}
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-sm">
                    ⭐ {t('featured')}
                  </Badge>
                )}
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">{t('sku')}: {product.sku}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-600 hover:text-purple-600"
              >
                <Heart className="h-4 w-4 mr-1" />
                {t.admin.wishlist}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-gray-600 hover:text-purple-600"
                onClick={() => navigator.share?.({ url: window.location.href, title: getLocalizedText('name') })}
              >
                <Share2 className="h-4 w-4 mr-1" />
                {t.admin.share}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">


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
              <div className={`flex items-center gap-2 mb-4 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                {direction === 'rtl' ? (
                  <>
                    <span className="text-sm text-gray-600">
                      ({product.displayReviewCount || product.reviewCount || 0} تقييم)
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(product.averageRating || "0"))
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(product.averageRating || "0"))
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.displayReviewCount || product.reviewCount || 0} reviews)
                    </span>
                  </>
                )}
              </div>

              {/* Price */}
              <div className={`flex items-center gap-3 mb-6 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                {discountedPrice ? (
                  direction === 'rtl' ? (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {originalPrice.toFixed(2)}{settings?.currencySymbol || ' د.م'}
                      </span>
                      <span className="text-3xl font-bold text-purple-600">
                        {discountedPrice.toFixed(2)}{settings?.currencySymbol || ' د.م'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-purple-600">
                        {discountedPrice.toFixed(2)}{settings?.currencySymbol || '€'}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {originalPrice.toFixed(2)}{settings?.currencySymbol || '€'}
                      </span>
                    </>
                  )
                ) : (
                  <span className="text-3xl font-bold text-purple-600">
                    {originalPrice.toFixed(2)}{settings?.currencySymbol || (language === 'ar' ? ' د.م' : '€')}
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
              <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <label className={`font-medium text-gray-700 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'الكمية' : 
                   language === 'fr' ? 'Quantité:' : 
                   'Quantity:'}
                </label>
                <div className={`flex items-center border rounded-lg ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
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
                    className={`w-20 text-center border-0 focus:ring-0 ${direction === 'rtl' ? 'text-center' : 'text-center'}`}
                    min="1"
                    dir={direction}
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

              <div className={`flex gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={handleAddToCart}
                  className={`flex-1 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
                  variant="outline"
                >
                  <ShoppingCart className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t.products.addToCart}
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  {t.products.orderNow}
                </Button>
              </div>

              <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`${isFavorite ? "text-red-500" : ""} ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'} ${isFavorite ? 'fill-current' : ''}`} />
                  {t.admin.wishlist}
                </Button>
                <Button variant="ghost" size="sm" className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
                  <Share2 className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t.admin.share}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">{t.admin.freeShipping}</span>
              </div>
              <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">{t.admin.securePayment}</span>
              </div>
              <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-700">{t.admin.returns}</span>
              </div>
              <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                <MessageCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-700">{t.admin.support}</span>
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
                  {direction === 'rtl' ? (
                    <>
                      {/* En arabe: montant à gauche, description à droite */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600 animate-pulse">
                          {(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} {settings?.currencySymbol || 'د.م'}
                        </span>
                        <span className="text-lg font-semibold text-gray-700">💰 المجموع</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-semibold text-gray-700">{quantity}</span>
                        <span className="text-sm text-gray-600">📦 الكمية</span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Langues occidentales: description à gauche, montant à droite */}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">
                          💰 {language === 'fr' ? 'Total' : 'Total'}
                        </span>
                        <span className="text-2xl font-bold text-green-600 animate-pulse">
                          {(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} {settings?.currencySymbol || '€'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">
                          📦 {language === 'fr' ? 'Quantité' : 'Quantity'}
                        </span>
                        <span className="text-lg font-semibold text-gray-700">{quantity}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <Button 
                  onClick={handleBuyNow}
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
                  <h3 className="text-lg font-semibold mb-3">{t.admin.description}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {getLocalizedText('description') || t.common.loading}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t.admin.specifications}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium text-gray-700">{t.admin.brand}</dt>
                      <dd className="text-gray-600">{getLocalizedText('name').split(' ')[0] || t.common.error}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">{t.admin.sku}</dt>
                      <dd className="text-gray-600">{product.sku || `PRD-${product.id}`}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">{t.admin.weight}</dt>
                      <dd className="text-gray-600">1.2 kg</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">{t.admin.dimensions}</dt>
                      <dd className="text-gray-600">25 x 15 x 10 cm</dd>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t.admin.reviews}</h3>
                  
                  {/* Statistiques des avis */}
                  <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {product.averageRating ? parseFloat(product.averageRating).toFixed(1) : '0.0'} ⭐
                      </div>
                      <div className="text-sm text-gray-600">Note moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {product.reviewCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">Avis clients</div>
                    </div>
                  </div>

                  {/* Liste des avis */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review: any, index: number) => (
                        <div key={review.id || index} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-gray-900">{review.customerName}</div>
                              <div className="flex items-center gap-1">
                                {"⭐".repeat(review.rating)}
                                <span className="text-sm text-gray-500 ml-2">({review.rating}/5)</span>
                              </div>
                            </div>
                            {review.date && (
                              <div className="text-xs text-gray-400">
                                {new Date(review.date).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun avis pour ce produit</p>
                      <p className="text-sm mt-2">Soyez le premier à laisser un avis !</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Formulaire de commande intégré - masqué sur mobile */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl mt-8 hidden md:block order-form">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.order.title}</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.order.name} *
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
                    {t.order.phone} *
                  </Label>
                  <Input
                    id="customerPhone"
                    value={orderForm.customerPhone}
                    onChange={(e) => handleOrderFormChange('customerPhone', e.target.value)}
                    placeholder="0612345678"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t.order.address} *
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
                  <h4 className="font-semibold mb-3">
                    {language === 'ar' ? 'ملخص الطلب' : 
                     language === 'fr' ? 'Résumé de la commande' : 
                     'Order Summary'}
                  </h4>
                  <div className="space-y-2">
                    {direction === 'rtl' ? (
                      <>
                        {/* En arabe: montant à gauche, label à droite */}
                        <div className="flex justify-between">
                          <span className="font-medium">{getLocalizedText('name')}</span>
                          <span>المنتج:</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">{quantity}</span>
                          <span>الكمية:</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {(discountedPrice ? discountedPrice : originalPrice).toFixed(2)} د.م
                          </span>
                          <span>السعر للوحدة:</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>
                            {(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} د.م
                          </span>
                          <span>المجموع:</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Langues occidentales: label à gauche, montant à droite */}
                        <div className="flex justify-between">
                          <span>
                            {language === 'fr' ? 'Produit:' : 'Product:'}
                          </span>
                          <span className="font-medium">{getLocalizedText('name')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {language === 'fr' ? 'Quantité:' : 'Quantity:'}
                          </span>
                          <span className="font-medium">{quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            {language === 'fr' ? 'Prix unitaire:' : 'Unit Price:'}
                          </span>
                          <span className="font-medium">
                            {(discountedPrice ? discountedPrice : originalPrice).toFixed(2)}{settings?.currencySymbol || '€'}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>
                            {language === 'fr' ? 'Total:' : 'Total:'}
                          </span>
                          <span>
                            {(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)}{settings?.currencySymbol || '€'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleBuyNow}
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
      {/* Bouton de commande flottant animé pour mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-white/95 backdrop-blur-sm border-t shadow-2xl md:hidden z-50">
        <div className="flex gap-3">
          <Button 
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl shadow-lg animate-pulse relative overflow-hidden"
            disabled={createOrder.isPending}
            style={{
              animation: 'order-pulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.6), 0 0 50px rgba(236, 72, 153, 0.4), 0 8px 30px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl animate-bounce" style={{ animation: 'bounce 1s infinite' }}>🛒</span>
              <span className="font-bold">{t.products.order}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl animate-ping"></div>
            </div>
          </Button>
          <Button 
            onClick={handleWhatsAppOrder}
            className="px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg"
            style={{
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
            }}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Modal de formulaire de commande stylé pour mobile */}
      <Dialog open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
        <DialogContent className="sm:max-w-[480px] mx-2 my-4 p-0 gap-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 max-h-[90vh] overflow-y-auto" dir={direction}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-lg">
            <DialogHeader>
              <DialogTitle className="tracking-tight text-center text-2xl font-bold text-white flex items-center justify-center gap-2 pl-[88px] pr-[88px]">
                <span className="text-2xl">🛒</span>
                {language === 'ar' ? 'اطلب الآن' : 
                 language === 'fr' ? 'Commander maintenant' : 
                 'Order Now'}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Résumé de la commande */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 sm:p-4">
              <div className={`flex items-center justify-between mb-2`}>
                {direction === 'rtl' ? (
                  <>
                    {/* En arabe: montant à gauche */}
                    <div className="text-left">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {`${(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} ${settings?.currencySymbol || 'د.م'}`}
                      </div>
                      {discountedPrice && (
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          {`${(originalPrice * quantity).toFixed(2)} ${settings?.currencySymbol || 'د.م'}`}
                        </div>
                      )}
                    </div>
                    {/* En arabe: image et nom à droite */}
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                        <img 
                          src={currentImage} 
                          alt={getLocalizedText('name')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{getLocalizedText('name')}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {`الكمية: ${quantity}`}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Langues occidentales: image et nom à gauche */}
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                        <img 
                          src={currentImage} 
                          alt={getLocalizedText('name')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{getLocalizedText('name')}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {language === 'fr' ? `Quantité: ${quantity}` : `Quantity: ${quantity}`}
                        </p>
                      </div>
                    </div>
                    {/* Langues occidentales: montant à droite */}
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {`${(discountedPrice ? discountedPrice * quantity : originalPrice * quantity).toFixed(2)} ${settings?.currencySymbol || '€'}`}
                      </div>
                      {discountedPrice && (
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          {`${(originalPrice * quantity).toFixed(2)} ${settings?.currencySymbol || '€'}`}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Formulaire */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="modal-customerName" className={`flex items-center gap-2 text-gray-700 font-medium mb-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  {language === 'ar' ? 'الاسم الكامل *' : 
                   language === 'fr' ? 'Nom complet *' : 
                   'Full Name *'}
                </Label>
                <Input
                  id="modal-customerName"
                  value={orderForm.customerName}
                  onChange={(e) => handleOrderFormChange('customerName', e.target.value)}
                  placeholder={t.order.name}
                  className={`h-10 sm:h-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  dir={direction}
                />
              </div>
              
              <div>
                <Label htmlFor="modal-customerPhone" className={`flex items-center gap-2 text-gray-700 font-medium mb-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Phone className="h-3 w-3 text-white" />
                  </div>
                  {language === 'ar' ? 'رقم الهاتف *' : 
                   language === 'fr' ? 'Numéro de téléphone *' : 
                   'Phone Number *'}
                </Label>
                <Input
                  id="modal-customerPhone"
                  value={orderForm.customerPhone}
                  onChange={(e) => handleOrderFormChange('customerPhone', e.target.value)}
                  placeholder={t.order.phone}
                  className={`h-10 sm:h-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors ${direction === 'rtl' ? 'text-right' : 'text-left'} ${formErrors.customerPhone ? 'border-red-500' : ''}`}
                  dir={direction}
                />
                {formErrors.customerPhone && (
                  <p className={`text-red-500 text-sm mt-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {formErrors.customerPhone}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="modal-deliveryAddress" className={`flex items-center gap-2 text-gray-700 font-medium mb-2 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  {language === 'ar' ? 'العنوان *' : 
                   language === 'fr' ? 'Adresse *' : 
                   'Address *'}
                </Label>
                <Textarea
                  id="modal-deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => handleOrderFormChange('deliveryAddress', e.target.value)}
                  placeholder={t.order.address}
                  className={`border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-colors resize-none ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  rows={3}
                  dir={direction}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSubmitOrder}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              disabled={createOrder.isPending}
              style={{
                boxShadow: '0 8px 30px rgba(168, 85, 247, 0.3)'
              }}
            >
              <span className="text-xl">🚀</span>
              {createOrder.isPending ? t.order.processing : t.order.submit}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Galerie d'images détaillées */}
      {productImages.length > 1 && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {language === 'ar' ? 'معرض الصور التفصيلية' : 
               language === 'fr' ? 'Galerie d\'images détaillées' : 
               'Detailed Image Gallery'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="aspect-square">
                    <img
                      src={image}
                      alt={`${getLocalizedText('name')} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Badge pour l'image principale */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {language === 'ar' ? 'رئيسية' : 
                       language === 'fr' ? 'Principale' : 
                       'Main'}
                    </div>
                  )}
                  
                  {/* Numéro de l'image */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}/{productImages.length}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}