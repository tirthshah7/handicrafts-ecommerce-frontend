import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Filter,
  Grid3X3,
  List,
  ArrowLeft,
  ArrowUpDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useBackend } from './backend-provider';
import type { Product } from '../App';

// Collection information
const collectionInfo = {
  "Mahima's Jewellery": {
    title: "Mahima's Jewellery Collection",
    description: "Exquisite handcrafted jewelry pieces that blend traditional artistry with contemporary elegance. Each piece tells a story of heritage and craftsmanship.",
    image: "https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbmVja2xhY2UlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyMzM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "Mahima's Mandala Art": {
    title: "Mahima's Mandala Art Collection",
    description: "Sacred geometric art forms that bring peace, harmony, and spiritual balance to your living spaces. Each mandala is carefully crafted with meditation and intention.",
    image: "https://images.unsplash.com/photo-1649359815698-a1d9f4df71b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwbWFuZGFsYSUyMGFydCUyMGluZGlhbiUyMHdhbGx8ZW58MXx8fHwxNzU5MjMzOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
};

interface CollectionPageProps {
  category: "Mahima's Jewellery" | "Mahima's Mandala Art";
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

export function CollectionPage({ category, onBackToHome, onProductClick, onAddToWishlist, onAddToCart, isInWishlist }: CollectionPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  
  const { products: allProducts, loadProducts } = useBackend();

  // Load products for this category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        await loadProducts(); // Load all products, then filter by category
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, loadProducts]);

  // Filter products by category
  const products = allProducts.filter(product => 
    product && 
    product.category === category && 
    product.id && 
    product.image
  );
  const info = collectionInfo[category];

  const toggleWishlist = (product: Product) => {
    const productId = product.id;
    if (isInWishlist?.(productId)) {
      // Item is already in wishlist, this would require a remove function
      // For now, we'll just handle adding since we have onAddToWishlist
      return;
    } else {
      onAddToWishlist?.({
        id: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: category,
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

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
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

        {/* Hero Section Skeleton */}
        <section className="relative py-20 bg-gradient-to-r from-secondary/50 to-accent/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
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
      <section className="relative py-20 bg-gradient-to-r from-secondary/50 to-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl mb-6 text-primary">
              {info.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {info.description}
            </p>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary">
              {products.length} Products Available
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
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
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl mb-4 text-muted-foreground">No products found</h3>
              <p className="text-muted-foreground mb-8">
                We're currently updating our {category} collection. Please check back soon!
              </p>
              <Button onClick={onBackToHome}>
                Browse Other Collections
              </Button>
            </div>
          ) : (
            <motion.div 
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
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
                  <Card className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                        }`}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isPremium && (
                          <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg">
                            Premium
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="secondary" className="bg-green-600 text-white shadow-lg">
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant={isInWishlist?.(product.id) ? "default" : "secondary"}
                          className="h-8 w-8 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist?.(product.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>

                        <h3 className="text-lg mb-2 group-hover:text-primary transition-colors duration-200 cursor-pointer" 
                            onClick={() => onProductClick?.(product)}>
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4 capitalize">{product.category}</p>
                        
                        {viewMode === 'list' && product.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl text-primary">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => onProductClick?.(product)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
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