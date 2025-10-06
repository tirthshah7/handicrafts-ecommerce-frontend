import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

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
  // Default hero content
  const defaultHeroContent: HeroContent = {
    title: "Discover India's",
    subtitle: "Finest Handicrafts",
    tagline: "Crafting a Poem of Splendid Living",
    description: "From premium handcrafted jewelry to exquisite mandala art, explore our curated collection of authentic Indian handicrafts that celebrate tradition and artistry.",
    ctaPrimary: "Shop Premium Collection",
    ctaSecondary: "Explore Categories",
    heroImage: "https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080",
    heroImageAlt: "Indian Traditional Handicrafts"
  };

  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [debugInfo, setDebugInfo] = useState<string>('Loading...');

  // Load hero content from backend first, then fallback to localStorage
  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        // Try backend first (for production consistency)
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
              setDebugInfo('Loaded from backend');
              console.log('Loaded hero content from backend:', data.content);
              // Save to localStorage for offline access
              localStorage.setItem('hero_content', JSON.stringify(data.content));
              return;
            }
          }
        } catch (backendError) {
          console.log('Backend load failed, trying localStorage:', backendError);
        }

        // Fallback to localStorage if backend fails
        const savedHeroContent = localStorage.getItem('hero_content');
        if (savedHeroContent) {
          try {
            const parsedContent = JSON.parse(savedHeroContent);
            setHeroContent(parsedContent);
            setDebugInfo('Loaded from localStorage (backend failed)');
            console.log('Loaded hero content from localStorage:', parsedContent);
            return;
          } catch (parseError) {
            console.error('Failed to parse localStorage content:', parseError);
          }
        }

        // Final fallback to default content
        setDebugInfo('Using default content (no data found)');
        console.log('Using default hero content');
      } catch (error) {
        console.error('Failed to load hero content:', error);
        setDebugInfo('Error loading content');
      }
    };

    // Helper function to sync with backend (non-blocking)
    const syncWithBackend = async (content: HeroContent) => {
      try {
        await fetch('https://bqeilonnsefbdoyiirsc.supabase.co/functions/v1/make-server-33f75b66/hero-content', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZWlsb25uc2VmYmRveWlpcnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjAzNDUsImV4cCI6MjA3NDk5NjM0NX0.I_0N3jfa7VWn8W8P-pHd-U9HNObzGuLqgzRVsPXzt00`
          },
          body: JSON.stringify(content)
        });
        console.log('Synced hero content with backend');
      } catch (error) {
        console.log('Backend sync failed (non-critical):', error);
      }
    };

    loadHeroContent();
  }, []);

  // Listen for storage changes and custom events to update hero content in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hero_content' && e.newValue) {
        try {
          const parsedContent = JSON.parse(e.newValue);
          setHeroContent(parsedContent);
          console.log('Hero content updated from storage change:', parsedContent);
        } catch (error) {
          console.error('Failed to parse updated hero content:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail) {
        setHeroContent(e.detail);
        console.log('Hero content updated from custom event:', e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('heroContentUpdated', handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('heroContentUpdated', handleCustomEvent as EventListener);
    };
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