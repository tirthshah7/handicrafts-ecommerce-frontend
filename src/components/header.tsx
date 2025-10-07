import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Heart, LogIn, UserPlus, Settings, LogOut, Package } from 'lucide-react';
import { useBackend } from './backend-provider';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { motion } from 'motion/react';

interface HeaderProps {
  onHomeClick?: () => void;
  onJewelleryClick?: () => void;
  onMandalaClick?: () => void;
  onNoveltyClick?: () => void;
  onProductClick?: () => void;
  onSearchClick?: () => void;
  onWishlistClick?: () => void;
  onCartClick?: () => void;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onAdminClick?: () => void;
  onOrderTrackingClick?: () => void;
  onUserProfileClick?: () => void;
  onReturnPolicyClick?: () => void;
  onFAQClick?: () => void;
  wishlistCount?: number;
  cartCount?: number;
}

export function Header({ 
  onHomeClick, 
  onJewelleryClick, 
  onMandalaClick, 
  onNoveltyClick, 
  onProductClick, 
  onSearchClick, 
  onWishlistClick, 
  onCartClick,
  onSignInClick,
  onSignUpClick,
  onAdminClick,
  onOrderTrackingClick,
  onUserProfileClick,
  onReturnPolicyClick,
  onFAQClick,
  wishlistCount = 0,
  cartCount = 0
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useBackend();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="cursor-pointer" onClick={onHomeClick}>
              <h1 className="text-2xl text-primary hover:text-primary/80 transition-colors">BhavyaKavya's</h1>
              <p className="text-xs text-muted-foreground hidden sm:block mt-1">Crafting a Poem of Splendid Living</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <motion.button
              onClick={onJewelleryClick}
              className="text-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Mahima's Jewellery
            </motion.button>
            <motion.button
              onClick={onMandalaClick}
              className="text-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Mahima's Mandala Art
            </motion.button>
            <motion.button
              onClick={onNoveltyClick}
              className="text-foreground hover:text-primary transition-colors duration-200 bg-transparent border-none cursor-pointer"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Novelty Products
            </motion.button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onSearchClick}
                className="hover:bg-secondary transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onWishlistClick}
                className="relative hover:bg-secondary transition-colors"
              >
                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-primary text-primary' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium text-foreground border-b">
                        Welcome, {user?.name || 'User'}!
                      </div>
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={onSignInClick} className="cursor-pointer">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onSignUpClick} className="cursor-pointer">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAuthenticated && (
                    <>
                      <DropdownMenuItem onClick={onUserProfileClick} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onOrderTrackingClick} className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Track Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={onAdminClick} className="cursor-pointer border-t mt-1 pt-1">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card shadow-lg rounded-lg mt-2">
              <button
                onClick={() => {
                  onJewelleryClick?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Mahima's Jewellery
              </button>
              <button
                onClick={() => {
                  onMandalaClick?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Mahima's Mandala Art
              </button>
              <button
                onClick={() => {
                  onNoveltyClick?.();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Novelty Products
              </button>
              <div className="flex justify-center space-x-4 pt-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    onSearchClick?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    onWishlistClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="relative"
                >
                  <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-primary text-primary' : ''}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => {
                    onCartClick?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => {
                        onSignInClick?.();
                        setIsMenuOpen(false);
                      }} 
                      className="cursor-pointer"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        onSignUpClick?.();
                        setIsMenuOpen(false);
                      }} 
                      className="cursor-pointer"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        onAdminClick?.();
                        setIsMenuOpen(false);
                      }} 
                      className="cursor-pointer border-t mt-1 pt-1"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}