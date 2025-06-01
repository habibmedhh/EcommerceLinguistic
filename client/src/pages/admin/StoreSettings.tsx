import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Header } from "@/components/Header";
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
    keywords: ""
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
          keywords: settingsMap.meta_keywords || ""
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
          <TabsList className="grid w-full grid-cols-6">
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
                          placeholder="+33123456789"
                          className="bg-white"
                        />
                        <p className="text-sm text-green-700 mt-2">
                          Format international avec indicatif pays (ex: +33123456789)
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Optimisation SEO
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
                    Recommandé: 50-60 caractères
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Description (Meta Description)</Label>
                  <Textarea
                    id="metaDescription"
                    value={storeSettings.metaDescription}
                    onChange={(e) => handleSettingChange('metaDescription', e.target.value)}
                    placeholder="Discover premium products with fast delivery"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommandé: 150-160 caractères
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords">Mots-clés</Label>
                  <Input
                    id="keywords"
                    value={storeSettings.keywords}
                    onChange={(e) => handleSettingChange('keywords', e.target.value)}
                    placeholder="e-commerce, shopping, premium products"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Séparer par des virgules
                  </p>
                </div>
              </CardContent>
            </Card>
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