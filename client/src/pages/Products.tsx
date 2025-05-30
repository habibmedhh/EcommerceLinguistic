import { useState } from "react";
import { Link } from "wouter";
import { useI18n } from "@/providers/I18nProvider";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Filter, Grid3X3, List, Star, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";

export default function Products() {
  const { t, language } = useI18n();
  const { data: categories = [] } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: productsData, isLoading } = useProducts({
    categoryId: selectedCategoryId,
    search: searchQuery,
    sortBy: sortBy as any,
    sortOrder,
    featured: featuredOnly || undefined,
    onSale: onSaleOnly || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1]
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  const handleProductQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const clearFilters = () => {
    setSelectedCategoryId(undefined);
    setSearchQuery("");
    setSortBy("name");
    setSortOrder("asc");
    setPriceRange([0, 1000]);
    setFeaturedOnly(false);
    setOnSaleOnly(false);
  };

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
              {t.products.title}
            </h1>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t.products.filters}
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Search */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                {t.common.search}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                {t.categories.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all-categories"
                    checked={selectedCategoryId === undefined}
                    onCheckedChange={() => setSelectedCategoryId(undefined)}
                  />
                  <label htmlFor="all-categories" className="text-sm font-medium">
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryId === category.id}
                      onCheckedChange={(checked) => 
                        setSelectedCategoryId(checked ? category.id : undefined)
                      }
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm font-medium flex-1">
                      {getLocalizedName(category)}
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount || 0}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Price Range */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                {t.products.priceRange}
              </h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </Card>

            {/* Special Filters */}
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Special Options
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={featuredOnly}
                    onCheckedChange={(checked) => setFeaturedOnly(!!checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured Products
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={onSaleOnly}
                    onCheckedChange={(checked) => setOnSaleOnly(!!checked)}
                  />
                  <label htmlFor="on-sale" className="text-sm font-medium">
                    On Sale
                  </label>
                </div>
              </div>
            </Card>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Products
                </h2>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalProducts} {totalProducts === 1 ? "product" : "products"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="created">Newest</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">↑</SelectItem>
                      <SelectItem value="desc">↓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
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
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </Card>
                ))}
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && products.length === 0 ? (
              <Card className="p-12 text-center backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                <div className="text-gray-500 mb-4">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            ) : !isLoading && (
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

            {/* Pagination */}
            {products.length > 0 && totalProducts > products.length && (
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