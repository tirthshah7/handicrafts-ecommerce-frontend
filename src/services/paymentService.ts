import Razorpay from 'razorpay';

// Razorpay configuration
const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; // Test key - replace with your actual key
const RAZORPAY_KEY_SECRET = 'thisisnotarealsecret'; // Test secret - replace with your actual secret

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export interface PaymentRequest {
  amount: number; // Amount in paise (INR)
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  amount?: number;
  error?: string;
}

export class PaymentService {
  // Create a Razorpay order
  static async createOrder(amount: number, currency: string = 'INR'): Promise<{ orderId: string; amount: number }> {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `order_${Date.now()}`,
        notes: {
          source: 'handicrafts-ecommerce'
        }
      };

      const order = await razorpay.orders.create(options);
      return {
        orderId: order.id,
        amount: Number(order.amount)
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature (client-side verification - should be done on server in production)
  static verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      // In a production environment, this verification should be done on the server
      // For now, we'll do a basic validation
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return false;
      }
      
      // Basic signature format validation
      if (razorpaySignature.length < 10) {
        return false;
      }
      
      // In production, you should send the signature to your backend for verification
      // using the Razorpay webhook or server-side verification
      return true;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Process payment on frontend
  static async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Create order first
      const order = await this.createOrder(paymentRequest.amount, paymentRequest.currency);

      // Configure Razorpay options for frontend
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: paymentRequest.currency,
        name: 'Handicrafts E-commerce',
        description: paymentRequest.description,
        order_id: order.orderId,
        prefill: {
          name: paymentRequest.customerName,
          email: paymentRequest.customerEmail,
          contact: paymentRequest.customerPhone || ''
        },
        notes: {
          address: paymentRequest.address ? JSON.stringify(paymentRequest.address) : ''
        },
        theme: {
          color: '#059669'
        },
        handler: async (response: any) => {
          // This will be handled by the frontend component
          return response;
        }
      };

      return {
        success: true,
        orderId: order.orderId,
        amount: order.amount
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  // Get payment details
  static async getPaymentDetails(paymentId: string) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  // Refund payment
  static async refundPayment(paymentId: string, amount?: number) {
    try {
      const refundOptions: any = {
        payment_id: paymentId
      };
      
      if (amount) {
        refundOptions.amount = amount * 100; // Convert to paise
      }

      const refund = await razorpay.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }
}

// Frontend payment handler (for client-side)
export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpay = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.success', (response: any) => {
      resolve(response);
    });
    rzp.on('payment.error', (error: any) => {
      reject(error);
    });
    rzp.open();
  });
};
