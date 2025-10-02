import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Heart, ShoppingCart, Filter, SortAsc, Star, Eye, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  isPremium?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  discount?: number;
}

interface NoveltyProductsPageProps {
  onBackToHome: () => void;
  onProductClick?: (product: Product) => void;
  onAddToWishlist?: (item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    isExclusive?: boolean;
    isLimitedEdition?: boolean;
  }) => void;
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
    category: string;
  }) => void;
  isInWishlist?: (productId: string) => boolean;
}

export function NoveltyProductsPage({ onBackToHome, onProductClick, onAddToWishlist, onAddToCart, isInWishlist }: NoveltyProductsPageProps) {
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch novelty products on component mount
  useEffect(() => {
    const fetchNoveltyProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products by category
        const response = await api.getProducts({ 
          category: 'Novelty Products'
        });
        
        if (response.success && response.data?.products) {
          setProducts(response.data.products);
        } else {
          throw new Error(response.error || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching novelty products:', err);
        setError('Failed to load novelty products. Please try again later.');
        toast.error('Failed to load novelty products');
      } finally {
        setLoading(false);
      }
    };

    fetchNoveltyProducts();
  }, []);

  const toggleWishlist = (product: Product) => {
    const productId = product.id;
    if (isInWishlist?.(productId)) {
      return;
    } else {
      onAddToWishlist?.({
        id: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        isExclusive: product.isPremium,
        isLimitedEdition: product.isNew
      });
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const addToCart = (product: Product) => {
    onAddToCart?.({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      category: product.category
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    // Apply price filter
    if (priceRange !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        switch (priceRange) {
          case 'under-1000':
            return product.price < 1000;
          case '1000-2000':
            return product.price >= 1000 && product.price <= 2000;
          case 'above-2000':
            return product.price > 2000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filteredProducts;
  };

  const displayProducts = getFilteredAndSortedProducts();

  function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
          <div className="relative">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge variant="secondary">New</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="bg-card p-2 rounded-full shadow-lg mb-2 hover:bg-accent transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 transition-colors ${
                    isInWishlist?.(product.id) 
                      ? 'text-primary fill-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`} 
                />
              </motion.button>
            </div>

            {/* Discount Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="mb-2">
              <p className="text-xs text-primary uppercase tracking-wide">
                {product.category}
              </p>
            </div>
            
            <h3 className="text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onProductClick?.(product)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary/30 via-accent/20 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="mb-6 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl text-foreground mb-6">
                Novelty Products
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover unique and charming handicraft items that add character to your space. 
                From decorative pieces to functional art, find something special for every corner of your home.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {displayProducts.length} Products
                </Badge>
                <Badge className="text-sm">
                  Affordable Handicrafts
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                  <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                  <SelectItem value="above-2000">Above ₹2,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading novelty products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && displayProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No novelty products found matching your criteria.</p>
              <Button onClick={() => setPriceRange('all')}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && displayProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center mt-12"
              >
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Load More Products
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}