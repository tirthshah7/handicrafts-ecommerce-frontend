import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';

interface FAQPageProps {
  onBackToHome: () => void;
  onContactClick?: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'To place an order, simply browse our products, select the items you want, add them to your cart, and proceed to checkout. You can create an account for faster checkout or checkout as a guest.',
    category: 'Ordering'
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets through our secure payment gateway. All payments are processed securely.',
    category: 'Payment'
  },
  {
    id: '3',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days within India. Express shipping options are available for faster delivery. International shipping takes 10-15 business days.',
    category: 'Shipping'
  },
  {
    id: '4',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location. Please check the shipping options at checkout.',
    category: 'Shipping'
  },
  {
    id: '5',
    question: 'Can I track my order?',
    answer: 'Yes, once your order is shipped, you will receive a tracking number via email. You can also track your order by logging into your account or using our order tracking page.',
    category: 'Ordering'
  },
  {
    id: '6',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Custom or personalized items are not returnable. Please see our Return Policy page for complete details.',
    category: 'Returns'
  },
  {
    id: '7',
    question: 'How do I return an item?',
    answer: 'To return an item, contact our customer service team within 30 days of delivery. We will provide you with a return authorization number and shipping instructions.',
    category: 'Returns'
  },
  {
    id: '8',
    question: 'Are your products authentic?',
    answer: 'Yes, all our products are authentic and handcrafted by skilled artisans. We work directly with craftspeople to ensure the highest quality and authenticity.',
    category: 'Products'
  },
  {
    id: '9',
    question: 'Do you offer custom orders?',
    answer: 'Yes, we offer custom orders for jewelry and mandala art. Please contact us with your requirements and we will work with you to create a unique piece.',
    category: 'Products'
  },
  {
    id: '10',
    question: 'How do I care for my jewelry?',
    answer: 'To maintain the beauty of your jewelry, avoid contact with perfumes, lotions, and harsh chemicals. Store in a dry place and clean gently with a soft cloth.',
    category: 'Care'
  },
  {
    id: '11',
    question: 'What if my item arrives damaged?',
    answer: 'If your item arrives damaged, please contact us immediately with photos of the damage. We will arrange for a replacement or full refund at no cost to you.',
    category: 'Returns'
  },
  {
    id: '12',
    question: 'Do you have a size guide?',
    answer: 'Yes, we provide detailed size guides for our jewelry items. Size guides are available on individual product pages to help you find the perfect fit.',
    category: 'Products'
  }
];

const categories = ['All', 'Ordering', 'Payment', 'Shipping', 'Returns', 'Products', 'Care'];

export function FAQPage({ onBackToHome, onContactClick }: FAQPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="text-background hover:bg-background/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-semibold">Frequently Asked Questions</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            >
              <MessageCircle className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, ordering, shipping, and more.
            </p>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{faq.question}</span>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-primary/5 rounded-lg p-8"
          >
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-4">
                <Mail className="h-12 w-12 text-primary" />
                <Phone className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer service team is here to help. 
              Contact us for personalized assistance with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onContactClick}
                className="bg-primary hover:bg-primary/90"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
              <Button 
                variant="outline"
                onClick={onBackToHome}
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
