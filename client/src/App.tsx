import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/providers/I18nProvider";
import { AdminLayout } from "@/components/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import AdminLogin from "@/pages/AdminLogin";
import FirstInstall from "@/pages/FirstInstall";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CategoriesManagement from "@/pages/admin/CategoriesManagement";
import StoreSettings from "@/pages/admin/StoreSettings";
import AdminManagement from "@/pages/admin/AdminManagement";
import ProductEditorSimple from "@/pages/admin/ProductEditorSimple";
import PromoMessagesManagement from "@/pages/admin/PromoMessagesManagement";
import NotFound from "@/pages/not-found";

// Composant pour gérer le défilement vers le haut lors des changements de route
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/first-install" component={FirstInstall} />
      <Route path="/admin" component={() => <AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/dashboard" component={() => <AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/products" component={() => <AdminLayout><ProductsManagement /></AdminLayout>} />
      <Route path="/admin/products/new" component={() => <AdminLayout><ProductEditorSimple /></AdminLayout>} />
      <Route path="/admin/products/edit/:id" component={() => <AdminLayout><ProductEditorSimple /></AdminLayout>} />
      <Route path="/admin/orders" component={() => <AdminLayout><OrdersManagement /></AdminLayout>} />
      <Route path="/admin/categories" component={() => <AdminLayout><CategoriesManagement /></AdminLayout>} />
      <Route path="/admin/admins" component={() => <AdminLayout><AdminManagement /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><StoreSettings /></AdminLayout>} />
      <Route path="/admin/promo-messages" component={() => <AdminLayout><PromoMessagesManagement /></AdminLayout>} />
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
