import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/providers/I18nProvider";
import { NotificationManager } from "@/components/AdminNotification";
import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
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
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/products" component={ProductsManagement} />
      <Route path="/admin/products/new" component={ProductEditorSimple} />
      <Route path="/admin/products/edit/:id" component={ProductEditorSimple} />
      <Route path="/admin/orders" component={OrdersManagement} />
      <Route path="/admin/categories" component={CategoriesManagement} />
      <Route path="/admin/settings" component={StoreSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <NotificationManager>
            <Toaster />
            <Router />
          </NotificationManager>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
