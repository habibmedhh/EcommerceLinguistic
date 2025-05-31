import React from 'react';
import { NotificationManager } from './AdminNotification';
import { NotificationIcon } from './NotificationIcon';
import { useI18n } from '@/providers/I18nProvider';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useI18n();
  
  // Simulation temporaire des notifications pour tester l'interface
  const mockNotifications = [
    {
      id: '1',
      type: 'new_order' as const,
      orderId: 123,
      customerName: 'Ahmed Hassan',
      amount: '€89.99',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false
    },
    {
      id: '2',
      type: 'new_order' as const,
      orderId: 124,
      customerName: 'Sarah Martin',
      amount: '€156.50',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false
    },
    {
      id: '3',
      type: 'new_order' as const,
      orderId: 122,
      customerName: 'Mohammed Al-Rashid',
      amount: '€45.00',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true
    }
  ];

  const handleMarkAsRead = (id: string) => {
    console.log('Marquer comme lu:', id);
    // Ici on ajoutera la logique pour marquer comme lu
  };

  const handleMarkAllAsRead = () => {
    console.log('Marquer tout comme lu');
    // Ici on ajoutera la logique pour tout marquer comme lu
  };

  return (
    <NotificationManager>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Barre de navigation admin */}
        <Card className="rounded-none border-b shadow-sm">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🛡️ Admin Dashboard
              </CardTitle>
              <div className="flex items-center gap-3">
                <NotificationIcon 
                  notifications={mockNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Contenu principal */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </NotificationManager>
  );
}