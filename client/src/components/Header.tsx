import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useCart } from "@/hooks/useCart";
import { useSettings } from "@/hooks/useSettings";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Menu, Store, Settings } from "lucide-react";

export function Header() {
  const { t, direction } = useI18n();
  const { cart } = useCart();
  const { data: settings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {settings?.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.storeName || "Store Logo"} 
                className="w-10 h-10 object-cover rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {settings?.storeName || "ModernShop"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.home}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.categories}
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.products}
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.contact}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="h-5 w-5" />
                {cart.count > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {cart.count}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/admin">
              <Button variant="ghost" size="sm" className="p-2" title="Administration">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={direction === 'rtl' ? 'left' : 'right'} className="w-80 bg-gradient-to-b from-purple-50 to-white">
                <div className="mt-8">
                  <div className="text-center mb-8">
                    {settings?.logo ? (
                      <img 
                        src={settings.logo} 
                        alt={settings.storeName || "Store Logo"} 
                        className="w-16 h-16 object-cover rounded-2xl mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <ShoppingCart className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-800">{settings?.storeName || "ModernShop"}</h2>
                  </div>
                  
                  <nav className="space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🏠</span>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">{t.nav.home}</span>
                    </Link>
                    
                    <Link href="/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📂</span>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">{t.nav.categories}</span>
                    </Link>
                    
                    <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">🛍️</span>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">{t.nav.products}</span>
                    </Link>
                    
                    <Link href="#contact" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📞</span>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">{t.nav.contact}</span>
                    </Link>
                    
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition-all duration-200 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">⚙️</span>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">{t.nav.admin}</span>
                    </Link>
                  </nav>
                  
                  <div className="mt-8 px-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">🎯 Navigation rapide</h3>
                      <p className="text-sm text-gray-600">Explorez nos catégories et découvrez nos produits exclusifs</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.common.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
