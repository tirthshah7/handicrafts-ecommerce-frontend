import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PaymentModal } from './payment-modal';
import { useState } from 'react';

interface CartPageProps {
  onBackToHome: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (orderData: any) => void;
}

export function CartPage({ 
  onBackToHome, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onClearCart,
  onOrderPlaced 
}: CartPageProps) {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + shipping;
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Clear cart after successful payment
    onClearCart();
    
    // Notify parent component about the order
    if (onOrderPlaced) {
      onOrderPlaced(paymentData);
    }
    
    // Show success message
    alert('Order placed successfully! You will receive a confirmation email shortly.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackToHome}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl">Shopping Cart</h1>
          </div>

          {/* Empty Cart State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button onClick={onBackToHome} className="px-8">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackToHome}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl">Shopping Cart</h1>
              <span className="text-muted-foreground text-sm sm:text-base">
                ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onClearCart}
            className="text-destructive hover:text-destructive self-start sm:self-auto"
            size="sm"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 self-center sm:self-start">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-8">
              <CardContent className="p-6">
                <h2 className="text-xl mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 You've qualified for free shipping!
                    </p>
                  )}
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add ₹{500 - subtotal} more for free shipping
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={onBackToHome}
                    className="text-primary hover:text-primary"
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    🔒 Secure checkout with SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cartItems={cartItems}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}