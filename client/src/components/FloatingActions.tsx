import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useFloatingAnimation, usePulseAnimation } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { MessageCircle, ShoppingCart, ArrowUp, Zap } from "lucide-react";

export function FloatingActions() {
  const { cart } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const navigateToCart = () => {
    window.location.href = '/cart';
  };
  
  const whatsappRef = useFloatingAnimation(0);
  const cartRef = useFloatingAnimation(0.5);
  const orderRef = usePulseAnimation();

  // Monitor scroll position for scroll-to-top button
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+1234567890";
    const message = "Hello! I'm interested in your products.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-50">
      {/* WhatsApp Button */}
      <Button
        ref={whatsappRef}
        size="lg"
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
        onClick={openWhatsApp}
        title="WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Cart Button */}
      <Button
        ref={cartRef}
        onClick={navigateToCart}
        size="lg"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0 relative animate-pulse group transform hover:scale-110"
        title={cart.count > 0 ? `${cart.count} articles dans votre panier - Cliquez pour finaliser !` : "Votre panier"}
        style={{
          animation: 'cart-glow 2s ease-in-out infinite alternate, float 3s ease-in-out infinite',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.6), 0 0 50px rgba(236, 72, 153, 0.4), 0 4px 25px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="relative">
          <span className="text-3xl animate-bounce" style={{ animation: 'bounce 1s infinite' }}>🛒</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
          {cart.count > 0 && (
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping"></div>
          )}
        </div>
        {cart.count > 0 && (
          <>
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 text-sm flex items-center justify-center animate-pulse font-bold"
              style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}
            >
              {cart.count}
            </Badge>
            {/* Additional visual cue for items in cart */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-green-400 rounded-full animate-pulse"></div>
          </>
        )}
        
        {/* Enhanced tooltip */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          {cart.count > 0 ? `Finaliser ma commande (${cart.count} article${cart.count > 1 ? 's' : ''})` : "Découvrir nos produits"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      </Button>

      {/* Flash Order Button */}
      <Button
        ref={orderRef}
        size="lg"
        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
        title="Flash Order"
      >
        <Zap className="h-6 w-6 text-white" />
      </Button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          size="lg"
          variant="outline"
          className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-0"
          onClick={scrollToTop}
          title="Scroll to Top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
