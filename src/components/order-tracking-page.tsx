import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'motion/react';
import { OrderService, type Order } from '../services/orderService';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface OrderTrackingPageProps {
  onBackToHome: () => void;
}

export function OrderTrackingPage({ onBackToHome }: OrderTrackingPageProps) {
  const [searchEmail, setSearchEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearchOrders = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await OrderService.getOrdersByCustomer(searchEmail);
      if (response.success && response.orders) {
        setOrders(response.orders);
        if (response.orders.length === 0) {
          toast.info('No orders found for this email address');
        }
      } else {
        toast.error(response.error || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      toast.error('Failed to search orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusProgress = (status: Order['status']) => {
    const steps = [
      { key: 'pending', label: 'Order Received' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'processing', label: 'Processing' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

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
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Order Tracking</h1>
            <p className="text-muted-foreground">Track your orders and delivery status</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchOrders()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearchOrders} 
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? 'Searching...' : 'Search Orders'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Orders</h2>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedOrder(order)}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatPrice(order.totalAmount)}</p>
                            <Badge className={OrderService.getStatusColor(order.status)}>
                              {OrderService.getStatusText(order.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} • {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div className="flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedOrder(null)}>
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Number:</span>
                          <span className="font-medium">{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Date:</span>
                          <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={OrderService.getStatusColor(selectedOrder.status)}>
                            {OrderService.getStatusText(selectedOrder.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Status:</span>
                          <Badge className={OrderService.getPaymentStatusColor(selectedOrder.paymentStatus)}>
                            {OrderService.getPaymentStatusText(selectedOrder.paymentStatus)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-semibold text-lg">{formatPrice(selectedOrder.totalAmount)}</span>
                        </div>
                        {selectedOrder.estimatedDelivery && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estimated Delivery:</span>
                            <span className="font-medium">{selectedOrder.estimatedDelivery}</span>
                          </div>
                        )}
                        {selectedOrder.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tracking Number:</span>
                            <span className="font-medium">{selectedOrder.trackingNumber}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-medium">{selectedOrder.customerDetails.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{selectedOrder.customerDetails.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{selectedOrder.customerDetails.phone}</span>
                          </div>
                          <Separator />
                          <div className="text-sm">
                            <p>{selectedOrder.customerDetails.address.street}</p>
                            <p>{selectedOrder.customerDetails.address.city}, {selectedOrder.customerDetails.address.state}</p>
                            <p>{selectedOrder.customerDetails.address.pincode}, {selectedOrder.customerDetails.address.country}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items and Status */}
                  <div className="space-y-6">
                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                <p className="font-medium">{formatPrice(item.price)} each</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Status Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {getStatusProgress(selectedOrder.status).map((step, index) => (
                            <div key={step.key} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed ? 'bg-green-100 text-green-600' : 
                                step.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {step.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <span className="text-xs font-medium">{index + 1}</span>
                                )}
                              </div>
                              <span className={`text-sm ${
                                step.completed ? 'text-green-600 font-medium' : 
                                step.current ? 'text-blue-600 font-medium' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
