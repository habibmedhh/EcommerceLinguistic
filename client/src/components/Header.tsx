import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/hooks/useCart";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Menu, Store } from "lucide-react";

export function Header() {
  const { t, direction } = useI18n();
  const { cart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ModernShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.home}
            </Link>
            <Link href="#categories" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.categories}
            </Link>
            <Link href="#products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.products}
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.contact}
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {t.nav.admin}
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

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={direction === 'rtl' ? 'left' : 'right'} className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2">
                    {t.nav.home}
                  </Link>
                  <Link href="#categories" className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2">
                    {t.nav.categories}
                  </Link>
                  <Link href="#products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2">
                    {t.nav.products}
                  </Link>
                  <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2">
                    {t.nav.contact}
                  </Link>
                  <Link href="/admin" className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2">
                    {t.nav.admin}
                  </Link>
                </nav>
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
