import { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  isExclusive?: boolean;
  isLimitedEdition?: boolean;
  stockCount?: number;
}

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: WishlistItem[];
  onRemoveFromWishlist: (productId: string) => void;
  onProductClick: () => void;
}

export function WishlistSidebar({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onRemoveFromWishlist, 
  onProductClick 
}: WishlistSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleProductClick = (product: WishlistItem) => {
    onProductClick();
    onClose();
  };

  const handleAddToCart = (product: WishlistItem) => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card shadow-2xl z-50 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <div>
                <h2 className="text-lg sm:text-xl text-foreground">Wishlist</h2>
                <p className="text-sm text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding products you love to your wishlist
                </p>
                <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => handleProductClick(item)}
                          >
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Premium Badges */}
                          <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                            {item.isExclusive && (
                              <Badge variant="secondary" className="text-xs px-1 py-0.5 bg-primary text-primary-foreground">
                                Exclusive
                              </Badge>
                            )}
                            {item.isLimitedEdition && (
                              <Badge variant="secondary" className="text-xs px-1 py-0.5 bg-accent text-accent-foreground">
                                Limited
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 
                              className="text-sm sm:text-base text-foreground cursor-pointer hover:text-primary transition-colors line-clamp-2"
                              onClick={() => handleProductClick(item)}
                            >
                              {item.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveFromWishlist(item.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="text-xs text-muted-foreground mb-2">{item.category}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm sm:text-base text-primary">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          {item.stockCount !== undefined && (
                            <div className="mb-3">
                              {item.stockCount === 0 ? (
                                <Badge variant="destructive" className="text-xs">
                                  Out of Stock
                                </Badge>
                              ) : item.stockCount <= 3 ? (
                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                  Only {item.stockCount} left
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  In Stock
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Action Button */}
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stockCount === 0}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {item.stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="border-t border-border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    // TODO: Implement move all to cart functionality
                    console.log('Moving all items to cart');
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}