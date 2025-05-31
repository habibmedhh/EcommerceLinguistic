import { Switch, Route } from "wouter";
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
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsManagement from "@/pages/admin/ProductsManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import CategoriesManagement from "@/pages/admin/CategoriesManagement";
import StoreSettings from "@/pages/admin/StoreSettings";
import ProductEditorSimple from "@/pages/admin/ProductEditorSimple";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/dashboard" component={() => <AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/products" component={() => <AdminLayout><ProductsManagement /></AdminLayout>} />
      <Route path="/admin/products/new" component={() => <AdminLayout><ProductEditorSimple /></AdminLayout>} />
      <Route path="/admin/products/edit/:id" component={() => <AdminLayout><ProductEditorSimple /></AdminLayout>} />
      <Route path="/admin/orders" component={() => <AdminLayout><OrdersManagement /></AdminLayout>} />
      <Route path="/admin/categories" component={() => <AdminLayout><CategoriesManagement /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><StoreSettings /></AdminLayout>} />
      <Route component={NotFound} />
    </Switch>
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
