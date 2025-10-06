import React from 'react';
import { ArrowLeft, RefreshCw, Package, Clock, Shield, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'motion/react';

interface ReturnPolicyPageProps {
  onBackToHome: () => void;
  onContactClick?: () => void;
}

export function ReturnPolicyPage({ onBackToHome, onContactClick }: ReturnPolicyPageProps) {
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
            <h1 className="text-xl font-semibold">Return Policy</h1>
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
              <RefreshCw className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Return & Exchange Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We want you to love your purchase. If you're not completely satisfied, we're here to help make it right.
            </p>
          </div>

          {/* Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Return Window
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 30 days from delivery date</li>
                    <li>• Items must be in original condition</li>
                    <li>• Original packaging preferred</li>
                    <li>• Tags and labels intact</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-primary" />
                    Eligible Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• All jewelry and accessories</li>
                    <li>• Mandala art prints</li>
                    <li>• Novelty products</li>
                    <li>• Custom orders (special conditions)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-primary" />
                    Not Eligible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Personalized or custom items</li>
                    <li>• Items damaged by customer</li>
                    <li>• Items worn or used</li>
                    <li>• Sale items (final sale)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-primary" />
                    Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>1. Contact us within 30 days</li>
                    <li>2. Get return authorization</li>
                    <li>3. Package item securely</li>
                    <li>4. Ship to our address</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-muted/50 rounded-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Detailed Return Policy</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Return Conditions</h3>
                <p className="text-muted-foreground mb-4">
                  To be eligible for a return, your item must be unused and in the same condition that you received it. 
                  It must also be in the original packaging with all tags and labels intact.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Items must be returned within 30 days of delivery</li>
                  <li>Original receipt or proof of purchase required</li>
                  <li>Items must be in original condition</li>
                  <li>Custom or personalized items are not returnable</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Refund Process</h3>
                <p className="text-muted-foreground mb-4">
                  Once your return is received and inspected, we will send you an email to notify you that we have 
                  received your returned item. We will also notify you of the approval or rejection of your refund.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Refunds processed within 5-7 business days</li>
                  <li>Refund method matches original payment</li>
                  <li>Shipping costs are non-refundable</li>
                  <li>Return shipping is customer responsibility</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Exchange Policy</h3>
                <p className="text-muted-foreground mb-4">
                  We offer exchanges for different sizes or styles of the same item. Exchanges are subject to 
                  availability and must be initiated within 30 days of delivery.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Exchanges for different sizes or colors</li>
                  <li>Price difference may apply</li>
                  <li>Original item must meet return conditions</li>
                  <li>Exchange shipping costs may apply</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center bg-primary/5 rounded-lg p-8"
          >
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Need Help with Returns?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help you with any questions about returns, 
              exchanges, or our policies. Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onContactClick}
                className="bg-primary hover:bg-primary/90"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Customer Service
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
