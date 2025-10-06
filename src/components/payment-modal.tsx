import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentService, initializeRazorpay, openRazorpay } from '../services/paymentService';
import { OrderService, type CreateOrderRequest } from '../services/orderService';
import { NotificationService } from '../services/notificationService';
import type { CartItem } from '../App';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onPaymentSuccess: (paymentData: any) => void;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export function PaymentModal({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess }: PaymentModalProps) {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initializeRazorpay().then((loaded) => {
        setRazorpayLoaded(!!loaded);
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerDetails(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CustomerDetails] as any || {}),
          [child]: value
        }
      }));
    } else {
      setCustomerDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateDetails = () => {
    const { name, email, phone, address } = customerDetails;
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!phone.trim() || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      toast.error('Please fill in all address fields');
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateDetails()) {
      setCurrentStep('payment');
    }
  };

  const processPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment system is not ready. Please try again.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order on backend
      const orderResponse = await PaymentService.createOrder(totalAmount);
      
      if (!orderResponse) {
        throw new Error('Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your actual Razorpay key
        amount: orderResponse.amount,
        currency: 'INR',
        name: 'Handicrafts E-commerce',
        description: `Payment for ${cartItems.length} item(s)`,
        order_id: orderResponse.orderId,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone
        },
        notes: {
          address: JSON.stringify(customerDetails.address),
          items: JSON.stringify(cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })))
        },
        theme: {
          color: '#059669'
        },
        handler: async (response: any) => {
          try {
            // Verify payment signature
            const isValid = PaymentService.verifyPaymentSignature(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (isValid) {
              // Create order after successful payment
              const orderData: CreateOrderRequest = {
                items: cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                  category: item.category
                })),
                customerDetails,
                totalAmount,
                paymentData: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                }
              };

              const orderResponse = await OrderService.createOrder(orderData);
              
              if (orderResponse.success && orderResponse.order) {
                toast.success('Payment successful! Order created.');
                
                // Send order confirmation email
                try {
                  await NotificationService.sendOrderConfirmation(orderResponse.order);
                  console.log('Order confirmation email sent successfully');
                } catch (error) {
                  console.error('Failed to send order confirmation email:', error);
                  // Don't fail the payment process if email fails
                }
                
                onPaymentSuccess({
                  ...response,
                  customerDetails,
                  cartItems,
                  totalAmount,
                  order: orderResponse.order
                });
                onClose();
              } else {
                toast.error('Payment successful but order creation failed. Please contact support.');
                console.error('Order creation failed:', orderResponse.error);
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        }
      };

      // Open Razorpay checkout
      await openRazorpay(options);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {currentStep === 'details' ? 'Customer Details' : 'Payment'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'details' ? (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Textarea
                    id="street"
                    value={customerDetails.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder="Enter your street address"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerDetails.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerDetails.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={customerDetails.address.pincode}
                      onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={customerDetails.address.country}
                    onValueChange={(value) => handleInputChange('address.country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm">{item.name} x {item.quantity}</span>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{customerDetails.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{customerDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{customerDetails.address.street}, {customerDetails.address.city}, {customerDetails.address.state} - {customerDetails.address.pincode}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm">{item.name} x {item.quantity}</span>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total Amount</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {formatPrice(totalAmount)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('details')}>
                Back to Details
              </Button>
              <Button 
                onClick={processPayment} 
                disabled={isProcessing || !razorpayLoaded}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
