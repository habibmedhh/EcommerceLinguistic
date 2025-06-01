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

  // Load promotional messages
  const loadPromoMessages = async () => {
    try {
      console.log('Loading promotional messages...');
      const response = await fetch('/api/settings?_=' + Date.now());
      if (response.ok) {
        const settings = await response.json();
        console.log('Settings loaded:', settings.length);
        const promoSettings = settings.find((s: any) => s.key === 'promo_messages');
        
        if (promoSettings && promoSettings.value) {
          const newMessages = JSON.parse(promoSettings.value);
          console.log('Found promo messages in settings:', newMessages);
          setPromoMessages(newMessages);
          setCurrentMessageIndex(0); // Reset to first message
        } else {
          console.log('No promo messages found in settings, using defaults');
          setPromoMessages(defaultMessages);
        }
      } else {
        console.log('Settings API failed, using defaults');
        setPromoMessages(defaultMessages);
      }
    } catch (error) {
      console.error('Failed to load promo messages:', error);
      setPromoMessages(defaultMessages);
    }
  };

  useEffect(() => {
    // Initial load
    loadPromoMessages();

    // Listen for updates from admin panel
    const handlePromoUpdate = () => {
      console.log('Promo messages update triggered');
      setTimeout(() => {
        loadPromoMessages();
      }, 500);
    };
    
    window.addEventListener('promoMessagesUpdated', handlePromoUpdate);
    
    return () => {
      window.removeEventListener('promoMessagesUpdated', handlePromoUpdate);
    };
  }, []);

  useEffect(() => {
    // Check if banner was closed by user recently (reset after 24 hours)
    const bannerClosed = localStorage.getItem('promo-banner-closed');
    const closedTime = localStorage.getItem('promo-banner-closed-time');
    
    if (bannerClosed === 'true' && closedTime) {
      const closedTimestamp = parseInt(closedTime);
      const currentTime = Date.now();
      const hoursSinceClosed = (currentTime - closedTimestamp) / (1000 * 60 * 60);
      
      // Show banner again after 24 hours
      if (hoursSinceClosed > 24) {
        localStorage.removeItem('promo-banner-closed');
        localStorage.removeItem('promo-banner-closed-time');
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  }, []);

  useEffect(() => {
    // Auto-rotate messages every 4 seconds
    const activeMessages = promoMessages.filter(msg => msg.isActive);
    if (activeMessages.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % activeMessages.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [promoMessages, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promo-banner-closed', 'true');
    localStorage.setItem('promo-banner-closed-time', Date.now().toString());
  };

  const activeMessages = promoMessages.filter(msg => msg.isActive);

  if (!isVisible || activeMessages.length === 0) {
    return null;
  }

  const currentMessage = activeMessages[currentMessageIndex % activeMessages.length];

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
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 transition-all duration-500 translate-y-0 pl-[150px] pr-[150px]">
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