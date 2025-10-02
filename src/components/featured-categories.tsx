import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: "Mahima's Jewellery",
    description: "Exquisite handcrafted jewelry pieces that blend traditional Indian artistry with contemporary elegance.",
    image: "https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMGpld2VscnklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyMzM5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    premium: true
  },
  {
    name: "Mahima's Mandala Art",
    description: "Sacred geometric patterns and spiritual art forms that bring peace and harmony to your space.",
    image: "https://images.unsplash.com/photo-1714687980784-c365a399d42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwaGFuZGljcmFmdHMlMjBnb2xkZW58ZW58MXx8fHwxNzU5MjMzOTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    premium: true
  }
];

interface FeaturedCategoriesProps {
  onJewelleryClick?: () => void;
  onMandalaClick?: () => void;
  onCategoriesClick?: () => void;
}

export function FeaturedCategories({ onJewelleryClick, onMandalaClick, onCategoriesClick }: FeaturedCategoriesProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our signature collections curated by master artisans, featuring premium handcrafted pieces that embody the essence of Indian heritage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => {
                if (category.name === "Mahima's Jewellery") {
                  onJewelleryClick?.();
                } else if (category.name === "Mahima's Mandala Art") {
                  onMandalaClick?.();
                }
              }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {category.premium && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      Premium Collection
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button 
                      variant="outline" 
                      className="group/btn hover:bg-primary hover:text-primary-foreground border-primary text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (category.name === "Mahima's Jewellery") {
                          onJewelleryClick?.();
                        } else if (category.name === "Mahima's Mandala Art") {
                          onMandalaClick?.();
                        }
                      }}
                    >
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={onCategoriesClick}
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}