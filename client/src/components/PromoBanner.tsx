import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Gift, Truck, Trophy } from "lucide-react";

interface PromoMessage {
  id: string;
  messageEn: string;
  messageFr: string;
  messageAr: string;
  icon: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

export function PromoBanner() {
  const { t, language, direction } = useI18n();
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [promoMessages, setPromoMessages] = useState<PromoMessage[]>([]);

  // Default promotional messages
  const defaultMessages: PromoMessage[] = [
    {
      id: "free-shipping",
      messageEn: "🚚 Free shipping everywhere!",
      messageFr: "🚚 Livraison gratuite partout !",
      messageAr: "🚚 شحن مجاني في كل مكان !",
      icon: "truck",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      textColor: "text-white",
      isActive: true
    },
    {
      id: "lottery",
      messageEn: "🎁 Buy and participate in the lottery!",
      messageFr: "🎁 Achetez et participez à la tombola !",
      messageAr: "🎁 اشتري وشارك في السحب !",
      icon: "gift",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-600",
      textColor: "text-white",
      isActive: true
    },
    {
      id: "prize",
      messageEn: "🏆 This month's lottery: iPhone 15 Pro!",
      messageFr: "🏆 Tombola de ce mois : iPhone 15 Pro !",
      messageAr: "🏆 سحب هذا الشهر : آيفون 15 برو !",
      icon: "trophy",
      bgColor: "bg-gradient-to-r from-orange-500 to-red-600",
      textColor: "text-white",
      isActive: true
    }
  ];

  useEffect(() => {
    // Load promotional messages from settings or use defaults
    const loadPromoMessages = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          const promoSettings = settings.find((s: any) => s.key === 'promo_messages');
          
          if (promoSettings && promoSettings.value) {
            setPromoMessages(JSON.parse(promoSettings.value));
          } else {
            setPromoMessages(defaultMessages);
          }
        } else {
          setPromoMessages(defaultMessages);
        }
      } catch (error) {
        console.error('Failed to load promo messages:', error);
        setPromoMessages(defaultMessages);
      }
    };

    loadPromoMessages();

    // Listen for promo messages updates
    const handlePromoUpdate = () => {
      loadPromoMessages();
    };
    
    window.addEventListener('promoMessagesUpdated', handlePromoUpdate);

    // Reload messages every 30 seconds to catch updates as fallback
    const interval = setInterval(loadPromoMessages, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('promoMessagesUpdated', handlePromoUpdate);
    };
  }, []);

  useEffect(() => {
    // Check if banner was closed by user
    const bannerClosed = localStorage.getItem('promo-banner-closed');
    if (bannerClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    // Auto-rotate messages every 4 seconds
    if (promoMessages.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => 
          (prev + 1) % promoMessages.filter(msg => msg.isActive).length
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [promoMessages, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promo-banner-closed', 'true');
  };

  const activeMessages = promoMessages.filter(msg => msg.isActive);

  if (!isVisible || activeMessages.length === 0) {
    return null;
  }

  const currentMessage = activeMessages[currentMessageIndex];
  if (!currentMessage) return null;

  const getMessage = () => {
    switch (language) {
      case 'fr':
        return currentMessage.messageFr;
      case 'ar':
        return currentMessage.messageAr;
      default:
        return currentMessage.messageEn;
    }
  };

  const getIcon = () => {
    switch (currentMessage.icon) {
      case 'truck':
        return <Truck className="h-5 w-5" />;
      case 'gift':
        return <Gift className="h-5 w-5" />;
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <Card className={`mx-4 my-1 overflow-hidden border-0 shadow-lg ${currentMessage.bgColor}`}>
        <div className="px-4 py-2" dir={direction}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`${currentMessage.textColor} flex-shrink-0`}>
                {getIcon()}
              </div>
              
              <div className={`font-medium text-center flex-1 ${currentMessage.textColor} text-sm`}>
                {getMessage()}
              </div>
              
              {/* Progress indicator for multiple messages */}
              {activeMessages.length > 1 && (
                <div className="flex gap-1 flex-shrink-0">
                  {activeMessages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === currentMessageIndex 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className={`${currentMessage.textColor} hover:bg-white/20 p-1 h-auto flex-shrink-0 ml-2`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}