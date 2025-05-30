import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Package,
  Star
} from "lucide-react";
import type { Product } from "@/types";

export default function ProductsManagement() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: products, isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
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
    tags: [] as string[],
  });

  const resetForm = () => {
    setFormData({
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
      images: [],
      featured: false,
      onSale: false,
      isActive: true,
      tags: [],
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      nameFr: product.nameFr,
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      descriptionFr: product.descriptionFr || "",
      price: product.price,
      salePrice: product.salePrice || "",
      sku: product.sku || "",
      stock: product.stock?.toString() || "",
      categoryId: product.categoryId?.toString() || "",
      images: product.images || [],
      featured: product.featured || false,
      onSale: product.onSale || false,
      isActive: product.isActive !== false,
      tags: product.tags || [],
    });
    setIsProductDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: formData.price.toString(),
      salePrice: formData.salePrice || null,
      stock: parseInt(formData.stock) || 0,
      categoryId: parseInt(formData.categoryId) || null,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, data: productData });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct.mutateAsync(productData);
        toast({
          title: "Success", 
          description: "Product created successfully",
        });
      }
      
      setIsProductDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(productId);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const filteredProducts = products?.products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameFr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           product.categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Products Management</h1>
            </div>
            
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <Badge className="bg-green-500">Featured</Badge>
                  )}
                  {product.onSale && (
                    <Badge variant="destructive">Sale</Badge>
                  )}
                  {!product.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-purple-600">
                    ${parseFloat(product.salePrice || product.price).toFixed(2)}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Stock: {product.stock || 0}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{parseFloat(product.rating || "0").toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/admin/products/edit/${product.id}`} className="flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div>
                  <Label htmlFor="name">Product Name (English) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nameAr">Product Name (Arabic) *</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nameFr">Product Name (French) *</Label>
                  <Input
                    id="nameFr"
                    value={formData.nameFr}
                    onChange={(e) => setFormData({...formData, nameFr: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="descriptionFr">Description (French)</Label>
                  <Textarea
                    id="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={(e) => setFormData({...formData, descriptionFr: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({...formData, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                
                {/* Switches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Product</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="onSale">On Sale</Label>
                    <Switch
                      id="onSale"
                      checked={formData.onSale}
                      onCheckedChange={(checked) => setFormData({...formData, onSale: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsProductDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
