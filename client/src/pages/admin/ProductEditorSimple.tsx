import { useState, useEffect } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSettings } from "@/hooks/useSettings";
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
  X, 
  Plus, 
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  DollarSign
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";

export default function ProductEditorSimple() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const isEdit = !!id;
  const { data: product } = useProduct(isEdit ? parseInt(id) : 0);
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
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
    costPrice: "",
    profitMargin: "",
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
    reviews: [] as Array<{
      id?: number;
      customerName: string;
      rating: number;
      comment: string;
      date?: string;
    }>,
    averageRating: 0,
    reviewCount: 0,
    displayReviewCount: 0,
  });

  const [newTag, setNewTag] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newReview, setNewReview] = useState({
    customerName: "",
    rating: 5,
    comment: ""
  });

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
        costPrice: product.costPrice || "",
        profitMargin: product.profitMargin || "",
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
        reviews: Array.isArray(product.reviews) ? product.reviews : [],
        averageRating: parseFloat(product.averageRating || "0"),
        reviewCount: product.reviewCount || 0,
      });
      
      // Initialiser les URLs d'images
      if (Array.isArray(product.images)) {
        setImageUrls(product.images);
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
        setImageUrls(prev => [...prev, imageUrl]);
        setProductData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addImageUrl = (url: string) => {
    if (url.trim()) {
      setImageUrls(prev => [...prev, url.trim()]);
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
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

  const addReview = () => {
    if (newReview.customerName.trim() && newReview.comment.trim()) {
      const review = {
        ...newReview,
        date: new Date().toISOString(),
        id: Date.now()
      };
      
      setProductData(prev => {
        const newReviews = [...prev.reviews, review];
        const newAverageRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        
        return {
          ...prev,
          reviews: newReviews,
          averageRating: newAverageRating,
          reviewCount: newReviews.length
        };
      });
      
      setNewReview({
        customerName: "",
        rating: 5,
        comment: ""
      });
    }
  };

  const removeReview = (reviewId: number) => {
    setProductData(prev => {
      const newReviews = prev.reviews.filter(r => r.id !== reviewId);
      const newAverageRating = newReviews.length > 0 
        ? newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length 
        : 0;
      
      return {
        ...prev,
        reviews: newReviews,
        averageRating: newAverageRating,
        reviewCount: newReviews.length
      };
    });
  };

  const handleSave = async () => {
    try {
      const saveData = {
        ...productData,
        price: productData.price.toString(),
        salePrice: productData.salePrice || null,
        costPrice: productData.costPrice || null,
        profitMargin: productData.profitMargin || null,
        stock: parseInt(productData.stock) || 0,
        categoryId: parseInt(productData.categoryId) || null,
        images: productData.images,
        tags: productData.tags,
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Prix de vente ({settings?.currencySymbol || '€'}) *</Label>
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
                    <Label htmlFor="costPrice">Prix de revient ({settings?.currencySymbol || '€'})</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      value={productData.costPrice}
                      onChange={(e) => handleInputChange('costPrice', e.target.value)}
                      placeholder="15.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Coût d'achat ou de production</p>
                  </div>
                  <div>
                    <Label htmlFor="profitMargin">Marge bénéficiaire (%)</Label>
                    <Input
                      id="profitMargin"
                      type="number"
                      step="0.01"
                      value={productData.profitMargin}
                      onChange={(e) => handleInputChange('profitMargin', e.target.value)}
                      placeholder="50.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Pourcentage de marge</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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

                {/* Calcul automatique du bénéfice */}
                {productData.price && productData.costPrice && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">💰 Analyse des bénéfices</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bénéfice unitaire:</span>
                        <div className="font-bold text-green-700">
                          {(parseFloat(productData.price) - parseFloat(productData.costPrice || "0")).toFixed(2)} {settings?.currencySymbol || '€'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Marge calculée:</span>
                        <div className="font-bold text-green-700">
                          {productData.costPrice ? (((parseFloat(productData.price) - parseFloat(productData.costPrice)) / parseFloat(productData.price)) * 100).toFixed(2) : 0}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI:</span>
                        <div className="font-bold text-green-700">
                          {productData.costPrice ? (((parseFloat(productData.price) - parseFloat(productData.costPrice)) / parseFloat(productData.costPrice)) * 100).toFixed(2) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Galerie d'images du produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image principale */}
                <div>
                  <Label className="text-lg font-semibold">Image principale *</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500">Cette image sera affichée en premier dans la liste des produits</p>
                  </div>
                </div>

                <Separator />

                {/* Images détaillées */}
                <div>
                  <Label className="text-lg font-semibold">Images détaillées</Label>
                  <p className="text-sm text-gray-600 mb-3">Ajoutez plusieurs photos pour montrer différents angles et détails du produit</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="detailImages">Uploader plusieurs images</Label>
                      <Input
                        id="detailImages"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-500">Formats: JPG, PNG, WebP - Max 10MB par image</p>
                    </div>

                    <div>
                      <Label>Ou ajouter une URL d'image</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/product-detail.jpg"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addImageUrl(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button 
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addImageUrl(input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Galerie d'images */}
                {imageUrls.length > 0 && (
                  <div>
                    <Label className="text-lg font-semibold">Aperçu de la galerie ({imageUrls.length} images)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                      {imageUrls.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="relative">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";
                              }}
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Principale
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <p className="text-xs text-center mt-1 text-gray-500">Image {index + 1}</p>
                        </div>
                      ))}
                    </div>
                    
                    {imageUrls.length > 6 && (
                      <p className="text-sm text-amber-600 mt-2">
                        💡 Conseil: Trop d'images peuvent ralentir le chargement. Considérez garder les 6 meilleures images.
                      </p>
                    )}
                  </div>
                )}

                {imageUrls.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">Aucune image ajoutée</p>
                    <p className="text-sm text-gray-400">Ajoutez au moins une image pour votre produit</p>
                  </div>
                )}
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
                          {language === 'ar' ? category.nameAr : language === 'fr' ? category.nameFr : category.name}
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

            {/* Section Avis et Reviews */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Avis et Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Statistiques des avis */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Note moyenne</Label>
                    <div className="text-2xl font-bold text-yellow-600">
                      {(typeof productData.averageRating === 'number' ? productData.averageRating : parseFloat(productData.averageRating || "0")).toFixed(1)} ⭐
                    </div>
                  </div>
                  <div>
                    <Label>Nombre d'avis</Label>
                    <div className="text-2xl font-bold text-blue-600">
                      {productData.reviewCount}
                    </div>
                  </div>
                </div>

                {/* Ajouter un nouvel avis */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold">Ajouter un avis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reviewerName">Nom du client</Label>
                      <Input
                        id="reviewerName"
                        value={newReview.customerName}
                        onChange={(e) => setNewReview(prev => ({...prev, customerName: e.target.value}))}
                        placeholder="Nom du client"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Note (1-5)</Label>
                      <Select
                        value={newReview.rating.toString()}
                        onValueChange={(value) => setNewReview(prev => ({...prev, rating: parseInt(value)}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 ⭐</SelectItem>
                          <SelectItem value="2">2 ⭐⭐</SelectItem>
                          <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                          <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                          <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reviewComment">Commentaire</Label>
                    <Textarea
                      id="reviewComment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                      placeholder="Commentaire du client..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={addReview} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter l'avis
                  </Button>
                </div>

                {/* Liste des avis existants */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Avis existants ({productData.reviews.length})</h4>
                  {productData.reviews.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {productData.reviews.map((review, index) => (
                        <div key={review.id || index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{review.customerName}</div>
                              <div className="text-sm text-gray-500">
                                {"⭐".repeat(review.rating)} ({review.rating}/5)
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReview(review.id || index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                          {review.date && (
                            <div className="text-xs text-gray-400">
                              {new Date(review.date).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucun avis pour ce produit
                    </div>
                  )}
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