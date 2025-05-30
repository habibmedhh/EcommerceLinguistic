import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useCategories } from "@/hooks/useCategories";
import { useFeaturedProducts, useSaleProducts } from "@/hooks/useProducts";
import { useScrollAnimation, useParallax } from "@/hooks/useAnimations";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { FloatingActions } from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  TrendingUp, 
  Package, 
  Users,
  BarChart3,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";
import type { Product } from "@/types";

export default function Home() {
  const { t, direction } = useI18n();
  const { data: categories = [] } = useCategories();
  const { data: featuredProducts = [] } = useFeaturedProducts(8);
  const { data: saleProducts = [] } = useSaleProducts(6);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");

  const heroRef = useParallax(0.5);
  const categoriesRef = useScrollAnimation();
  const productsRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const newsletterRef = useScrollAnimation();

  // Countdown timer for flash sale (example: 24 hours)
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter signup:", email);
      setEmail("");
      // Here you would typically call an API to subscribe the user
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-16 h-16 bg-white/15 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/25 rounded-lg animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
                <span className="block">{t.hero.title}</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white/90 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => scrollToSection('products')}
                >
                  {t.hero.cta}
                </Button>
                <Button 
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-xl animate-pulse-custom"
                  onClick={() => scrollToSection('flash-sale')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {t.hero.flashSale}
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>
              {/* Hero Product Showcase */}
              <div className="relative">
                <div className="glass-effect rounded-3xl p-8 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Modern fashion lifestyle"
                    className="rounded-2xl w-full h-80 object-cover shadow-lg"
                  />
                </div>
                
                {/* Floating mini cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float">
                  <Star className="h-6 w-6 text-yellow-500 mb-2" />
                  <div className="text-sm font-bold text-gray-800">4.9★</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-lg font-bold">50% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              {t.categories.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryCard 
                  category={category}
                  onClick={() => scrollToSection('products')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section id="flash-sale" className="py-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Zap className="h-12 w-12" />
              Flash Sale
            </h2>
            <p className="text-xl mb-8">Limited time offers - Don't miss out!</p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[80px]">
                <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[80px]">
                <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[80px]">
                <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm opacity-75">Seconds</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {saleProducts.slice(0, 3).map((product, index) => (
              <div 
                key={product.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold mb-4">
                  {product.salePrice && product.price ? 
                    `${Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF` : 
                    'Sale'
                  }
                </Badge>
                
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="rounded-2xl mb-4 w-full h-48 object-cover"
                  />
                )}
                
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl font-bold">
                    ${parseFloat(product.salePrice || product.price).toFixed(2)}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg line-through opacity-75">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <Button 
                  className="w-full bg-white text-red-500 hover:bg-white/90 font-bold py-3 rounded-2xl"
                  onClick={() => setSelectedProduct(product)}
                >
                  Shop Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" ref={productsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              {t.products.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard 
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="purple-gradient text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 purple-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl lg:text-6xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl lg:text-6xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Products</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl lg:text-6xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Categories</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl lg:text-6xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section ref={newsletterRef} className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 animate-slide-up">
              {t.newsletter.title}
            </h2>
            <p className="text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t.newsletter.subtitle}
            </p>
            
            <form 
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 bg-transparent text-white placeholder-white/70 border-0 focus-visible:ring-0 px-6 py-4"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-white text-purple-600 hover:bg-white/90 px-8 py-4 font-bold"
                >
                  {t.newsletter.button}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 purple-gradient rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ModernShop</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for ultra-modern e-commerce experiences with premium quality products.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="rounded-lg border-gray-700 hover:bg-purple-500 hover:border-purple-500">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg border-gray-700 hover:bg-purple-500 hover:border-purple-500">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg border-gray-700 hover:bg-purple-500 hover:border-purple-500">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">{t.footer.contact}</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span>info@modernshop.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span>123 Commerce St, City</span>
                </div>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div>
              <h3 className="text-lg font-bold mb-4">{t.footer.hours}</h3>
              <div className="space-y-2 text-gray-400">
                <div>Mon - Fri: 9:00 AM - 8:00 PM</div>
                <div>Saturday: 10:00 AM - 6:00 PM</div>
                <div>Sunday: 12:00 PM - 5:00 PM</div>
              </div>
            </div>
            
            {/* WhatsApp & Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">{t.footer.whatsapp}</h3>
              <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-2xl font-bold mb-4 w-full">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat Now
              </Button>
              <div className="space-y-2 text-gray-400">
                <div><a href="#" className="hover:text-purple-400 transition-colors">{t.footer.privacy}</a></div>
                <div><a href="#" className="hover:text-purple-400 transition-colors">{t.footer.terms}</a></div>
                <div><a href="#" className="hover:text-purple-400 transition-colors">{t.footer.shipping}</a></div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ModernShop. All rights reserved. Built with ❤️ for modern commerce.</p>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <FloatingActions />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
