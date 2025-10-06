import { motion } from 'motion/react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, LogIn, UserPlus, User } from 'lucide-react';
import { Button } from './ui/button';

interface FooterProps {
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
  onJewelleryClick?: () => void;
  onMandalaClick?: () => void;
  onNoveltyClick?: () => void;
  onContactClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onCookiesClick?: () => void;
  onUserProfileClick?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export function Footer({ 
  onSignInClick, 
  onSignUpClick, 
  onHomeClick,
  onAboutClick,
  onJewelleryClick,
  onMandalaClick,
  onNoveltyClick,
  onContactClick,
  onPrivacyClick,
  onTermsClick,
  onCookiesClick,
  onUserProfileClick,
  isAuthenticated = false,
  userEmail = ''
}: FooterProps) {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl text-primary">BhavyaKavya's</h3>
              <p className="text-primary/90 text-sm italic mb-2">
                Crafting a Poem of Splendid Living
              </p>
              <p className="text-background/80 leading-relaxed">
                Celebrating India's rich heritage through authentic handicrafts, premium jewelry, and artistic creations that tell a story.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, href: "#" },
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                ].map(({ icon: Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-background/10 hover:bg-primary p-2 rounded-full transition-colors duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg text-primary">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <motion.button
                    onClick={onHomeClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    Home
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={onAboutClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    About Us
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={onJewelleryClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    Mahima's Jewellery
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={onMandalaClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    Mahima's Mandala Art
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={onNoveltyClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    Novelty Products
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={onContactClick}
                    whileHover={{ x: 5 }}
                    className="text-background/80 hover:text-primary transition-colors duration-300 text-left"
                  >
                    Contact Us
                  </motion.button>
                </li>
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg text-primary">Customer Service</h4>
              <ul className="space-y-2">
                {[
                  'My Account',
                  'Order Tracking',
                  'Shipping Info',
                  'Returns & Exchanges',
                  'Size Guide',
                  'Care Instructions',
                  'FAQ'
                ].map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-background/80 hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {isAuthenticated ? (
                <>
                  <h4 className="text-lg text-primary">My Account</h4>
                  <p className="text-background/80 text-sm">
                    Welcome back! Manage your profile and orders.
                  </p>
                  <p className="text-primary/80 text-sm font-medium">
                    {userEmail}
                  </p>
                  
                  <Button 
                    size="sm" 
                    onClick={onUserProfileClick}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Open My Profile
                  </Button>
                </>
              ) : (
                <>
                  <h4 className="text-lg text-primary">Join Us</h4>
                  <p className="text-background/80 text-sm">
                    Create an account to unlock exclusive deals and faster checkout.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={onSignInClick}
                      className="flex-1 sm:flex-none bg-background/10 border-background/20 text-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={onSignUpClick}
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </div>
                </>
              )}

              <div className="space-y-2 pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-background/80 text-sm">info@bhavyakavyas.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-background/80 text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-background/80 text-sm">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-background/20 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-background/80 text-sm">
              © 2024 BhavyaKavya's. All rights reserved. Made with ❤️ in India.
            </div>
            <div className="flex gap-6 text-sm">
              <motion.button
                onClick={onPrivacyClick}
                whileHover={{ y: -1 }}
                className="text-background/80 hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </motion.button>
              <motion.button
                onClick={onTermsClick}
                whileHover={{ y: -1 }}
                className="text-background/80 hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </motion.button>
              <motion.button
                onClick={onCookiesClick}
                whileHover={{ y: -1 }}
                className="text-background/80 hover:text-primary transition-colors duration-300"
              >
                Cookie Policy
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}