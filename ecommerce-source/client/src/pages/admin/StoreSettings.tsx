import { useState } from "react";
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
  Save
} from "lucide-react";

export default function StoreSettings() {
  const { t, language } = useI18n();
  const { toast } = useToast();

  const [storeSettings, setStoreSettings] = useState({
    // Informations générales
    storeName: "ModernShop",
    storeNameAr: "متجر حديث",
    storeNameFr: "Boutique Moderne",
    description: "Ultra-modern e-commerce experience",
    descriptionAr: "تجربة تجارة إلكترونية حديثة ومتقدمة",
    descriptionFr: "Expérience e-commerce ultra-moderne",
    logo: "",
    
    // Contact
    email: "contact@modernshop.com",
    phone: "+33123456789",
    whatsapp: "+33123456789",
    address: "123 Commerce Street, Paris, France",
    addressAr: "123 شارع التجارة، باريس، فرنسا",
    addressFr: "123 Rue du Commerce, Paris, France",
    
    // Paramètres financiers
    currency: "EUR",
    currencySymbol: "€",
    taxRate: 20,
    shippingCost: 5.99,
    freeShippingThreshold: 50,
    
    // Apparence
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    accentColor: "#06B6D4",
    
    // SEO
    metaTitle: "ModernShop - E-commerce Platform",
    metaDescription: "Discover premium products with fast delivery",
    keywords: "e-commerce, shopping, premium products"
  });

  const handleSettingChange = (field: string, value: string | number) => {
    setStoreSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // Sauvegarder chaque paramètre individuellement
      const settingsToSave = [
        { key: 'store_name', value: storeSettings.storeName },
        { key: 'store_name_ar', value: storeSettings.storeNameAr },
        { key: 'store_name_fr', value: storeSettings.storeNameFr },
        { key: 'store_description', value: storeSettings.description },
        { key: 'store_description_ar', value: storeSettings.descriptionAr },
        { key: 'store_description_fr', value: storeSettings.descriptionFr },
        { key: 'store_logo', value: storeSettings.logo },
        { key: 'contact_email', value: storeSettings.email },
        { key: 'contact_phone', value: storeSettings.phone },
        { key: 'contact_whatsapp', value: storeSettings.whatsapp },
        { key: 'contact_address', value: storeSettings.address },
        { key: 'contact_address_ar', value: storeSettings.addressAr },
        { key: 'contact_address_fr', value: storeSettings.addressFr },
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

      // Utiliser fetch pour sauvegarder chaque paramètre
      for (const setting of settingsToSave) {
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
      }

      toast({
        title: "✅ Paramètres sauvegardés",
        description: "Les paramètres du store ont été mis à jour avec succès",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (field: string, file: File) => {
    // Logique d'upload d'image
    const reader = new FileReader();
    reader.onload = (e) => {
      handleSettingChange(field, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Général
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
                {/* Logo du store */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4" />
                    Logo du store
                  </Label>
                  <div className="flex items-center gap-4">
                    {storeSettings.logo && (
                      <img 
                        src={storeSettings.logo} 
                        alt="Store Logo" 
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('logo', file);
                        }}
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-500">Format recommandé: PNG, JPG (200x200px)</p>
                    </div>
                  </div>
                </div>

                <Separator />

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

          {/* Onglet Contact */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <div>
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    Numéro WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={storeSettings.whatsapp}
                    onChange={(e) => handleSettingChange('whatsapp', e.target.value)}
                    placeholder="+33123456789"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format international avec indicatif pays (ex: +33123456789)
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