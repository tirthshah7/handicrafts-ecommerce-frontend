import { motion } from 'motion/react';
import { ArrowLeft, Star, Heart, Crown, Sparkles, Diamond, Award, Eye, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useBackend } from './backend-provider';
import type { Product } from '../App';

interface PremiumCollectionPageProps {
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
    isPremium?: boolean;
    inStock?: boolean;
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

export function PremiumCollectionPage({ onBackToHome, onProductClick, onAddToWishlist, onAddToCart, isInWishlist }: PremiumCollectionPageProps) {
  const [filter, setFilter] = useState<'all' | 'jewellery' | 'art'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-high' | 'price-low' | 'rating'>('featured');
  const [isLoading, setIsLoading] = useState(true);

  const { products: allProducts, loadProducts } = useBackend();

  // Load products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        await loadProducts();
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [loadProducts]);

  // Filter for premium products only
  const premiumProducts = allProducts.filter(product => 
    product && 
    product.isPremium && 
    product.id && 
    product.image
  );

  const filteredProducts = premiumProducts.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'jewellery') return product.category === "Mahima's Jewellery";
    if (filter === 'art') return product.category === "Mahima's Mandala Art";
    return true;
  });

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
        isPremium: product.isPremium,
        inStock: product.inStock
      });
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
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button variant="ghost" onClick={onBackToHome} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="text-lg text-primary">BhavyaKavya's</div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-16 w-96 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-80" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBackToHome} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-lg text-primary">BhavyaKavya's</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/5 to-accent/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-6xl text-primary">
                Premium Collection
              </h1>
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover our most exquisite handcrafted pieces. Each item in our premium collection 
              represents the pinnacle of traditional artistry and contemporary elegance.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary flex items-center gap-2">
                <Diamond className="h-4 w-4" />
                {sortedProducts.length} Premium Items
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-secondary/50 text-secondary-foreground flex items-center gap-2">
                <Award className="h-4 w-4" />
                Handcrafted Excellence
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Premium
              </Button>
              <Button
                variant={filter === 'jewellery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('jewellery')}
              >
                Jewellery
              </Button>
              <Button
                variant={filter === 'art' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('art')}
              >
                Mandala Art
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border rounded text-sm bg-background"
              >
                <option value="featured">Featured</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl mb-4 text-muted-foreground">No premium products found</h3>
              <p className="text-muted-foreground mb-8">
                We're currently updating our premium collection. Please check back soon for exclusive handcrafted items!
              </p>
              <Button onClick={onBackToHome}>
                Browse Other Collections
              </Button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Premium
                        </Badge>
                      </div>

                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant={isInWishlist?.(product.id) ? "default" : "secondary"}
                          className="h-10 w-10 shadow-lg backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist?.(product.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-10 w-10 shadow-lg backdrop-blur-sm"
                          onClick={() => onProductClick?.(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center justify-between text-white">
                          <div>
                            <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm line-through opacity-75 ml-2">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <Badge variant="secondary" className="bg-green-600 text-white">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      <h3 className="text-xl mb-2 group-hover:text-primary transition-colors duration-200 cursor-pointer" 
                          onClick={() => onProductClick?.(product)}>
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 capitalize flex items-center gap-2">
                        <Diamond className="h-3 w-3" />
                        {product.category}
                      </p>

                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => onProductClick?.(product)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}