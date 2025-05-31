import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { NotificationManager } from './AdminNotification';
import { NotificationIcon } from './NotificationIcon';
import { useI18n } from '@/providers/I18nProvider';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  Users, 
  Store,
  Menu,
  X,
  PlusCircle,
  BarChart3,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useI18n();
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Rediriger vers la page de connexion si pas authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/admin/login');
  };
  
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

  // Menu de navigation
  const navigationItems = [
    {
      title: 'Tableau de bord',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      active: location === '/admin/dashboard' || location === '/admin'
    },
    {
      title: 'Commandes',
      href: '/admin/orders',
      icon: ShoppingCart,
      active: location === '/admin/orders',
      badge: mockNotifications.filter(n => !n.read).length
    },
    {
      title: 'Produits',
      href: '/admin/products',
      icon: Package,
      active: location?.startsWith('/admin/products'),
      submenu: [
        { title: 'Liste des produits', href: '/admin/products' },
        { title: 'Ajouter un produit', href: '/admin/products/new' }
      ]
    },
    {
      title: 'Catégories',
      href: '/admin/categories',
      icon: FolderTree,
      active: location === '/admin/categories'
    },
    {
      title: 'Administrateurs',
      href: '/admin/admins',
      icon: Users,
      active: location === '/admin/admins'
    },
    {
      title: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      active: location === '/admin/settings'
    }
  ];

  return (
    <NotificationManager>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 w-full">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <Button 
                    variant={item.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      item.active && "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Sous-menu pour les produits */}
                {item.submenu && item.active && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.href} href={subItem.href}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {subItem.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Barre supérieure */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full">
            <div className="flex items-center justify-between px-4 py-4 lg:px-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {navigationItems.find(item => item.active)?.title || 'Administration'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <NotificationIcon 
                  notifications={mockNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
                <Link href="/">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Store className="h-4 w-4" />
                    Voir le site
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Zone de contenu */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </NotificationManager>
  );
}