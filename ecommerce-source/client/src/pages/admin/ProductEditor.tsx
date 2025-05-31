import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Upload, 
  X, 
  Plus, 
  Save,
  ArrowLeft,
  Star,
  Image as ImageIcon,
  Tag,
  DollarSign
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";

interface ProductFeature {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  value: string;
  valueAr: string;
  valueFr: string;
}

interface ProductReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const isEdit = !!id;
  const { data: product } = useProduct(isEdit ? parseInt(id) : 0);
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [productData, setProductData] = useState({
    name: "",
    nameAr: "",
    nameFr: "",
    description: "",
    descriptionAr: "",
    descriptionFr: "",
    price: "",
    salePrice: "",
    sku: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
    featured: false,
    onSale: false,
    isActive: true,
    weight: "",
    dimensions: "",
    brand: "",
    brandAr: "",
    brandFr: "",
    tags: [] as string[],
  });

  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (product && isEdit) {
      setProductData({
        name: product.name || "",
        nameAr: product.nameAr || "",
        nameFr: product.nameFr || "",
        description: product.description || "",
        descriptionAr: product.descriptionAr || "",
        descriptionFr: product.descriptionFr || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        sku: product.sku || "",
        stock: product.stock?.toString() || "",
        categoryId: product.categoryId?.toString() || "",
        images: Array.isArray(product.images) ? product.images : [],
        featured: product.featured || false,
        onSale: product.onSale || false,
        isActive: product.isActive !== false,
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        brand: product.brand || "",
        brandAr: product.brandAr || "",
        brandFr: product.brandFr || "",
        tags: Array.isArray(product.tags) ? product.tags : [],
      });

      // Charger les caractéristiques et avis depuis la base de données
      if (product.features && Array.isArray(product.features)) {
        setFeatures(product.features as ProductFeature[]);
      }
      if (product.reviews && Array.isArray(product.reviews)) {
        setReviews(product.reviews as ProductReview[]);
      }
    }
  }, [product, isEdit]);

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProductData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    const newFeature: ProductFeature = {
      id: Date.now().toString(),
      name: "",
      nameAr: "",
      nameFr: "",
      value: "",
      valueAr: "",
      valueFr: ""
    };
    setFeatures([...features, newFeature]);
  };

  const updateFeature = (id: string, field: string, value: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    ));
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = async () => {
    try {
      const saveData = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        salePrice: productData.salePrice ? parseFloat(productData.salePrice) : null,
        stock: parseInt(productData.stock) || 0,
        categoryId: parseInt(productData.categoryId) || null,
        images: JSON.stringify(productData.images),
        tags: JSON.stringify(productData.tags),
        features: JSON.stringify(features),
        reviews: JSON.stringify(reviews),
      };

      if (isEdit) {
        await updateProduct.mutateAsync({ id: parseInt(id), data: saveData });
        toast({
          title: "✅ Produit mis à jour",
          description: "Le produit a été modifié avec succès",
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
        });
      } else {
        await createProduct.mutateAsync(saveData);
        toast({
          title: "✅ Produit créé",
          description: "Le nouveau produit a été ajouté au catalogue",
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
        });
      }
      
      setLocation("/admin/products");
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? "Modifier le produit" : "Nouveau produit"}
              </h1>
              <p className="text-gray-600">Gérez les détails, images et caractéristiques</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nom multilingue */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Nom (Anglais) *</Label>
                    <Input
                      id="name"
                      value={productData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameFr">Nom (Français)</Label>
                    <Input
                      id="nameFr"
                      value={productData.nameFr}
                      onChange={(e) => handleInputChange('nameFr', e.target.value)}
                      placeholder="Nom du produit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameAr">Nom (العربية)</Label>
                    <Input
                      id="nameAr"
                      value={productData.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      placeholder="اسم المنتج"
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
                      value={productData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Product description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionFr">Description (Français)</Label>
                    <Textarea
                      id="descriptionFr"
                      value={productData.descriptionFr}
                      onChange={(e) => handleInputChange('descriptionFr', e.target.value)}
                      placeholder="Description du produit"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionAr">Description (العربية)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={productData.descriptionAr}
                      onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                      placeholder="وصف المنتج"
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prix et inventaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Prix et inventaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={productData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Prix en promotion (€)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      value={productData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      placeholder="24.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={productData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="PROD-001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Images du produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Ajouter des images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  />
                </div>

                {productData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques du produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.id} className="grid md:grid-cols-7 gap-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Nom (EN)"
                      value={feature.name}
                      onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Nom (FR)"
                      value={feature.nameFr}
                      onChange={(e) => updateFeature(feature.id, 'nameFr', e.target.value)}
                    />
                    <Input
                      placeholder="الاسم (AR)"
                      value={feature.nameAr}
                      onChange={(e) => updateFeature(feature.id, 'nameAr', e.target.value)}
                      dir="rtl"
                    />
                    <Input
                      placeholder="Valeur (EN)"
                      value={feature.value}
                      onChange={(e) => updateFeature(feature.id, 'value', e.target.value)}
                    />
                    <Input
                      placeholder="Valeur (FR)"
                      value={feature.valueFr}
                      onChange={(e) => updateFeature(feature.id, 'valueFr', e.target.value)}
                    />
                    <Input
                      placeholder="القيمة (AR)"
                      value={feature.valueAr}
                      onChange={(e) => updateFeature(feature.id, 'valueAr', e.target.value)}
                      dir="rtl"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(feature.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une caractéristique
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Catégorie et statut */}
            <Card>
              <CardHeader>
                <CardTitle>Catégorie et statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryId">Catégorie</Label>
                  <Select value={productData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={productData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                    Produit vedette
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={productData.onSale}
                      onChange={(e) => handleInputChange('onSale', e.target.checked)}
                    />
                    En promotion
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={productData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    Actif
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {productData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Détails physiques */}
            <Card>
              <CardHeader>
                <CardTitle>Détails physiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weight">Poids</Label>
                  <Input
                    id="weight"
                    value={productData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="1.2 kg"
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={productData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="25 x 15 x 10 cm"
                  />
                </div>
                
                {/* Marque multilingue */}
                <div>
                  <Label htmlFor="brand">Marque (Anglais)</Label>
                  <Input
                    id="brand"
                    value={productData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand Name"
                  />
                </div>
                <div>
                  <Label htmlFor="brandFr">Marque (Français)</Label>
                  <Input
                    id="brandFr"
                    value={productData.brandFr}
                    onChange={(e) => handleInputChange('brandFr', e.target.value)}
                    placeholder="Nom de marque"
                  />
                </div>
                <div>
                  <Label htmlFor="brandAr">Marque (العربية)</Label>
                  <Input
                    id="brandAr"
                    value={productData.brandAr}
                    onChange={(e) => handleInputChange('brandAr', e.target.value)}
                    placeholder="اسم العلامة التجارية"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 mt-8">
          <Link href="/admin/products">
            <Button variant="outline">Annuler</Button>
          </Link>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            disabled={createProduct.isPending || updateProduct.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Créer le produit"}
          </Button>
        </div>
      </div>
    </div>
  );
}