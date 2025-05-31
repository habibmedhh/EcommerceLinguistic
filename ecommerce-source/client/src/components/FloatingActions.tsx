import { useState } from "react";
import { useFloatingAnimation, usePulseAnimation } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { MessageCircle, ShoppingCart, ArrowUp, Zap } from "lucide-react";

export function FloatingActions() {
  const { cart } = useCart();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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
        size="lg"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0 relative animate-pulse"
        title="Cart"
        style={{
          animation: 'cart-glow 2s ease-in-out infinite alternate, float 3s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3), 0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="relative">
          <span className="text-2xl animate-bounce" style={{ animation: 'bounce 1s infinite' }}>🛒</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
        </div>
        {cart.count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
            style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)' }}
          >
            {cart.count}
          </Badge>
        )}
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
