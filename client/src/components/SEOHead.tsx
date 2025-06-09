import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  noIndex = false
}: SEOProps) {
  // Charger les paramètres SEO globaux
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
    select: (data: any[]) => {
      const settingsMap: any = {};
      data.forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });
      return settingsMap;
    }
  });

  useEffect(() => {
    if (!settings) return;

    // Titre de la page
    const pageTitle = title || settings.meta_title || settings.store_name || "ModernShop";
    document.title = pageTitle;

    // Meta description
    const metaDescription = description || settings.meta_description || settings.store_description || "";
    updateMetaTag("description", metaDescription);

    // Meta keywords
    const metaKeywords = keywords || settings.meta_keywords || "";
    if (metaKeywords) {
      updateMetaTag("keywords", metaKeywords);
    }

    // Robots
    const robotsContent = noIndex ? "noindex, nofollow" : settings.robots_txt || "index, follow";
    updateMetaTag("robots", robotsContent);

    // Canonical URL
    const canonical = canonicalUrl || settings.canonical_url;
    if (canonical) {
      updateLinkTag("canonical", canonical);
    }

    // Open Graph Tags
    const ogTitleContent = ogTitle || settings.og_title || pageTitle;
    const ogDescriptionContent = ogDescription || settings.og_description || metaDescription;
    const ogImageContent = ogImage || settings.og_image;
    const ogUrlContent = ogUrl || settings.canonical_url || window.location.href;

    updateMetaProperty("og:title", ogTitleContent);
    updateMetaProperty("og:description", ogDescriptionContent);
    updateMetaProperty("og:type", "website");
    updateMetaProperty("og:url", ogUrlContent);
    updateMetaProperty("og:site_name", settings.store_name || "ModernShop");
    
    if (ogImageContent) {
      updateMetaProperty("og:image", ogImageContent);
      updateMetaProperty("og:image:width", "1200");
      updateMetaProperty("og:image:height", "630");
    }

    // Twitter Cards
    const twitterTitleContent = twitterTitle || settings.twitter_title || ogTitleContent;
    const twitterDescriptionContent = twitterDescription || settings.twitter_description || ogDescriptionContent;
    const twitterImageContent = twitterImage || settings.twitter_image || ogImageContent;

    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", twitterTitleContent);
    updateMetaName("twitter:description", twitterDescriptionContent);
    
    if (twitterImageContent) {
      updateMetaName("twitter:image", twitterImageContent);
    }

    // Langues et géolocalisation
    if (settings.default_language) {
      document.documentElement.lang = settings.default_language;
    }

    // Hreflang
    if (settings.hreflang_en) {
      updateLinkTag("alternate", settings.hreflang_en, { hreflang: "en" });
    }
    if (settings.hreflang_fr) {
      updateLinkTag("alternate", settings.hreflang_fr, { hreflang: "fr" });
    }
    if (settings.hreflang_ar) {
      updateLinkTag("alternate", settings.hreflang_ar, { hreflang: "ar" });
    }

    // Vérification des moteurs de recherche
    if (settings.google_site_verification) {
      updateMetaName("google-site-verification", settings.google_site_verification);
    }
    if (settings.bing_site_verification) {
      updateMetaName("msvalidate.01", settings.bing_site_verification);
    }

    // Données structurées
    if (settings.structured_data) {
      try {
        const structuredData = JSON.parse(settings.structured_data);
        updateStructuredData(structuredData);
      } catch (error) {
        console.warn("Invalid structured data JSON:", error);
      }
    }

    // Pixels de suivi et analytics
    loadTrackingScripts(settings);

  }, [settings, title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterTitle, twitterDescription, twitterImage, canonicalUrl, noIndex]);

  return null; // Ce composant ne rend rien visuellement
}

// Fonctions utilitaires pour manipuler les meta tags
function updateMetaTag(name: string, content: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaName(name: string, content: string) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateLinkTag(rel: string, href: string, attributes?: Record<string, string>) {
  if (!href) return;
  
  let link = document.querySelector(`link[rel="${rel}"]${attributes?.hreflang ? `[hreflang="${attributes.hreflang}"]` : ''}`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
    }
    document.head.appendChild(link);
  }
  link.href = href;
}

function updateStructuredData(data: any) {
  // Supprimer l'ancien script de données structurées s'il existe
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Ajouter le nouveau script de données structurées
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function loadTrackingScripts(settings: any) {
  // Google Analytics 4
  if (settings.google_analytics_id && !window.gtag) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings.google_analytics_id}');
    `;
    document.head.appendChild(script2);
  }

  // Google Tag Manager
  if (settings.google_tag_manager_id && !window.google_tag_manager_loaded) {
    const script = document.createElement('script');
    script.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
    `;
    document.head.appendChild(script);
    (window as any).google_tag_manager_loaded = true;
  }

  // Facebook Pixel
  if (settings.facebook_pixel_id && !window.fbq) {
    const script = document.createElement('script');
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${settings.facebook_pixel_id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Noscript fallback pour Facebook Pixel
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.facebook_pixel_id}&ev=PageView&noscript=1">`;
    document.head.appendChild(noscript);
  }

  // Google Ads Conversion Tracking
  if (settings.google_ads_id && !window.google_ads_loaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_ads_id}`;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings.google_ads_id}');
    `;
    document.head.appendChild(script2);
    (window as any).google_ads_loaded = true;
  }
}

// Fonctions utilitaires pour le tracking d'événements
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', eventName, parameters);
  }
}

export function trackPurchase(value: number, currency: string = 'EUR', items?: any[]) {
  const purchaseData = {
    value,
    currency,
    items
  };

  // Google Analytics Enhanced Ecommerce
  if (window.gtag) {
    window.gtag('event', 'purchase', purchaseData);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'Purchase', purchaseData);
  }
}

export function trackAddToCart(value: number, currency: string = 'EUR', content_name?: string) {
  const cartData = {
    value,
    currency,
    content_name
  };

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', cartData);
  }

  if (window.fbq) {
    window.fbq('track', 'AddToCart', cartData);
  }
}

// Déclarations pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    google_tag_manager_loaded?: boolean;
    google_ads_loaded?: boolean;
  }
}