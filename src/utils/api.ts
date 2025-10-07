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

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, get text and try to parse
        const text = await response.text();
        console.warn('Non-JSON response received:', text);
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          return {
            success: false,
            error: `Invalid response format: ${text.substring(0, 100)}...`,
          };
        }
      }

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

    if (response.success && response.data && typeof response.data === 'object' && response.data !== null) {
      const data = response.data as any;
      if (data.session && data.session.access_token) {
        this.setAccessToken(data.session.access_token);
        // Store token in localStorage for persistence
        localStorage.setItem('bhavyakavya-access-token', data.session.access_token);
        localStorage.setItem('bhavyakavya-user', JSON.stringify(data.user));
      }
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

  // Image management methods
  async uploadImage(imageData: string, filename: string, type: string, productId?: string) {
    console.log('API uploadImage called:', {
      filename,
      type,
      productId,
      imageDataLength: imageData.length,
      apiUrl: `${API_BASE_URL}/images/upload`
    });

    try {
      const result = await this.makeRequest<{ imageId: string; imageUrl: string; metadata: any }>('/images/upload', {
        method: 'POST',
        body: JSON.stringify({ imageData, filename, type, productId }),
      });
      
      console.log('API uploadImage result:', result);
      return result;
    } catch (error) {
      console.error('API uploadImage error:', error);
      throw error;
    }
  }

  async getImage(imageId: string) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
      };

      const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      console.error('Error fetching image:', error);
      return {
        success: false,
        error: 'Failed to fetch image',
      };
    }
  }

  async getProductImages(productId: string) {
    return this.makeRequest<{ images: any[] }>(`/images/product/${productId}`);
  }

  async deleteImage(imageId: string) {
    return this.makeRequest<{ message: string }>(`/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  async setMainImage(imageId: string, productId: string) {
    return this.makeRequest<{ message: string }>(`/images/${imageId}/set-main`, {
      method: 'PUT',
      body: JSON.stringify({ productId }),
    });
  }

  async getAllImages() {
    return this.makeRequest<{ images: any[]; total: number }>('/admin/images');
  }

  // Hero content methods
  async getHeroContent() {
    return this.makeRequest<{ content: any }>('/hero-content');
  }

  async updateHeroContent(content: any) {
    console.log('Updating hero content:', content);
    try {
      const result = await this.makeRequest<{ content: any; message: string }>('/hero-content', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      console.log('Hero content update result:', result);
      return result;
    } catch (error) {
      console.error('Hero content update error:', error);
      throw error;
    }
  }

  // Contact information methods
  async getContactInfo() {
    return this.makeRequest<{ contactInfo: any }>('/contact-info');
  }

  async updateContactInfo(contactInfo: any) {
    console.log('Updating contact info:', contactInfo);
    try {
      const result = await this.makeRequest<{ contactInfo: any; message: string }>('/contact-info', {
        method: 'PUT',
        body: JSON.stringify(contactInfo),
      });
      console.log('Contact info update result:', result);
      return result;
    } catch (error) {
      console.error('Contact info update error:', error);
      throw error;
    }
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