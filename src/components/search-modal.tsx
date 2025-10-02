import { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Filter, ArrowRight, Sliders, Star, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: () => void;
  onJewelleryClick: () => void;
  onMandalaClick: () => void;
  onNoveltyClick: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  isPopular?: boolean;
}

// Mock data - in real implementation, this would come from your backend
const allProducts: Product[] = [
  {
    id: 1,
    name: "Gold Plated Temple Jewelry Set",
    price: 12999,
    category: "Mahima's Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Sacred Mandala Wall Art",
    price: 3499,
    category: "Mahima's Mandala Art",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    inStock: true
  },
  {
    id: 3,
    name: "Handcrafted Ceramic Vase",
    price: 2499,
    category: "Novelty Products",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.5,
    inStock: true
  },
  {
    id: 4,
    name: "Silver Anklets with Bells",
    price: 5999,
    category: "Mahima's Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: "Lotus Mandala Canvas Print",
    price: 1999,
    category: "Mahima's Mandala Art",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.4,
    inStock: true
  },
  {
    id: 6,
    name: "Wooden Kitchen Utensil Set",
    price: 1799,
    category: "Novelty Products",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    inStock: true
  }
];

const popularSearches: SearchSuggestion[] = [
  { id: '1', text: 'gold jewelry', category: "Mahima's Jewellery", isPopular: true },
  { id: '2', text: 'mandala art', category: "Mahima's Mandala Art", isPopular: true },
  { id: '3', text: 'temple jewelry', category: "Mahima's Jewellery", isPopular: true },
  { id: '4', text: 'wall art', category: "Mahima's Mandala Art", isPopular: true },
  { id: '5', text: 'ceramic vase', category: "Novelty Products", isPopular: true },
  { id: '6', text: 'silver anklets', category: "Mahima's Jewellery", isPopular: true }
];

const quickCategories = [
  { name: "Mahima's Jewellery", count: 45, action: 'jewellery' },
  { name: "Mahima's Mandala Art", count: 32, action: 'mandala' },
  { name: "Novelty Products", count: 28, action: 'novelty' }
];

export function SearchModal({
  isOpen,
  onClose,
  onProductClick,
  onJewelleryClick,
  onMandalaClick,
  onNoveltyClick
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 50000] as [number, number],
    rating: 0,
    inStock: false,
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'
  });

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bhavyakavya-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search effect with filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      let filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Apply filters
      if (filters.categories.length > 0) {
        filtered = filtered.filter(product => 
          filters.categories.includes(product.category)
        );
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
        filtered = filtered.filter(product => 
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        );
      }

      if (filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= filters.rating);
      }

      if (filters.inStock) {
        filtered = filtered.filter(product => product.inStock);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Assuming newer products have higher IDs
          filtered.sort((a, b) => b.id - a.id);
          break;
        default:
          // Keep relevance order (already filtered by search query)
          break;
      }

      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('bhavyakavya-recent-searches', JSON.stringify(updated));
    }
    setSearchQuery(query);
  };

  const handleCategoryClick = (action: string) => {
    onClose();
    switch (action) {
      case 'jewellery':
        onJewelleryClick();
        break;
      case 'mandala':
        onMandalaClick();
        break;
      case 'novelty':
        onNoveltyClick();
        break;
    }
  };

  const handleCategoryFilter = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value as [number, number]
    }));
  };

  const handleRatingFilter = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handleStockFilter = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      inStock: checked
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      rating: 0,
      inStock: false,
      sortBy: 'relevance'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bhavyakavya-recent-searches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-lg shadow-2xl max-w-4xl mx-auto min-h-[90vh] sm:min-h-0">
              {/* Search Header */}
              <div className="flex items-center gap-2 sm:gap-4 p-4 sm:p-6 border-b">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for jewelry, mandala art, novelty products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 sm:py-3 text-base sm:text-lg border-2 focus:border-primary"
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-secondary flex-shrink-0"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Advanced Filters */}
              {searchQuery && (
                <div className="border-b p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      <span className="font-medium">Filters & Sort</span>
                      {(filters.categories.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 || filters.rating > 0 || filters.inStock) && (
                        <Badge variant="secondary" className="text-xs">
                          {[
                            filters.categories.length,
                            filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0,
                            filters.rating > 0 ? 1 : 0,
                            filters.inStock ? 1 : 0
                          ].reduce((a, b) => a + b, 0)} active
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Categories */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Categories</label>
                        <div className="space-y-2">
                          {['Mahima\'s Jewellery', 'Mahima\'s Mandala Art', 'Novelty Products', 'Traditional Crafts', 'Home Decor', 'Premium Collection'].map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category}`}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={(checked) => handleCategoryFilter(category, checked as boolean)}
                              />
                              <label htmlFor={`category-${category}`} className="text-sm">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <div className="space-y-2">
                          <Slider
                            value={filters.priceRange}
                            onValueChange={handlePriceRangeChange}
                            max={50000}
                            min={0}
                            step={500}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatPrice(filters.priceRange[0])}</span>
                            <span>{formatPrice(filters.priceRange[1])}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                        <div className="space-y-2">
                          {[4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center space-x-2">
                              <Checkbox
                                id={`rating-${rating}`}
                                checked={filters.rating === rating}
                                onCheckedChange={() => handleRatingFilter(rating)}
                              />
                              <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                {rating}+ stars
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sort & Stock */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Sort By</label>
                        <Select value={filters.sortBy} onValueChange={handleSortChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="mt-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="inStock"
                              checked={filters.inStock}
                              onCheckedChange={handleStockFilter}
                            />
                            <label htmlFor="inStock" className="text-sm">
                              In Stock Only
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="max-h-[75vh] sm:max-h-[70vh] overflow-auto">
                {!searchQuery ? (
                  /* No Search Query - Show Default Content */
                  <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                    {/* Quick Categories */}
                    <div>
                      <h3 className="text-lg text-foreground mb-4 flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Browse Categories
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {quickCategories.map((category) => (
                          <Card
                            key={category.name}
                            className="cursor-pointer hover:shadow-md transition-shadow group"
                            onClick={() => handleCategoryClick(category.action)}
                          >
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                                    {category.name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {category.count} products
                                  </p>
                                </div>
                                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-base sm:text-lg text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {popularSearches.map((suggestion) => (
                          <Badge
                            key={suggestion.id}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-2"
                            onClick={() => handleSearch(suggestion.text)}
                          >
                            {suggestion.text}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base sm:text-lg text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                            Recent Searches
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearRecentSearches}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Clear all
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary transition-colors px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm"
                              onClick={() => handleSearch(search)}
                            >
                              {search}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Search Results */
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg text-foreground">
                        {isSearching ? 'Searching...' : `${searchResults.length} results for "${searchQuery}"`}
                      </h3>
                    </div>

                    {isSearching ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="bg-muted rounded-lg h-48 mb-4"></div>
                            <div className="bg-muted h-4 rounded mb-2"></div>
                            <div className="bg-muted h-4 rounded w-2/3"></div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card
                              className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                              onClick={() => {
                                onClose();
                                onProductClick();
                              }}
                            >
                              <CardContent className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg">
                                  <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {!product.inStock && (
                                    <Badge
                                      variant="secondary"
                                      className="absolute top-2 left-2 text-xs"
                                    >
                                      Out of Stock
                                    </Badge>
                                  )}
                                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 rounded px-1 py-0.5">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium">{product.rating}</span>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <Badge variant="outline" className="text-xs mb-2">
                                    {product.category}
                                  </Badge>
                                  <h4 className="text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg text-primary">
                                      ₹{product.price.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-yellow-400">★</span>
                                      <span className="text-sm text-muted-foreground">
                                        {product.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h4 className="text-xl text-foreground mb-2">No products found</h4>
                        <p className="text-muted-foreground mb-6">
                          Try searching with different keywords or browse our categories
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {popularSearches.slice(0, 3).map((suggestion) => (
                            <Badge
                              key={suggestion.id}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm"
                              onClick={() => handleSearch(suggestion.text)}
                            >
                              Try "{suggestion.text}"
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}