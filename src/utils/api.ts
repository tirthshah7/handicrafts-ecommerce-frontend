import { projectId, publicAnonKey } from './supabase/info';
import type { Product, CartItem } from '../App';
import type { CreateOrderRequest, Order } from '../services/orderService';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-33f75b66`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error (${response.status}):`, data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, name: string) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signIn(email: string, password: string) {
    const response = await this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.session?.access_token) {
      this.setAccessToken(response.data.session.access_token);
      // Store token in localStorage for persistence
      localStorage.setItem('bhavyakavya-access-token', response.data.session.access_token);
      localStorage.setItem('bhavyakavya-user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async adminSignIn(email: string, password: string) {
    return this.makeRequest('/auth/admin-signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Product methods
  async getProducts(params: { 
    category?: string; 
    limit?: number; 
    offset?: number; 
  } = {}) {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const endpoint = `/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.makeRequest<{ products: Product[]; pagination: any }>(endpoint);
  }

  async getProduct(id: string) {
    return this.makeRequest<{ product: Product }>(`/products/${id}`);
  }

  // Cart methods
  async getCart() {
    return this.makeRequest<{ cart: { items: CartItem[] } }>('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.makeRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.makeRequest('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async clearCart() {
    return this.makeRequest('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Wishlist methods
  async getWishlist() {
    return this.makeRequest<{ wishlist: { items: any[] } }>('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.makeRequest('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string) {
    return this.makeRequest(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return this.makeRequest<{ categories: any[] }>('/categories');
  }

  // Admin methods
  async createProduct(productData: Partial<Product>) {
    return this.makeRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    return this.makeRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.makeRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getAnalytics() {
    return this.makeRequest<{ analytics: any }>('/admin/analytics');
  }

  // Order methods
  async createOrder(orderData: CreateOrderRequest) {
    return this.makeRequest<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(orderId: string) {
    return this.makeRequest<{ order: Order }>(`/orders/${orderId}`);
  }

  async getOrdersByCustomer(email: string) {
    return this.makeRequest<{ orders: Order[] }>(`/orders/customer/${email}`);
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return this.makeRequest<{ order: Order }>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getAllOrders() {
    return this.makeRequest<{ orders: Order[] }>('/admin/orders');
  }

  // Inventory methods
  async getInventory() {
    return this.makeRequest<{ inventory: any[] }>('/admin/inventory');
  }

  async updateStock(productId: string, stock: number, lowStockThreshold?: number) {
    return this.makeRequest<{ product: any }>(`/admin/inventory/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock, lowStockThreshold }),
    });
  }

  async getLowStockProducts() {
    return this.makeRequest<{ lowStockProducts: any[] }>('/admin/low-stock');
  }

  // Email methods
  async sendEmail(emailData: {
    to: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    attachments?: Array<{
      filename: string;
      content: string;
      contentType: string;
    }>;
  }) {
    return this.makeRequest<{ messageId: string }>('/send-email', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  // Initialize from localStorage
  initialize() {
    const savedToken = localStorage.getItem('bhavyakavya-access-token');
    if (savedToken) {
      this.setAccessToken(savedToken);
    }
  }

  // Clear authentication
  clearAuth() {
    this.setAccessToken(null);
    localStorage.removeItem('bhavyakavya-access-token');
    localStorage.removeItem('bhavyakavya-user');
  }
}

// Create singleton instance
export const api = new ApiClient();

// Initialize on module load
api.initialize();

// Helper functions for common operations
export const authHelpers = {
  getCurrentUser: () => {
    const savedUser = localStorage.getItem('bhavyakavya-user');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('bhavyakavya-access-token');
  },

  logout: () => {
    api.clearAuth();
  }
};