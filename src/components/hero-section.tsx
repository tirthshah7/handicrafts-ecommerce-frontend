import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import heroJewelryImage from '../assets/hero-jewelry.webp';

interface HeroSectionProps {
  onCategoriesClick?: () => void;
  onPremiumClick?: () => void;
}

interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  heroImageAlt: string;
}

export function HeroSection({ onCategoriesClick, onPremiumClick }: HeroSectionProps) {
  // Default hero content with your jewelry image
  const defaultHeroContent: HeroContent = {
    title: "Discover India's",
    subtitle: "Finest Handicrafts",
    tagline: "Crafting a Poem of Splendid Living",
    description: "From premium handcrafted jewelry to exquisite mandala art, explore our curated collection of authentic Indian handicrafts that celebrate tradition and artistry.",
    ctaPrimary: "Shop Premium Collection",
    ctaSecondary: "Explore Categories",
    heroImage: heroJewelryImage,
    heroImageAlt: "Traditional Indian Jewelry Set - Handcrafted Necklace, Earrings, and Maang Tikka"
  };

  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [debugInfo, setDebugInfo] = useState<string>('Using default jewelry image');

  // SIMPLIFIED: Just use the default content, no complex loading logic
  useEffect(() => {
    console.log('🎯 Hero Section: Using default jewelry image');
    setHeroContent(defaultHeroContent);
    setDebugInfo('Using default jewelry image');
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-background to-secondary py-20 overflow-hidden">
      {/* Debug indicator - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black text-white px-3 py-1 rounded text-xs z-50">
          Hero: {debugInfo}
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl leading-tight text-foreground">
                {heroContent.title}
                <span className="text-primary block">{heroContent.subtitle}</span>
              </h1>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl text-primary/80 italic">
                {heroContent.tagline}
              </p>
              <p className="text-lg text-muted-foreground max-w-lg">
                {heroContent.description}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={onPremiumClick}>
                  {heroContent.ctaPrimary}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" onClick={onCategoriesClick}>
                  {heroContent.ctaSecondary}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl transform rotate-6"
                animate={{ rotate: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              <ImageWithFallback
                src={heroContent.heroImage}
                alt={heroContent.heroImageAlt}
                className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-6 -right-6 bg-card p-4 rounded-full shadow-lg"
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="text-primary text-sm">✨ Premium Quality</div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-full shadow-lg"
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="text-primary text-sm">🎨 Handcrafted</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}