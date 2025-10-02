import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api, authHelpers } from '../utils/api';
import type { Product, CartItem } from '../App';
import { toast } from 'sonner@2.0.3';
import { sampleProducts } from '../data/sampleProducts';

interface User {
  id: string;
  email: string;
  name: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  isPremium?: boolean;
  inStock?: boolean;
}

interface BackendContextType {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Products
  products: Product[];
  loadProducts: (category?: string) => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;

  // Cart
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalCartItems: () => number;
  syncCart: () => Promise<void>;

  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  syncWishlist: () => Promise<void>;

  // Authentication methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;

  // Admin methods
  adminSignIn: (email: string, password: string) => Promise<boolean>;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export function useBackend() {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}

interface BackendProviderProps {
  children: ReactNode;
}

export function BackendProvider({ children }: BackendProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const isAuthenticated = !!user;

  // Load data from localStorage (fallback for non-authenticated users)
  const loadLocalStorageData = useCallback(() => {
    try {
      const savedCart = localStorage.getItem('bhavyakavya-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem('bhavyakavya-wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  }, []);

  // Save to localStorage (backup for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('bhavyakavya-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('bhavyakavya-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  // Cart methods
  const syncCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.getCart();
      if (response.success && response.data?.cart?.items) {
        setCartItems(response.data.cart.items);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }, [isAuthenticated]);

  // Wishlist methods
  const syncWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.getWishlist();
      if (response.success && response.data?.wishlist?.items) {
        setWishlistItems(response.data.wishlist.items);
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    }
  }, [isAuthenticated]);

  // Migrate localStorage data to backend when user signs in
  const migrateLocalDataToBackend = useCallback(async () => {
    try {
      // Migrate cart items
      const localCart = localStorage.getItem('bhavyakavya-cart');
      if (localCart) {
        const localCartItems = JSON.parse(localCart);
        for (const item of localCartItems) {
          await api.addToCart(item.id, item.quantity);
        }
        localStorage.removeItem('bhavyakavya-cart');
      }

      // Migrate wishlist items
      const localWishlist = localStorage.getItem('bhavyakavya-wishlist');
      if (localWishlist) {
        const localWishlistItems = JSON.parse(localWishlist);
        for (const item of localWishlistItems) {
          await api.addToWishlist(item.id);
        }
        localStorage.removeItem('bhavyakavya-wishlist');
      }

      // Sync the migrated data
      await syncCart();
      await syncWishlist();
    } catch (error) {
      console.error('Error migrating local data:', error);
    }
  }, [syncCart, syncWishlist]);

  // Authentication methods
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.signIn(email, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        // Migrate localStorage data to backend
        await migrateLocalDataToBackend();
        toast.success('Successfully signed in!');
        return true;
      } else {
        toast.error(response.error || 'Sign in failed');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed');
      return false;
    }
  }, [migrateLocalDataToBackend]);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await api.signUp(email, password, name);
      if (response.success) {
        toast.success('Account created successfully! Please sign in.');
        return true;
      } else {
        toast.error(response.error || 'Sign up failed');
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Sign up failed');
      return false;
    }
  }, []);

  const adminSignIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.adminSignIn(email, password);
      if (response.success) {
        toast.success('Admin signed in successfully!');
        return true;
      } else {
        toast.error(response.error || 'Admin sign in failed');
        return false;
      }
    } catch (error) {
      console.error('Admin sign in error:', error);
      toast.error('Admin sign in failed');
      return false;
    }
  }, []);

  const signOut = useCallback(() => {
    authHelpers.logout();
    setUser(null);
    setCartItems([]);
    setWishlistItems([]);
    toast.success('Successfully signed out!');
  }, []);

  // Product methods
  const loadProducts = useCallback(async (category?: string) => {
    try {
      const response = await api.getProducts({ category, limit: 100 });
      
      if (response.success && response.data?.products) {
        // Filter out any null/undefined products
        const validProducts = response.data.products.filter(product => 
          product && 
          typeof product === 'object' && 
          product.id && 
          product.name && 
          product.image
        );
        
        if (validProducts.length > 0) {
          setProducts(validProducts);
          return;
        }
      }
      
      // Fallback to sample products if API fails or returns no valid products
      console.warn('API failed or returned no products, using fallback data');
      let productsToShow = sampleProducts;
      
      if (category) {
        productsToShow = sampleProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      setProducts(productsToShow);
    } catch (error) {
      console.error('Error loading products:', error);
      // Use fallback data on error
      let productsToShow = sampleProducts;
      
      if (category) {
        productsToShow = sampleProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      setProducts(productsToShow);
    }
  }, []);

  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await api.getProduct(id);
      if (response.success && response.data?.product) {
        return response.data.product;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    
    // Fallback to sample products
    const fallbackProduct = sampleProducts.find(product => product.id === id);
    return fallbackProduct || null;
  }, []);

  const addToCart = useCallback(async (item: CartItem) => {
    if (isAuthenticated) {
      try {
        const response = await api.addToCart(item.id, item.quantity);
        if (response.success) {
          await syncCart();
          toast.success(`Added ${item.name} to cart`);
        } else {
          toast.error(response.error || 'Failed to add item to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add item to cart');
      }
    } else {
      // Local storage fallback
      setCartItems(prev => {
        const existingItem = prev.find(existing => existing.id === item.id);
        if (existingItem) {
          toast.success(`Updated ${item.name} quantity in cart`);
          return prev.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
        }
        toast.success(`Added ${item.name} to cart`);
        return [...prev, item];
      });
    }
  }, [isAuthenticated, syncCart]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        const response = await api.updateCartItem(productId, quantity);
        if (response.success) {
          await syncCart();
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      // Local storage fallback
      if (quantity <= 0) {
        setCartItems(prev => prev.filter(item => item.id !== productId));
      } else {
        setCartItems(prev =>
          prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    }
  }, [isAuthenticated, syncCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    await updateCartQuantity(productId, 0);
  }, [updateCartQuantity]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await api.clearCart();
        if (response.success) {
          setCartItems([]);
          toast.success('Cart cleared successfully');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      setCartItems([]);
      toast.success('Cart cleared successfully');
    }
  }, [isAuthenticated]);

  const getTotalCartItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    if (isAuthenticated) {
      try {
        const response = await api.addToWishlist(item.id);
        if (response.success) {
          await syncWishlist();
          toast.success(`Added ${item.name} to wishlist`);
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      // Local storage fallback
      setWishlistItems(prev => {
        const exists = prev.find(existing => existing.id === item.id);
        if (!exists) {
          toast.success(`Added ${item.name} to wishlist`);
          return [...prev, item];
        }
        return prev;
      });
    }
  }, [isAuthenticated, syncWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const response = await api.removeFromWishlist(productId);
        if (response.success) {
          await syncWishlist();
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Local storage fallback
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    }
  }, [isAuthenticated, syncWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = authHelpers.getCurrentUser();
    if (savedUser && authHelpers.isAuthenticated()) {
      setUser(savedUser);
      // Sync cart and wishlist for authenticated users
      syncCart();
      syncWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalStorageData();
    }
    setIsLoading(false);
  }, [syncCart, syncWishlist, loadLocalStorageData]);

  // Load products on initialization
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const contextValue: BackendContextType = {
    // Authentication state
    user,
    isAuthenticated,
    isLoading,

    // Products
    products,
    loadProducts,
    getProduct,

    // Cart
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getTotalCartItems,
    syncCart,

    // Wishlist
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    syncWishlist,

    // Authentication methods
    signIn,
    signUp,
    signOut,
    adminSignIn,
  };

  return (
    <BackendContext.Provider value={contextValue}>
      {children}
    </BackendContext.Provider>
  );
}