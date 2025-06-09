import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Header } from "@/components/Header";
import { SEOChecker } from "@/components/SEOChecker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  Settings, 
  Upload, 
  Phone, 
  Mail, 
  MapPin,
  DollarSign,
  Palette,
  Globe,
  Image,
  Save,
  Camera,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Monitor,
  Smartphone
} from "lucide-react";

export default function StoreSettings() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [storeSettings, setStoreSettings] = useState({
    // Informations générales
    storeName: "",
    storeNameAr: "",
    storeNameFr: "",
    description: "",
    descriptionAr: "",
    descriptionFr: "",
    logo: "",
    favicon: "",
    bannerImage: "",
    
    // Contact
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    addressAr: "",
    addressFr: "",
    
    // Réseaux sociaux
    facebook: "",
    instagram: "",
    twitter: "",
    
    // Paramètres financiers
    currency: "EUR",
    currencySymbol: "€",
    taxRate: 0,
    shippingCost: 0,
    freeShippingThreshold: 0,
    
    // Apparence
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#06B6D4",
    
    // SEO
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    
    // SEO Avancé & Publicités
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    canonicalUrl: "",
    robotsTxt: "index, follow",
    structuredData: "",
    
    // Pixels de suivi
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
    googleAdsId: "",
    
    // Verification
    googleSiteVerification: "",
    bingSiteVerification: "",
    
    // Langues et géolocalisation
    hreflangEn: "",
    hreflangFr: "",
    hreflangAr: "",
    defaultLanguage: "en",
    targetCountries: ""
  });

  // Charger les paramètres existants depuis la base de données
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const settings = await response.json();
        
        // Mapper les paramètres de la base vers l'état local
        const settingsMap: any = {};
        settings.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });

        setStoreSettings(prev => ({
          ...prev,
          storeName: settingsMap.store_name || "",
          storeNameAr: settingsMap.store_name_ar || "",
          storeNameFr: settingsMap.store_name_fr || "",
          description: settingsMap.store_description || "",
          descriptionAr: settingsMap.store_description_ar || "",
          descriptionFr: settingsMap.store_description_fr || "",
          logo: settingsMap.store_logo || "",
          favicon: settingsMap.store_favicon || "",
          bannerImage: settingsMap.store_banner || "",
          email: settingsMap.contact_email || "",
          phone: settingsMap.contact_phone || "",
          whatsapp: settingsMap.contact_whatsapp || "",
          address: settingsMap.contact_address || "",
          addressAr: settingsMap.contact_address_ar || "",
          addressFr: settingsMap.contact_address_fr || "",
          facebook: settingsMap.social_facebook || "",
          instagram: settingsMap.social_instagram || "",
          twitter: settingsMap.social_twitter || "",
          currency: settingsMap.currency || "EUR",
          currencySymbol: settingsMap.currency_symbol || "€",
          taxRate: Number(settingsMap.tax_rate) || 0,
          shippingCost: Number(settingsMap.shipping_cost) || 0,
          freeShippingThreshold: Number(settingsMap.free_shipping_threshold) || 0,
          primaryColor: settingsMap.primary_color || "#8B5CF6",
          secondaryColor: settingsMap.secondary_color || "#EC4899",
          accentColor: settingsMap.accent_color || "#06B6D4",
          metaTitle: settingsMap.meta_title || "",
          metaDescription: settingsMap.meta_description || "",
          keywords: settingsMap.meta_keywords || "",
          
          // SEO Avancé & Publicités
          ogTitle: settingsMap.og_title || "",
          ogDescription: settingsMap.og_description || "",
          ogImage: settingsMap.og_image || "",
          twitterTitle: settingsMap.twitter_title || "",
          twitterDescription: settingsMap.twitter_description || "",
          twitterImage: settingsMap.twitter_image || "",
          canonicalUrl: settingsMap.canonical_url || "",
          robotsTxt: settingsMap.robots_txt || "index, follow",
          structuredData: settingsMap.structured_data || "",
          
          // Pixels de suivi
          googleAnalyticsId: settingsMap.google_analytics_id || "",
          googleTagManagerId: settingsMap.google_tag_manager_id || "",
          facebookPixelId: settingsMap.facebook_pixel_id || "",
          googleAdsId: settingsMap.google_ads_id || "",
          
          // Verification
          googleSiteVerification: settingsMap.google_site_verification || "",
          bingSiteVerification: settingsMap.bing_site_verification || "",
          
          // Langues et géolocalisation
          hreflangEn: settingsMap.hreflang_en || "",
          hreflangFr: settingsMap.hreflang_fr || "",
          hreflangAr: settingsMap.hreflang_ar || "",
          defaultLanguage: settingsMap.default_language || "en",
          targetCountries: settingsMap.target_countries || ""
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres du store",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSettingChange = (field: string, value: string | number) => {
    setStoreSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      const settingsToSave = [
        { key: 'store_name', value: storeSettings.storeName },
        { key: 'store_name_ar', value: storeSettings.storeNameAr },
        { key: 'store_name_fr', value: storeSettings.storeNameFr },
        { key: 'store_description', value: storeSettings.description },
        { key: 'store_description_ar', value: storeSettings.descriptionAr },
        { key: 'store_description_fr', value: storeSettings.descriptionFr },
        { key: 'store_logo', value: storeSettings.logo },
        { key: 'store_favicon', value: storeSettings.favicon },
        { key: 'store_banner', value: storeSettings.bannerImage },
        { key: 'contact_email', value: storeSettings.email },
        { key: 'contact_phone', value: storeSettings.phone },
        { key: 'contact_whatsapp', value: storeSettings.whatsapp },
        { key: 'contact_address', value: storeSettings.address },
        { key: 'contact_address_ar', value: storeSettings.addressAr },
        { key: 'contact_address_fr', value: storeSettings.addressFr },
        { key: 'social_facebook', value: storeSettings.facebook },
        { key: 'social_instagram', value: storeSettings.instagram },
        { key: 'social_twitter', value: storeSettings.twitter },
        { key: 'currency', value: storeSettings.currency },
        { key: 'currency_symbol', value: storeSettings.currencySymbol },
        { key: 'tax_rate', value: storeSettings.taxRate },
        { key: 'shipping_cost', value: storeSettings.shippingCost },
        { key: 'free_shipping_threshold', value: storeSettings.freeShippingThreshold },
        { key: 'primary_color', value: storeSettings.primaryColor },
        { key: 'secondary_color', value: storeSettings.secondaryColor },
        { key: 'accent_color', value: storeSettings.accentColor },
        { key: 'meta_title', value: storeSettings.metaTitle },
        { key: 'meta_description', value: storeSettings.metaDescription },
        { key: 'meta_keywords', value: storeSettings.keywords },
        
        // SEO Avancé & Publicités
        { key: 'og_title', value: storeSettings.ogTitle },
        { key: 'og_description', value: storeSettings.ogDescription },
        { key: 'og_image', value: storeSettings.ogImage },
        { key: 'twitter_title', value: storeSettings.twitterTitle },
        { key: 'twitter_description', value: storeSettings.twitterDescription },
        { key: 'twitter_image', value: storeSettings.twitterImage },
        { key: 'canonical_url', value: storeSettings.canonicalUrl },
        { key: 'robots_txt', value: storeSettings.robotsTxt },
        { key: 'structured_data', value: storeSettings.structuredData },
        
        // Pixels de suivi
        { key: 'google_analytics_id', value: storeSettings.googleAnalyticsId },
        { key: 'google_tag_manager_id', value: storeSettings.googleTagManagerId },
        { key: 'facebook_pixel_id', value: storeSettings.facebookPixelId },
        { key: 'google_ads_id', value: storeSettings.googleAdsId },
        
        // Verification
        { key: 'google_site_verification', value: storeSettings.googleSiteVerification },
        { key: 'bing_site_verification', value: storeSettings.bingSiteVerification },
        
        // Langues et géolocalisation
        { key: 'hreflang_en', value: storeSettings.hreflangEn },
        { key: 'hreflang_fr', value: storeSettings.hreflangFr },
        { key: 'hreflang_ar', value: storeSettings.hreflangAr },
        { key: 'default_language', value: storeSettings.defaultLanguage },
        { key: 'target_countries', value: storeSettings.targetCountries },
      ];

      // Sauvegarder avec un délai entre les requêtes pour éviter la surcharge
      for (let i = 0; i < settingsToSave.length; i++) {
        const setting = settingsToSave[i];
        await fetch(`/api/settings/${setting.key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: setting.value,
            description: `Store setting: ${setting.key}`
          }),
        });
        
        // Petit délai pour éviter la surcharge du serveur
        if (i < settingsToSave.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres du store ont été mis à jour avec succès",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (field: string, file: File) => {
    if (!file) return;
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB",
        variant: "destructive",
      });
      return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        // Mettre à jour l'état local immédiatement
        handleSettingChange(field, result);
        
        // Sauvegarder automatiquement l'image
        const settingKey = field === 'logo' ? 'store_logo' : 
                          field === 'favicon' ? 'store_favicon' : 
                          field === 'bannerImage' ? 'store_banner' : field;
        
        await fetch(`/api/settings/${settingKey}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: result,
            description: `Store ${field}`
          }),
        });

        toast({
          title: "Image mise à jour",
          description: `${field === 'logo' ? 'Logo' : field === 'favicon' ? 'Favicon' : 'Banner'} sauvegardé avec succès`,
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur upload image:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible de sauvegarder l'image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des paramètres du store...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres du Store</h1>
              <p className="text-gray-600">Personnalisez votre boutique en ligne</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Médias
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financier
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="seo-check" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Vérifier
            </TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informations générales du store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nom du store multilingue */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="storeName">Nom du store (Anglais)</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) => handleSettingChange('storeName', e.target.value)}
                      placeholder="ModernShop"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeNameFr">Nom du store (Français)</Label>
                    <Input
                      id="storeNameFr"
                      value={storeSettings.storeNameFr}
                      onChange={(e) => handleSettingChange('storeNameFr', e.target.value)}
                      placeholder="Boutique Moderne"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeNameAr">Nom du store (العربية)</Label>
                    <Input
                      id="storeNameAr"
                      value={storeSettings.storeNameAr}
                      onChange={(e) => handleSettingChange('storeNameAr', e.target.value)}
                      placeholder="متجر حديث"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Description multilingue */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="description">Description (Anglais)</Label>
                    <Textarea
                      id="description"
                      value={storeSettings.description}
                      onChange={(e) => handleSettingChange('description', e.target.value)}
                      placeholder="Ultra-modern e-commerce experience"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionFr">Description (Français)</Label>
                    <Textarea
                      id="descriptionFr"
                      value={storeSettings.descriptionFr}
                      onChange={(e) => handleSettingChange('descriptionFr', e.target.value)}
                      placeholder="Expérience e-commerce ultra-moderne"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionAr">Description (العربية)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={storeSettings.descriptionAr}
                      onChange={(e) => handleSettingChange('descriptionAr', e.target.value)}
                      placeholder="تجربة تجارة إلكترونية حديثة ومتقدمة"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Médias */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Éléments visuels du store
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Logo du store */}
                <div>
                  <Label className="flex items-center gap-2 mb-4 text-lg font-semibold">
                    <Image className="h-5 w-5" />
                    Logo du store
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-6">
                      {storeSettings.logo ? (
                        <div className="relative">
                          <img 
                            src={storeSettings.logo} 
                            alt="Store Logo" 
                            className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => handleSettingChange('logo', '')}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('logo', file);
                          }}
                          className="mb-3"
                        />
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Desktop: 200x200px
                          </div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Mobile: 120x120px
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Formats recommandés: PNG avec fond transparent, JPG, SVG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div>
                  <Label className="flex items-center gap-2 mb-4 text-lg font-semibold">
                    <Globe className="h-5 w-5" />
                    Favicon (icône du navigateur)
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-6">
                      {storeSettings.favicon ? (
                        <div className="relative">
                          <img 
                            src={storeSettings.favicon} 
                            alt="Favicon" 
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => handleSettingChange('favicon', '')}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('favicon', file);
                          }}
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Format recommandé: ICO, PNG 32x32px ou 16x16px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner principal */}
                <div>
                  <Label className="flex items-center gap-2 mb-4 text-lg font-semibold">
                    <Camera className="h-5 w-5" />
                    Banner principal de la page d'accueil
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-4">
                      {storeSettings.bannerImage ? (
                        <div className="relative">
                          <img 
                            src={storeSettings.bannerImage} 
                            alt="Store Banner" 
                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="absolute top-2 right-2"
                            onClick={() => handleSettingChange('bannerImage', '')}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">Aucune image de banner</p>
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('bannerImage', file);
                          }}
                          className="mb-3"
                        />
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            Desktop: 1920x600px
                          </div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Mobile: 800x400px
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Format recommandé: JPG ou PNG, optimisé pour le web
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Contact */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Informations de contact principales */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations de contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email de contact
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => handleSettingChange('email', e.target.value)}
                        placeholder="contact@modernshop.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={storeSettings.phone}
                        onChange={(e) => handleSettingChange('phone', e.target.value)}
                        placeholder="+33123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Business */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    WhatsApp Business
                  </h3>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="whatsapp" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          Numéro WhatsApp Business
                        </Label>
                        <Input
                          id="whatsapp"
                          value={storeSettings.whatsapp}
                          onChange={(e) => handleSettingChange('whatsapp', e.target.value)}
                          placeholder="0612345678"
                          className="bg-white"
                        />
                        <p className="text-sm text-green-700 mt-2">
                          Format marocain recommandé (ex: 0612345678)
                        </p>
                      </div>
                      {storeSettings.whatsapp && (
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm text-green-800 mb-2">Aperçu du lien WhatsApp :</p>
                          <a 
                            href={`https://wa.me/${storeSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 underline"
                          >
                            https://wa.me/{storeSettings.whatsapp.replace(/[^0-9]/g, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={storeSettings.facebook}
                        onChange={(e) => handleSettingChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/votre-page"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={storeSettings.instagram}
                        onChange={(e) => handleSettingChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/votre-compte"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        Twitter/X
                      </Label>
                      <Input
                        id="twitter"
                        value={storeSettings.twitter}
                        onChange={(e) => handleSettingChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/votre-compte"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Ajoutez l'URL complète de vos profils de réseaux sociaux
                  </p>
                </div>

                <Separator />

                {/* Adresse multilingue */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse (Anglais)
                    </Label>
                    <Textarea
                      id="address"
                      value={storeSettings.address}
                      onChange={(e) => handleSettingChange('address', e.target.value)}
                      placeholder="123 Commerce Street, Paris, France"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressFr">Adresse (Français)</Label>
                    <Textarea
                      id="addressFr"
                      value={storeSettings.addressFr}
                      onChange={(e) => handleSettingChange('addressFr', e.target.value)}
                      placeholder="123 Rue du Commerce, Paris, France"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressAr">Adresse (العربية)</Label>
                    <Textarea
                      id="addressAr"
                      value={storeSettings.addressAr}
                      onChange={(e) => handleSettingChange('addressAr', e.target.value)}
                      placeholder="123 شارع التجارة، باريس، فرنسا"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Financier */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Paramètres financiers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currency">Devise principale</Label>
                    <Input
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      placeholder="EUR"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currencySymbol">Symbole de devise</Label>
                    <Input
                      id="currencySymbol"
                      value={storeSettings.currencySymbol}
                      onChange={(e) => handleSettingChange('currencySymbol', e.target.value)}
                      placeholder="€"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={storeSettings.taxRate}
                      onChange={(e) => handleSettingChange('taxRate', Number(e.target.value))}
                      placeholder="20"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingCost">Frais de livraison (€)</Label>
                    <Input
                      id="shippingCost"
                      type="number"
                      step="0.01"
                      value={storeSettings.shippingCost}
                      onChange={(e) => handleSettingChange('shippingCost', Number(e.target.value))}
                      placeholder="5.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="freeShippingThreshold">Seuil livraison gratuite (€)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      step="0.01"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) => handleSettingChange('freeShippingThreshold', Number(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personnalisation de l'apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Couleur principale</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={storeSettings.primaryColor}
                        onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={storeSettings.primaryColor}
                        onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                        placeholder="#8B5CF6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={storeSettings.secondaryColor}
                        onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={storeSettings.secondaryColor}
                        onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                        placeholder="#EC4899"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Couleur d'accent</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={storeSettings.accentColor}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={storeSettings.accentColor}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        placeholder="#06B6D4"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">Aperçu des couleurs</h4>
                  <div className="flex gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg" 
                      style={{ backgroundColor: storeSettings.primaryColor }}
                    ></div>
                    <div 
                      className="w-12 h-12 rounded-lg" 
                      style={{ backgroundColor: storeSettings.secondaryColor }}
                    ></div>
                    <div 
                      className="w-12 h-12 rounded-lg" 
                      style={{ backgroundColor: storeSettings.accentColor }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet SEO */}
          <TabsContent value="seo">
            <div className="space-y-6">
              {/* SEO de base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO de base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="metaTitle">Titre de la page (Meta Title)</Label>
                    <Input
                      id="metaTitle"
                      value={storeSettings.metaTitle}
                      onChange={(e) => handleSettingChange('metaTitle', e.target.value)}
                      placeholder="ModernShop - E-commerce Platform"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 50-60 caractères ({storeSettings.metaTitle.length}/60)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Description (Meta Description)</Label>
                    <Textarea
                      id="metaDescription"
                      value={storeSettings.metaDescription}
                      onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
                      placeholder="Découvrez des produits premium avec livraison rapide et service client exceptionnel"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 150-160 caractères ({storeSettings.metaDescription.length}/160)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Mots-clés</Label>
                    <Input
                      id="keywords"
                      value={storeSettings.keywords}
                      onChange={(e) => handleSettingChange('keywords', e.target.value)}
                      placeholder="e-commerce, boutique en ligne, produits premium, livraison rapide"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Séparer par des virgules
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="canonicalUrl">URL Canonique</Label>
                      <Input
                        id="canonicalUrl"
                        value={storeSettings.canonicalUrl}
                        onChange={(e) => handleSettingChange('canonicalUrl', e.target.value)}
                        placeholder="https://www.votre-site.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="robotsTxt">Robots.txt</Label>
                      <Input
                        id="robotsTxt"
                        value={storeSettings.robotsTxt}
                        onChange={(e) => handleSettingChange('robotsTxt', e.target.value)}
                        placeholder="index, follow"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Open Graph (Facebook) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Open Graph (Facebook/Meta)
                  </CardTitle>
                  <p className="text-sm text-gray-600">Optimisez l'apparence de votre site sur Facebook et Meta Ads</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="ogTitle">Titre Open Graph</Label>
                    <Input
                      id="ogTitle"
                      value={storeSettings.ogTitle}
                      onChange={(e) => handleSettingChange('ogTitle', e.target.value)}
                      placeholder="ModernShop - Boutique Premium en Ligne"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 60-90 caractères ({storeSettings.ogTitle.length}/90)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ogDescription">Description Open Graph</Label>
                    <Textarea
                      id="ogDescription"
                      value={storeSettings.ogDescription}
                      onChange={(e) => handleSettingChange('ogDescription', e.target.value)}
                      placeholder="Découvrez notre collection exclusive de produits premium avec livraison gratuite dès 50€"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 200-300 caractères ({storeSettings.ogDescription.length}/300)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ogImage">Image Open Graph (URL)</Label>
                    <Input
                      id="ogImage"
                      value={storeSettings.ogImage}
                      onChange={(e) => handleSettingChange('ogImage', e.target.value)}
                      placeholder="https://votre-site.com/og-image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 1200x630px pour un affichage optimal
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    Twitter Cards
                  </CardTitle>
                  <p className="text-sm text-gray-600">Optimisez l'apparence de votre site sur Twitter/X</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="twitterTitle">Titre Twitter</Label>
                    <Input
                      id="twitterTitle"
                      value={storeSettings.twitterTitle}
                      onChange={(e) => handleSettingChange('twitterTitle', e.target.value)}
                      placeholder="ModernShop - Produits Premium"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 70 caractères maximum ({storeSettings.twitterTitle.length}/70)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="twitterDescription">Description Twitter</Label>
                    <Textarea
                      id="twitterDescription"
                      value={storeSettings.twitterDescription}
                      onChange={(e) => handleSettingChange('twitterDescription', e.target.value)}
                      placeholder="Boutique en ligne premium avec livraison rapide et service client 24/7"
                      rows={2}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 200 caractères maximum ({storeSettings.twitterDescription.length}/200)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="twitterImage">Image Twitter (URL)</Label>
                    <Input
                      id="twitterImage"
                      value={storeSettings.twitterImage}
                      onChange={(e) => handleSettingChange('twitterImage', e.target.value)}
                      placeholder="https://votre-site.com/twitter-image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommandé: 1200x600px pour Twitter Cards
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pixels de suivi et Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Pixels de suivi et Analytics
                  </CardTitle>
                  <p className="text-sm text-gray-600">Configurez le suivi pour Google Ads et Meta Ads</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                      <Input
                        id="googleAnalyticsId"
                        value={storeSettings.googleAnalyticsId}
                        onChange={(e) => handleSettingChange('googleAnalyticsId', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                      <Input
                        id="googleTagManagerId"
                        value={storeSettings.googleTagManagerId}
                        onChange={(e) => handleSettingChange('googleTagManagerId', e.target.value)}
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                      <Input
                        id="facebookPixelId"
                        value={storeSettings.facebookPixelId}
                        onChange={(e) => handleSettingChange('facebookPixelId', e.target.value)}
                        placeholder="123456789012345"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Essentiel pour Meta Ads et le suivi des conversions
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="googleAdsId">Google Ads ID</Label>
                      <Input
                        id="googleAdsId"
                        value={storeSettings.googleAdsId}
                        onChange={(e) => handleSettingChange('googleAdsId', e.target.value)}
                        placeholder="AW-XXXXXXXXXX"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Pour le suivi des conversions Google Ads
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification des moteurs de recherche */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Vérification des moteurs de recherche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="googleSiteVerification">Google Search Console</Label>
                      <Input
                        id="googleSiteVerification"
                        value={storeSettings.googleSiteVerification}
                        onChange={(e) => handleSettingChange('googleSiteVerification', e.target.value)}
                        placeholder="Code de vérification Google"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bingSiteVerification">Bing Webmaster Tools</Label>
                      <Input
                        id="bingSiteVerification"
                        value={storeSettings.bingSiteVerification}
                        onChange={(e) => handleSettingChange('bingSiteVerification', e.target.value)}
                        placeholder="Code de vérification Bing"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Géolocalisation et langues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Géolocalisation et langues
                  </CardTitle>
                  <p className="text-sm text-gray-600">Configurez le ciblage géographique et linguistique</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="hreflangEn">Hreflang Anglais</Label>
                      <Input
                        id="hreflangEn"
                        value={storeSettings.hreflangEn}
                        onChange={(e) => handleSettingChange('hreflangEn', e.target.value)}
                        placeholder="https://site.com/en/"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hreflangFr">Hreflang Français</Label>
                      <Input
                        id="hreflangFr"
                        value={storeSettings.hreflangFr}
                        onChange={(e) => handleSettingChange('hreflangFr', e.target.value)}
                        placeholder="https://site.com/fr/"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hreflangAr">Hreflang Arabe</Label>
                      <Input
                        id="hreflangAr"
                        value={storeSettings.hreflangAr}
                        onChange={(e) => handleSettingChange('hreflangAr', e.target.value)}
                        placeholder="https://site.com/ar/"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                      <Input
                        id="defaultLanguage"
                        value={storeSettings.defaultLanguage}
                        onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                        placeholder="en"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetCountries">Pays cibles</Label>
                      <Input
                        id="targetCountries"
                        value={storeSettings.targetCountries}
                        onChange={(e) => handleSettingChange('targetCountries', e.target.value)}
                        placeholder="FR,MA,DZ,TN,BE,CH"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Codes pays ISO séparés par des virgules
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Données structurées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Données structurées (JSON-LD)
                  </CardTitle>
                  <p className="text-sm text-gray-600">Améliorez l'affichage dans les résultats de recherche</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="structuredData">Schema.org JSON-LD</Label>
                    <Textarea
                      id="structuredData"
                      value={storeSettings.structuredData}
                      onChange={(e) => handleSettingChange('structuredData', e.target.value)}
                      placeholder='{"@context":"https://schema.org","@type":"Store","name":"ModernShop","description":"Boutique en ligne premium"}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      JSON-LD pour rich snippets (Organisation, LocalBusiness, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Vérification SEO */}
          <TabsContent value="seo-check">
            <SEOChecker />
          </TabsContent>
        </Tabs>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les paramètres
          </Button>
        </div>
      </div>
    </div>
  );
}