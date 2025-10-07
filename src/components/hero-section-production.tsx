import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

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

const defaultHeroContent: HeroContent = {
  title: "Discover India's Artistic Heritage",
  subtitle: "Handcrafted with Love, Delivered with Care",
  tagline: "Experience the timeless beauty of traditional Indian handicrafts.",
  description: "BhavyaKavya's brings you an exquisite collection of handcrafted jewelry, mandala art, and novelty products, each piece telling a story of rich cultural heritage and skilled artistry.",
  ctaPrimary: "Shop Now",
  ctaSecondary: "Explore Categories",
  heroImage: "https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080",
  heroImageAlt: "Indian Traditional Handicrafts"
};

interface HeroSectionProps {
  onShopNowClick: () => void;
  onExploreClick: () => void;
}

export default function HeroSection({ onShopNowClick, onExploreClick }: HeroSectionProps) {
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [isLoading, setIsLoading] = useState(true);

  // Load hero content from backend
  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const response = await fetch('https://bqeilonnsefbdoyiirsc.supabase.co/functions/v1/make-server-33f75b66/hero-content', {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZWlsb25uc2VmYmRveWlpcnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjAzNDUsImV4cCI6MjA3NDk5NjM0NX0.I_0N3jfa7VWn8W8P-pHd-U9HNObzGuLqgzRVsPXzt00`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.content) {
            setHeroContent(data.content);
            console.log('Loaded hero content from backend:', data.content);
          }
        } else {
          console.log('Backend unavailable, using default content');
        }
      } catch (error) {
        console.error('Failed to load hero content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
          <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                {heroContent.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-amber-600 font-semibold"
              >
                {heroContent.subtitle}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                {heroContent.description}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onShopNowClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {heroContent.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={onExploreClick}
                variant="outline"
                size="lg"
                className="border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {heroContent.ctaSecondary}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-6 pt-8"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-5 w-5 text-amber-500 fill-current" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Free Shipping</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroContent.heroImage}
                alt={heroContent.heroImageAlt}
                className="w-full h-[500px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg"
            >
              <Star className="h-6 w-6 text-amber-500 fill-current" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg"
            >
              <Shield className="h-6 w-6 text-amber-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
