import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";
import { NotificationIcon } from './NotificationIcon';

interface AdminNotificationProps {
  notification: {
    id: string;
    type: 'new_order';
    orderId: number;
    customerName: string;
    amount: string;
    timestamp: Date;
    read: boolean;
  };
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export function AdminNotification({ notification, onClose, onMarkAsRead }: AdminNotificationProps) {
  const { t, language } = useI18n();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleViewOrder = () => {
    onMarkAsRead(notification.id);
    handleClose();
  };

  const formatAmount = (amount: string) => {
    const settings = { currencySymbol: "DH" }; // Default currency
    return `${amount} ${settings.currencySymbol}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-full duration-300">
      <Card className="w-96 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  {t.notifications.newOrder}
                </h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {t.common.new}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{notification.customerName}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.notifications.newOrderMessage} <span className="font-semibold text-purple-600">{formatAmount(notification.amount)}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t.notifications.confirmOrderStatus}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/admin/orders`}>
              <Button 
                size="sm" 
                onClick={handleViewOrder}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t.common.view}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onMarkAsRead(notification.id)}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              {t.common.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface NotificationManagerProps {
  children: React.ReactNode;
}

export function NotificationManager({ children }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<AdminNotificationProps['notification'][]>([]);

  // Function to add new notification
  const addNotification = (notification: Omit<AdminNotificationProps['notification'], 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto remove after 10 seconds if not manually closed
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 10000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Expose the addNotification function globally
  useEffect(() => {
    (window as any).addAdminNotification = addNotification;
    console.log("Admin notification system initialized");
    
    // Don't remove the function when component unmounts
    // This ensures it's always available globally
  }, [addNotification]);

  return (
    <>
      {children}
      {notifications.map((notification) => (
        <AdminNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onMarkAsRead={markAsRead}
        />
      ))}
    </>
  );
}