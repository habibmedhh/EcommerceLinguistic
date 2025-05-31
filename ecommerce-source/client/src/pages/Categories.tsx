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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.categories.title}
            </h1>
          </div>

          {selectedCategory && (
            <div className="text-center text-sm text-gray-600 mt-2">
              <span className="text-purple-600 font-medium">
                {getLocalizedName(selectedCategory)}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Mobile Categories Filter */}
        <div className="block lg:hidden mb-6">
          <Card className="p-4 backdrop-blur-sm bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
            <h3 className="font-semibold text-lg mb-3 text-center text-gray-800">
              📂 {t.categories.title}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedCategoryId === undefined ? "default" : "outline"}
                className="text-sm py-2 px-3 rounded-xl"
                onClick={() => setSelectedCategoryId(undefined)}
              >
                🌟 Tout
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  className="text-sm py-2 px-3 rounded-xl"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {getLocalizedName(category)}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
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
                      0
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
            {/* Mobile Search Bar */}
            <div className="block lg:hidden mb-4">
              <Card className="p-3 backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`🔍 ${t.common.search}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-2 border-purple-200 focus:border-purple-500"
                  />
                </div>
              </Card>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 md:gap-4">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                  {selectedCategory ? getLocalizedName(selectedCategory) : t.products.title}
                </h2>
                <Badge variant="secondary" className="text-sm md:text-base px-2 md:px-3 py-1">
                  {products.length}
                </Badge>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
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
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
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