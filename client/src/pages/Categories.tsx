import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Filter, Grid3X3, List } from "lucide-react";
import type { Product } from "@/types";

export default function Categories() {
  const { t, language } = useI18n();
  const { data: categories = [] } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { data: productsData } = useProducts({
    categoryId: selectedCategoryId,
    search: searchQuery,
    sortBy: sortBy as any,
    sortOrder: "asc"
  });

  const products = productsData?.products || [];

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? undefined : categoryId);
  };

  const handleProductQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  const getLocalizedName = (item: any) => {
    if (language === 'ar') return item.nameAr || item.name;
    if (language === 'fr') return item.nameFr || item.name;
    return item.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.nav.home}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.categories.title}
            </h1>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              {t.nav.home}
            </Link>
            <span>/</span>
            <span>{t.categories.title}</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-purple-600 font-medium">
                  {getLocalizedName(selectedCategory)}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories Filter */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                {t.categories.title}
              </h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategoryId === undefined ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategoryId(undefined)}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {getLocalizedName(category)}
                    <Badge variant="secondary" className="ml-auto">
                      {category.productCount || 0}
                    </Badge>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Search and Filters */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                {t.products.filters}
              </h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t.products.sortBy}
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="created">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory ? getLocalizedName(selectedCategory) : "All Products"}
                </h2>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <Card className="p-12 text-center backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <div className="text-gray-500 mb-4">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategoryId(undefined); }}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <div key={product.id} className={viewMode === "list" ? "w-full" : ""}>
                    <ProductCard
                      product={product}
                      onQuickView={handleProductQuickView}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {products.length > 0 && products.length % 12 === 0 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}