import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Star, Users, Palette, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

const categories = [
  {
    id: 'jewellery',
    name: "Mahima's Jewellery",
    description: "Exquisite handcrafted jewelry pieces that blend traditional Indian artistry with contemporary elegance.",
    image: "https://images.unsplash.com/photo-1721807644561-9efcabee5c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwY29sbGVjdGlvbiUyMHNob3djYXNlfGVufDF8fHx8MTc1OTIzNTIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 47,
    averageRating: 4.8,
    priceRange: "₹1,999 - ₹25,999",
    isPremium: true,
    isPopular: true,
    icon: Sparkles,
    tags: ["Traditional", "Kundan", "Temple Jewelry", "Bridal"]
  },
  {
    id: 'mandala',
    name: "Mahima's Mandala Art",
    description: "Sacred geometric patterns and spiritual art forms that bring peace and harmony to your space.",
    image: "https://images.unsplash.com/photo-1749573642956-e894c165f55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwY29sbGVjdGlvbiUyMGhhbmRjcmFmdGVkfGVufDF8fHx8MTc1OTIzNTI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 23,
    averageRating: 4.7,
    priceRange: "₹999 - ₹8,999",
    isPremium: true,
    isPopular: false,
    icon: Palette,
    tags: ["Sacred Art", "Wall Decor", "Canvas", "Spiritual"]
  },
  {
    id: 'novelty',
    name: "Novelty Products",
    description: "Unique and creative handicrafts perfect for gifts, home decor, and everyday use.",
    image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3ZlbHR5JTIwaXRlbXMlMjBoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NTkyMzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    productCount: 156,
    averageRating: 4.5,
    priceRange: "₹299 - ₹4,999",
    isPremium: false,
    isPopular: true,
    icon: Users,
    tags: ["Gifts", "Home Decor", "Accessories", "Affordable"]
  }
];

const stats = [
  { label: "Total Categories", value: "3+" },
  { label: "Premium Collections", value: "2" },
  { label: "Products Available", value: "200+" },
  { label: "Average Rating", value: "4.7★" }
];

interface CategoriesPageProps {
  onBackToHome: () => void;
  onJewelleryClick: () => void;
  onMandalaClick: () => void;
}

export function CategoriesPage({ onBackToHome, onJewelleryClick, onMandalaClick }: CategoriesPageProps) {
  const handleCategoryClick = (categoryId: string) => {
    switch (categoryId) {
      case 'jewellery':
        onJewelleryClick();
        break;
      case 'mandala':
        onMandalaClick();
        break;
      case 'novelty':
        // For now, we'll just show an alert - can be implemented later
        alert('Novelty Products collection coming soon!');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button onClick={onBackToHome} className="hover:text-primary transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-foreground">Categories</span>
        </div>
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-card border-b"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 mx-auto"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl text-foreground mb-6">
                Explore Our Collections
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Discover the finest selection of handcrafted treasures, from premium jewelry collections 
                to spiritual art forms, each piece telling a story of traditional Indian craftsmanship.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {category.isPremium && (
                        <Badge className="bg-primary text-primary-foreground">Premium</Badge>
                      )}
                      {category.isPopular && (
                        <Badge variant="secondary" className="bg-green-500 text-white">Popular</Badge>
                      )}
                    </div>

                    {/* Category Icon */}
                    <div className="absolute top-4 right-4 p-3 bg-background/80 rounded-full">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Products</span>
                          <span className="text-foreground">{category.productCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-foreground">{category.averageRating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price Range</span>
                          <span className="text-foreground">{category.priceRange}</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-6">
                        {category.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full group/btn"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        Explore Collection
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-card border-t"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl text-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're constantly adding new collections and products. Contact us for custom orders 
            or to suggest new categories you'd like to see.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}