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
    order: string;
    buyNow: string;
  };
  // Order form
  order: {
    title: string;
    name: string;
    phone: string;
    address: string;
    submit: string;
    success: string;
    ready: string;
    fillForm: string;
    processing: string;
    confirmed: string;
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
    description: string;
    specifications: string;
    reviews: string;
    features: string;
    brand: string;
    weight: string;
    dimensions: string;
    sku: string;
    wishlist: string;
    share: string;
    freeShipping: string;
    securePayment: string;
    returns: string;
    support: string;
  };
  // Notifications
  notifications: {
    title: string;
    newOrder: string;
    newOrderMessage: string;
    confirmOrderStatus: string;
    orderFrom: string;
    markAllRead: string;
    noNotifications: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
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
      applyFilters: "Apply Filters",
      order: "Order",
      buyNow: "Buy Now"
    },
    order: {
      title: "Order Now",
      name: "Full Name",
      phone: "Phone Number",
      address: "Delivery Address",
      submit: "Place Order",
      success: "Order placed successfully!",
      ready: "Great! Your order is ready 🤩",
      fillForm: "Please fill in your information to complete the order",
      processing: "Processing your order... 🛒",
      confirmed: "Order confirmed! Thank you 🎉"
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
      pendingOrders: "Pending Orders",
      description: "Description",
      specifications: "Specifications", 
      reviews: "Reviews",
      features: "Features",
      brand: "Brand",
      weight: "Weight",
      dimensions: "Dimensions",
      sku: "SKU",
      wishlist: "Add to Wishlist",
      share: "Share",
      freeShipping: "Free Shipping",
      securePayment: "Secure Payment",
      returns: "30-Day Returns",
      support: "24/7 Support"
    },
    notifications: {
      title: "Notifications",
      newOrder: "New Order Created",
      newOrderMessage: "A new order has been created with amount",
      confirmOrderStatus: "Please confirm the order status",
      orderFrom: "Order from",
      markAllRead: "Mark all as read",
      noNotifications: "No notifications",
      justNow: "Just now",
      minutesAgo: "min ago",
      hoursAgo: "h ago"
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
      applyFilters: "Appliquer les filtres",
      order: "Commander",
      buyNow: "Acheter maintenant"
    },
    order: {
      title: "Commander maintenant",
      name: "Nom complet",
      phone: "Numéro de téléphone",
      address: "Adresse de livraison",
      submit: "Passer la commande",
      success: "Commande passée avec succès!",
      ready: "Très bien ! Votre commande est prête 🤩",
      fillForm: "Remplissez vos informations pour finaliser la commande",
      processing: "Traitement de votre commande... 🛒",
      confirmed: "Commande confirmée ! Merci beaucoup 🎉"
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
      pendingOrders: "En attente",
      description: "Description",
      specifications: "Spécifications",
      reviews: "Avis",
      features: "Caractéristiques",
      brand: "Marque",
      weight: "Poids",
      dimensions: "Dimensions",
      sku: "SKU",
      wishlist: "Ajouter aux favoris",
      share: "Partager",
      freeShipping: "Livraison gratuite",
      securePayment: "Paiement sécurisé",
      returns: "Retours 30 jours",
      support: "Support 24/7"
    },
    notifications: {
      title: "Notifications",
      newOrder: "Nouvelle commande créée",
      newOrderMessage: "Une nouvelle commande a été créée d'un montant de",
      confirmOrderStatus: "Merci de confirmer le statut de la commande",
      orderFrom: "Commande de",
      markAllRead: "Tout marquer comme lu",
      noNotifications: "Aucune notification",
      justNow: "À l'instant",
      minutesAgo: "min",
      hoursAgo: "h"
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
      applyFilters: "تطبيق المرشحات",
      order: "اطلب",
      buyNow: "اشتري الآن"
    },
    order: {
      title: "اطلب الآن",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      address: "عنوان التوصيل",
      submit: "إرسال الطلب",
      success: "تم إرسال الطلب بنجاح!",
      ready: "ممتاز! طلبك جاهز 🤩",
      fillForm: "يرجى ملء بياناتك لإتمام الطلب",
      processing: "جاري معالجة طلبك... 🛒",
      confirmed: "تم تأكيد الطلب! شكراً لك 🎉"
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
      pendingOrders: "الطلبات المعلقة",
      description: "الوصف",
      specifications: "المواصفات",
      reviews: "التقييمات",
      features: "الميزات",
      brand: "العلامة التجارية",
      weight: "الوزن",
      dimensions: "الأبعاد",
      sku: "رمز المنتج",
      wishlist: "إضافة للمفضلة",
      share: "مشاركة",
      freeShipping: "شحن مجاني",
      securePayment: "دفع آمن",
      returns: "إرجاع 30 يوم",
      support: "دعم 24/7"
    },
    notifications: {
      newOrder: "تم إنشاء طلب جديد",
      newOrderMessage: "تم إنشاء طلب جديد بمبلغ",
      confirmOrderStatus: "يرجى تأكيد حالة الطلب"
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
