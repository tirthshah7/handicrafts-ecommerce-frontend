import { api } from '../utils/api';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface CustomerDetails {
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

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customerDetails: CustomerDetails;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerDetails: CustomerDetails;
  totalAmount: number;
  paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export class OrderService {
  // Create a new order
  static async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await api.createOrder(orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      };
    }
  }

  // Get order by ID
  static async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await api.getOrder(orderId);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order'
      };
    }
  }

  // Get orders by customer email
  static async getOrdersByCustomer(email: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const response = await api.getOrdersByCustomer(email);
      return response;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      };
    }
  }

  // Update order status (admin only)
  static async updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Promise<OrderResponse> {
    try {
      const response = await api.updateOrderStatus(orderId, status, notes);
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order status'
      };
    }
  }

  // Generate order number
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  // Calculate estimated delivery date
  static calculateEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
    return deliveryDate.toISOString().split('T')[0];
  }

  // Format order for display
  static formatOrderForDisplay(order: Order) {
    return {
      ...order,
      formattedTotal: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(order.totalAmount),
      formattedDate: new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(order.createdAt)),
      statusColor: OrderService.getStatusColor(order.status),
      paymentStatusColor: OrderService.getPaymentStatusColor(order.paymentStatus)
    };
  }

  // Get status color for UI
  static getStatusColor(status: Order['status']): string {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  }

  // Get payment status color for UI
  static getPaymentStatusColor(status: Order['paymentStatus']): string {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      paid: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      refunded: 'text-orange-600 bg-orange-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  }

  // Get order status text
  static getStatusText(status: Order['status']): string {
    const statusTexts = {
      pending: 'Order Received',
      confirmed: 'Order Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusTexts[status] || status;
  }

  // Get payment status text
  static getPaymentStatusText(status: Order['paymentStatus']): string {
    const statusTexts = {
      pending: 'Payment Pending',
      paid: 'Payment Completed',
      failed: 'Payment Failed',
      refunded: 'Refunded'
    };
    return statusTexts[status] || status;
  }
}
