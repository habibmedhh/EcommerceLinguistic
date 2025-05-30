import { createContext, useContext } from "react";

export interface Translation {
  // Navigation
  nav: {
    home: string;
    categories: string;
    products: string;
    contact: string;
    admin: string;
  };
  // Hero section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    flashSale: string;
  };
  // Categories
  categories: {
    title: string;
    fashion: string;
    electronics: string;
    home: string;
    sports: string;
    beauty: string;
    books: string;
  };
  // Products
  products: {
    title: string;
    orderNow: string;
    addToCart: string;
    quickView: string;
    sale: string;
    filters: string;
    sortBy: string;
    priceRange: string;
    brand: string;
    applyFilters: string;
  };
  // Order form
  order: {
    title: string;
    name: string;
    phone: string;
    address: string;
    submit: string;
    success: string;
  };
  // Newsletter
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
  };
  // Footer
  footer: {
    contact: string;
    hours: string;
    social: string;
    whatsapp: string;
    about: string;
    privacy: string;
    terms: string;
    shipping: string;
  };
  // Admin
  admin: {
    dashboard: string;
    orders: string;
    products: string;
    settings: string;
    overview: string;
    totalOrders: string;
    totalRevenue: string;
    avgOrder: string;
    pendingOrders: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    new: string;
    search: string;
    filter: string;
    sort: string;
    price: string;
    quantity: string;
    total: string;
    status: string;
    date: string;
    actions: string;
  };
}

export const translations: Record<string, Translation> = {
  en: {
    nav: {
      home: "Home",
      categories: "Categories",
      products: "Products",
      contact: "Contact",
      admin: "Admin"
    },
    hero: {
      title: "Discover the Future of Shopping",
      subtitle: "Ultra-modern e-commerce experience with exclusive products and unbeatable prices",
      cta: "Shop Now",
      flashSale: "Flash Sale"
    },
    categories: {
      title: "Shop by Category",
      fashion: "Fashion",
      electronics: "Electronics",
      home: "Home & Garden",
      sports: "Sports & Fitness",
      beauty: "Beauty & Health",
      books: "Books & Media"
    },
    products: {
      title: "Featured Products",
      orderNow: "Order Now",
      addToCart: "Add to Cart",
      quickView: "Quick View",
      sale: "Sale",
      filters: "Filters",
      sortBy: "Sort by",
      priceRange: "Price Range",
      brand: "Brand",
      applyFilters: "Apply Filters"
    },
    order: {
      title: "Order Now",
      name: "Full Name",
      phone: "Phone Number",
      address: "Delivery Address",
      submit: "Place Order",
      success: "Order placed successfully!"
    },
    newsletter: {
      title: "Stay Updated",
      subtitle: "Get the latest deals and exclusive offers",
      placeholder: "Enter your email",
      button: "Subscribe"
    },
    footer: {
      contact: "Contact Us",
      hours: "Opening Hours",
      social: "Follow Us",
      whatsapp: "WhatsApp Us",
      about: "About Us",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      shipping: "Shipping Info"
    },
    admin: {
      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      settings: "Settings",
      overview: "Overview",
      totalOrders: "Total Orders",
      totalRevenue: "Total Revenue",
      avgOrder: "Avg Order",
      pendingOrders: "Pending Orders"
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      new: "New",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      status: "Status",
      date: "Date",
      actions: "Actions"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      categories: "Catégories",
      products: "Produits",
      contact: "Contact",
      admin: "Admin"
    },
    hero: {
      title: "Découvrez l'Avenir du Shopping",
      subtitle: "Expérience e-commerce ultra-moderne avec des produits exclusifs et des prix imbattables",
      cta: "Acheter Maintenant",
      flashSale: "Vente Flash"
    },
    categories: {
      title: "Acheter par Catégorie",
      fashion: "Mode",
      electronics: "Électronique",
      home: "Maison & Jardin",
      sports: "Sport & Fitness",
      beauty: "Beauté & Santé",
      books: "Livres & Média"
    },
    products: {
      title: "Produits Vedettes",
      orderNow: "Commander",
      addToCart: "Ajouter au Panier",
      quickView: "Aperçu Rapide",
      sale: "Solde",
      filters: "Filtres",
      sortBy: "Trier par",
      priceRange: "Gamme de prix",
      brand: "Marque",
      applyFilters: "Appliquer les filtres"
    },
    order: {
      title: "Commander maintenant",
      name: "Nom complet",
      phone: "Numéro de téléphone",
      address: "Adresse de livraison",
      submit: "Passer la commande",
      success: "Commande passée avec succès!"
    },
    newsletter: {
      title: "Restez Informé",
      subtitle: "Recevez les dernières offres et promotions exclusives",
      placeholder: "Entrez votre email",
      button: "S'abonner"
    },
    footer: {
      contact: "Nous Contacter",
      hours: "Heures d'Ouverture",
      social: "Suivez-Nous",
      whatsapp: "WhatsApp",
      about: "À propos",
      privacy: "Politique de confidentialité",
      terms: "Conditions de service",
      shipping: "Info livraison"
    },
    admin: {
      dashboard: "Tableau de bord",
      orders: "Commandes",
      products: "Produits",
      settings: "Paramètres",
      overview: "Aperçu",
      totalOrders: "Total Commandes",
      totalRevenue: "Chiffre d'affaires",
      avgOrder: "Commande moy.",
      pendingOrders: "En attente"
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur s'est produite",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      new: "Nouveau",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      price: "Prix",
      quantity: "Quantité",
      total: "Total",
      status: "Statut",
      date: "Date",
      actions: "Actions"
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      categories: "الفئات",
      products: "المنتجات",
      contact: "اتصل بنا",
      admin: "الإدارة"
    },
    hero: {
      title: "اكتشف مستقبل التسوق",
      subtitle: "تجربة تجارة إلكترونية فائقة الحداثة مع منتجات حصرية وأسعار لا تقاوم",
      cta: "تسوق الآن",
      flashSale: "تخفيض سريع"
    },
    categories: {
      title: "تسوق حسب الفئة",
      fashion: "الموضة",
      electronics: "الإلكترونيات",
      home: "المنزل والحديقة",
      sports: "الرياضة واللياقة",
      beauty: "الجمال والصحة",
      books: "الكتب والإعلام"
    },
    products: {
      title: "المنتجات المميزة",
      orderNow: "اطلب الآن",
      addToCart: "أضف للسلة",
      quickView: "عرض سريع",
      sale: "تخفيض",
      filters: "المرشحات",
      sortBy: "ترتيب حسب",
      priceRange: "نطاق السعر",
      brand: "العلامة التجارية",
      applyFilters: "تطبيق المرشحات"
    },
    order: {
      title: "اطلب الآن",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      address: "عنوان التوصيل",
      submit: "إرسال الطلب",
      success: "تم إرسال الطلب بنجاح!"
    },
    newsletter: {
      title: "ابق على اطلاع",
      subtitle: "احصل على أحدث العروض والعروض الحصرية",
      placeholder: "أدخل بريدك الإلكتروني",
      button: "اشترك"
    },
    footer: {
      contact: "اتصل بنا",
      hours: "ساعات العمل",
      social: "تابعنا",
      whatsapp: "واتساب",
      about: "من نحن",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      shipping: "معلومات الشحن"
    },
    admin: {
      dashboard: "لوحة الإدارة",
      orders: "الطلبات",
      products: "المنتجات",
      settings: "الإعدادات",
      overview: "نظرة عامة",
      totalOrders: "إجمالي الطلبات",
      totalRevenue: "إجمالي الإيرادات",
      avgOrder: "متوسط الطلب",
      pendingOrders: "الطلبات المعلقة"
    },
    common: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      new: "جديد",
      search: "بحث",
      filter: "مرشح",
      sort: "ترتيب",
      price: "السعر",
      quantity: "الكمية",
      total: "المجموع",
      status: "الحالة",
      date: "التاريخ",
      actions: "الإجراءات"
    }
  }
};

export type Language = 'en' | 'fr' | 'ar';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  direction: 'ltr' | 'rtl';
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
