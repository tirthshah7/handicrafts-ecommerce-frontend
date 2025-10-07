import { useState, useEffect } from 'react';
import { Header } from './components/header';
import HeroSection from './components/hero-section-production';
import { FeaturedCategories } from './components/featured-categories';
import { ProductShowcase } from './components/product-showcase';
import { Footer } from './components/footer';
import { ProductPage } from './components/product-page';
import { CollectionPage } from './components/collection-page';
import { CategoriesPage } from './components/categories-page';
import { PremiumCollectionPage } from './components/premium-collection-page';
import { NoveltyProductsPage } from './components/novelty-products-page';
import { SearchModal } from './components/search-modal';
import { WishlistSidebar, WishlistItem } from './components/wishlist-sidebar';
import { CartPage } from './components/cart-page';
import { AllProductsPage } from './components/all-products-page';
import { AuthPage } from './components/auth-page';
import { AboutUsPage } from './components/about-us-page';
import { ContactUsPage } from './components/contact-us-page';
import { PrivacyPolicyPage } from './components/privacy-policy-page';
import { TermsOfServicePage } from './components/terms-of-service-page';
import { CookiePolicyPage } from './components/cookie-policy-page';
import AdminDashboardPage from './components/admin-dashboard-production';
import { AdminLoginPage } from './components/admin-login-page';
import { OrderTrackingPage } from './components/order-tracking-page';
import { UserProfilePage } from './components/user-profile-page';
import { ReturnPolicyPage } from './components/return-policy-page';
import { FAQPage } from './components/faq-page';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { BackendProvider } from './components/backend-provider';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'product' | 'jewellery' | 'mandala' | 'categories' | 'premium' | 'novelty' | 'cart' | 'allProducts' | 'signIn' | 'signUp' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'admin' | 'adminLogin' | 'orderTracking' | 'userProfile' | 'returnPolicy' | 'faq';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  isPremium?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  stock?: number;
  lowStockThreshold?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

import { useBackend } from './components/backend-provider';
import { api } from './utils/api';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  
  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    email: 'info@bhavyakavyas.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    businessHours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    instagram: 'https://instagram.com/bhavyakavyas',
    facebook: 'https://facebook.com/bhavyakavyas',
    twitter: 'https://twitter.com/bhavyakavyas'
  });

  // Use backend provider for data management
  const {
    cartItems,
    wishlistItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getTotalCartItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    adminSignIn
  } = useBackend();

  // Handle order placement
  const handleOrderPlaced = (orderData: any) => {
    console.log('Order placed successfully:', orderData);
    // Here you can add additional logic like:
    // - Send order confirmation email
    // - Update inventory
    // - Log order to database
    // - Send notification to admin
  };

  // Check admin authentication on component mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('bhavyakavya-admin-auth');
    setIsAdminAuthenticated(adminAuth === 'true');
  }, []);

  // Load contact information on component mount and listen for updates
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        // Try backend first
        try {
          const response = await api.getContactInfo();
          if (response.success && response.data.contactInfo) {
            setContactInfo(response.data.contactInfo);
            // Also save to localStorage for offline mode
            localStorage.setItem('contact_info', JSON.stringify(response.data.contactInfo));
            return;
          }
        } catch (backendError) {
          console.log('Backend contact info load failed, checking local storage:', backendError);
        }

        // Fallback to localStorage
        const localContactInfo = localStorage.getItem('contact_info');
        if (localContactInfo) {
          try {
            setContactInfo(JSON.parse(localContactInfo));
          } catch (parseError) {
            console.error('Failed to parse local contact info:', parseError);
          }
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
      }
    };

    loadContactInfo();

    // Listen for contact info updates from admin dashboard
    const handleContactInfoUpdate = (event: CustomEvent) => {
      setContactInfo(event.detail);
    };

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener);
    window.addEventListener('storage', (e) => {
      if (e.key === 'contact_info' && e.newValue) {
        try {
          setContactInfo(JSON.parse(e.newValue));
        } catch (parseError) {
          console.error('Failed to parse contact info from storage event:', parseError);
        }
      }
    });

    return () => {
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdate as EventListener);
    };
  }, []);

  const navigateToHome = () => setCurrentPage('home');
  const navigateToProduct = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    }
    setCurrentPage('product');
  };
  const navigateToJewellery = () => setCurrentPage('jewellery');
  const navigateToMandala = () => setCurrentPage('mandala');
  const navigateToCategories = () => setCurrentPage('categories');
  const navigateToPremium = () => setCurrentPage('premium');
  const navigateToNovelty = () => setCurrentPage('novelty');
  const navigateToCart = () => setCurrentPage('cart');
  const navigateToAllProducts = () => setCurrentPage('allProducts');
  const navigateToOrderTracking = () => setCurrentPage('orderTracking');
  const navigateToUserProfile = () => setCurrentPage('userProfile');
  const navigateToReturnPolicy = () => setCurrentPage('returnPolicy');
  const navigateToFAQ = () => setCurrentPage('faq');
  const navigateToSignIn = () => setCurrentPage('signIn');
  const navigateToSignUp = () => setCurrentPage('signUp');
  const navigateToAbout = () => setCurrentPage('about');
  const navigateToContact = () => setCurrentPage('contact');
  const navigateToPrivacy = () => setCurrentPage('privacy');
  const navigateToTerms = () => setCurrentPage('terms');
  const navigateToCookies = () => setCurrentPage('cookies');
  const navigateToAdmin = () => {
    // Check if admin is authenticated
    if (isAdminAuthenticated) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('adminLogin');
    }
  };
  
  const handleAdminLogin = async (email: string, password: string) => {
    const success = await adminSignIn(email, password);
    if (success) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('bhavyakavya-admin-auth', 'true');
      setCurrentPage('admin');
    }
    return success;
  };
  
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('bhavyakavya-admin-auth');
    setCurrentPage('home');
  };
  
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  
  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  // Cart and wishlist methods are now provided by the backend provider

  if (currentPage === 'product') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <ProductPage 
          onBackToHome={navigateToHome} 
          product={selectedProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'jewellery') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <CollectionPage 
          category="Mahima's Jewellery" 
          onBackToHome={navigateToHome} 
          onProductClick={navigateToProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'mandala') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <CollectionPage 
          category="Mahima's Mandala Art" 
          onBackToHome={navigateToHome} 
          onProductClick={navigateToProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'categories') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <CategoriesPage 
          onBackToHome={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'premium') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <PremiumCollectionPage 
          onBackToHome={navigateToHome}
          onProductClick={navigateToProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'novelty') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <NoveltyProductsPage 
          onBackToHome={navigateToHome}
          onProductClick={navigateToProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'cart') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <CartPage 
          onBackToHome={navigateToHome}
          cartItems={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart}
          onOrderPlaced={handleOrderPlaced}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'allProducts') {
    return (
      <>
        <Header 
          onHomeClick={navigateToHome}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onProductClick={navigateToProduct}
          onSearchClick={openSearch}
          onWishlistClick={openWishlist}
          onCartClick={navigateToCart}
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onAdminClick={navigateToAdmin}
          onOrderTrackingClick={navigateToOrderTracking}
          onUserProfileClick={navigateToUserProfile}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
          wishlistCount={wishlistItems.length}
          cartCount={getTotalCartItems()}
        />
        <AllProductsPage 
          onBackToHome={navigateToHome}
          onProductClick={navigateToProduct}
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
        />
        <Footer 
          onSignInClick={navigateToSignIn}
          onSignUpClick={navigateToSignUp}
          onHomeClick={navigateToHome}
          onAboutClick={navigateToAbout}
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onNoveltyClick={navigateToNovelty}
          onContactClick={navigateToContact}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onCookiesClick={navigateToCookies}
        />
        <ThemeToggle />
        <Toaster />
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onProductClick={() => {
            closeSearch();
            navigateToProduct();
          }}
          onJewelleryClick={() => {
            closeSearch();
            navigateToJewellery();
          }}
          onMandalaClick={() => {
            closeSearch();
            navigateToMandala();
          }}
          onNoveltyClick={() => {
            closeSearch();
            navigateToNovelty();
          }}
        />
        <WishlistSidebar
          isOpen={isWishlistOpen}
          onClose={closeWishlist}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={removeFromWishlist}
          onProductClick={() => {
            closeWishlist();
            navigateToProduct();
          }}
        />
      </>
    );
  }

  if (currentPage === 'signIn') {
    return (
      <>
        <AuthPage 
          onBackToHome={navigateToHome}
          initialTab="signin"
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'signUp') {
    return (
      <>
        <AuthPage 
          onBackToHome={navigateToHome}
          initialTab="signup"
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'about') {
    return (
      <>
        <AboutUsPage onBackToHome={navigateToHome} />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'contact') {
    return (
      <>
        <ContactUsPage onBackToHome={navigateToHome} />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <>
        <PrivacyPolicyPage onBackToHome={navigateToHome} />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'terms') {
    return (
      <>
        <TermsOfServicePage onBackToHome={navigateToHome} />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'cookies') {
    return (
      <>
        <CookiePolicyPage onBackToHome={navigateToHome} />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'adminLogin') {
    return (
      <>
        <AdminLoginPage 
          onBackToHome={navigateToHome}
          onAdminLogin={handleAdminLogin}
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'admin') {
    return (
      <>
        <AdminDashboardPage />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'orderTracking') {
    return (
      <>
        <OrderTrackingPage 
          onBackToHome={navigateToHome}
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'userProfile') {
    return (
      <>
        <UserProfilePage 
          onBackToHome={navigateToHome}
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'returnPolicy') {
    return (
      <>
        <ReturnPolicyPage 
          onBackToHome={navigateToHome}
          onContactClick={navigateToContact}
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'faq') {
    return (
      <>
        <FAQPage 
          onBackToHome={navigateToHome}
          onContactClick={navigateToContact}
        />
        <ThemeToggle />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onHomeClick={navigateToHome}
        onJewelleryClick={navigateToJewellery}
        onMandalaClick={navigateToMandala}
        onNoveltyClick={navigateToNovelty}
        onProductClick={navigateToProduct}
        onSearchClick={openSearch}
        onWishlistClick={openWishlist}
        onCartClick={navigateToCart}
        onSignInClick={navigateToSignIn}
        onSignUpClick={navigateToSignUp}
        onAdminClick={navigateToAdmin}
        wishlistCount={wishlistItems.length}
        cartCount={getTotalCartItems()}
      />
      <main>
        <HeroSection 
          onCategoriesClick={navigateToCategories}
          onPremiumClick={navigateToPremium}
        />
        <FeaturedCategories 
          onJewelleryClick={navigateToJewellery}
          onMandalaClick={navigateToMandala}
          onCategoriesClick={navigateToCategories}
        />
        <ProductShowcase 
          onProductClick={navigateToProduct} 
          onAddToWishlist={addToWishlist}
          onAddToCart={addToCart}
          isInWishlist={isInWishlist}
          onViewAllProductsClick={navigateToAllProducts}
        />
      </main>
      <Footer 
        onSignInClick={navigateToSignIn}
        onSignUpClick={navigateToSignUp}
        onHomeClick={navigateToHome}
        onAboutClick={navigateToAbout}
        onJewelleryClick={navigateToJewellery}
        onMandalaClick={navigateToMandala}
        onNoveltyClick={navigateToNovelty}
        onContactClick={navigateToContact}
        onPrivacyClick={navigateToPrivacy}
        onTermsClick={navigateToTerms}
        onCookiesClick={navigateToCookies}
        onUserProfileClick={navigateToUserProfile}
          onOrderTrackingClick={navigateToOrderTracking}
          onReturnPolicyClick={navigateToReturnPolicy}
          onFAQClick={navigateToFAQ}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email || ''}
        contactInfo={contactInfo}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onProductClick={() => {
          closeSearch();
          navigateToProduct();
        }}
        onJewelleryClick={() => {
          closeSearch();
          navigateToJewellery();
        }}
        onMandalaClick={() => {
          closeSearch();
          navigateToMandala();
        }}
        onNoveltyClick={() => {
          closeSearch();
          navigateToNovelty();
        }}
      />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={closeWishlist}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={removeFromWishlist}
        onProductClick={() => {
          closeWishlist();
          navigateToProduct();
        }}
      />
      <ThemeToggle />
      <CartDebug />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bhavyakavya-ui-theme">
      <BackendProvider>
        <AppContent />
      </BackendProvider>
    </ThemeProvider>
  );
}