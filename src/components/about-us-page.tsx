import { motion } from 'motion/react';
import { ArrowLeft, Heart, Sparkles, Users, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutUsPageProps {
  onBackToHome: () => void;
}

export function AboutUsPage({ onBackToHome }: AboutUsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-secondary/50 via-background to-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="ghost" 
              onClick={onBackToHome}
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>
          
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl text-primary mb-6">About BhavyaKavya's</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Crafting a Poem of Splendid Living through Traditional Indian Handicrafts
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Brand Story */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl text-primary mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      BhavyaKavya's was born from a deep passion for preserving and celebrating the rich heritage of Indian handicrafts. 
                      Founded with a vision to bridge the gap between traditional artisans and modern consumers, we curate exquisite 
                      handcrafted pieces that tell stories of generations-old craftsmanship.
                    </p>
                    <p>
                      Our journey began when our founder, inspired by the intricate beauty of traditional Indian art forms, 
                      decided to create a platform where authentic handicrafts could find their rightful place in contemporary homes. 
                      Every piece in our collection is carefully selected to ensure it meets our high standards of quality and authenticity.
                    </p>
                    <p>
                      Today, BhavyaKavya's stands as a testament to the timeless beauty of Indian craftsmanship, featuring specially 
                      curated collections like "Mahima's Jewellery" and "Mahima's Mandala Art" alongside a diverse range of 
                      traditional and contemporary handicrafts.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                    alt="Traditional Indian handicrafts showcase"
                    className="rounded-lg shadow-xl w-full h-80 object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl text-primary text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl text-primary mb-4">Authenticity</h3>
                    <p className="text-muted-foreground">
                      Every piece is sourced directly from skilled artisans, ensuring genuine traditional craftsmanship 
                      and supporting local communities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl text-primary mb-4">Quality</h3>
                    <p className="text-muted-foreground">
                      We maintain the highest standards of quality, carefully curating each product to ensure 
                      it meets our exacting criteria for excellence.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-primary/20 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl text-primary mb-4">Community</h3>
                    <p className="text-muted-foreground">
                      By choosing BhavyaKavya's, you're supporting traditional artisans and helping preserve 
                      India's rich cultural heritage for future generations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              className="bg-gradient-to-r from-secondary/50 to-accent/30 rounded-2xl p-8 md:p-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-3xl text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                To create a world where traditional Indian handicrafts are not just preserved but celebrated, 
                where every home can experience the joy of authentic craftsmanship, and where artisans are 
                empowered to continue their ancestral traditions with pride and prosperity.
              </p>
              <div className="inline-block">
                <div className="text-2xl text-primary italic">
                  "Crafting a Poem of Splendid Living"
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4"></div>
              </div>
            </motion.div>

            {/* Founder's Note Placeholder */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-card border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl text-primary mb-4">A Personal Note</h3>
                <p className="text-muted-foreground italic leading-relaxed">
                  "This space will feature the founder's personal story and journey that led to the creation of BhavyaKavya's. 
                  The inspiring tale of how passion for Indian handicrafts transformed into a mission to connect artisans 
                  with the world will be shared here."
                </p>
                <div className="mt-6 text-sm text-muted-foreground">
                  - Founder's story will be updated soon -
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}