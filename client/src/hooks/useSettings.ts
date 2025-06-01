import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  currencySymbol: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

const defaultSettings: StoreSettings = {
  storeName: "Store",
  storeDescription: "Modern e-commerce store",
  currencySymbol: "€",
  taxRate: 0,
  shippingCost: 0,
  freeShippingThreshold: 50,
  primaryColor: "#8b5cf6",
  secondaryColor: "#06b6d4",
  accentColor: "#f59e0b",
  metaTitle: "E-commerce Store",
  metaDescription: "Modern e-commerce platform",
  metaKeywords: "ecommerce, shopping, online store"
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['/api/settings'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    select: (data: any[]) => {
      const settings: StoreSettings = { ...defaultSettings };
      
      data?.forEach((setting) => {
        switch (setting.key) {
          case 'store_name':
            settings.storeName = setting.value;
            break;
          case 'store_description':
            settings.storeDescription = setting.value;
            break;
          case 'currency_symbol':
            settings.currencySymbol = setting.value;
            break;
          case 'tax_rate':
            settings.taxRate = parseFloat(setting.value) || 0;
            break;
          case 'shipping_cost':
            settings.shippingCost = parseFloat(setting.value) || 0;
            break;
          case 'free_shipping_threshold':
            settings.freeShippingThreshold = parseFloat(setting.value) || 50;
            break;
          case 'primary_color':
            settings.primaryColor = setting.value;
            break;
          case 'secondary_color':
            settings.secondaryColor = setting.value;
            break;
          case 'accent_color':
            settings.accentColor = setting.value;
            break;
          case 'meta_title':
            settings.metaTitle = setting.value;
            break;
          case 'meta_description':
            settings.metaDescription = setting.value;
            break;
          case 'meta_keywords':
            settings.metaKeywords = setting.value;
            break;
          case 'contact_whatsapp':
            settings.whatsapp = setting.value;
            break;
          case 'social_facebook':
            settings.facebook = setting.value;
            break;
          case 'social_instagram':
            settings.instagram = setting.value;
            break;
          case 'social_twitter':
            settings.twitter = setting.value;
            break;
        }
      });
      
      return settings;
    }
  });
};