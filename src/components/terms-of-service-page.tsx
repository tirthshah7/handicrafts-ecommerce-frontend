import { ArrowLeft, FileText, Scale, ShoppingCart, CreditCard, Truck, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

interface TermsOfServicePageProps {
  onBackToHome: () => void;
}

export function TermsOfServicePage({ onBackToHome }: TermsOfServicePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="mb-4 hover:bg-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These terms and conditions outline the rules and regulations for the use of BhavyaKavya's website 
              and services.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Important Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.
            </AlertDescription>
          </Alert>

          {/* Effective Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                Effective Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>These Terms of Service are effective as of September 30, 2025.</p>
            </CardContent>
          </Card>

          {/* Use of Website */}
          <Card>
            <CardHeader>
              <CardTitle>Use of Website</CardTitle>
              <CardDescription>
                Guidelines for proper use of our website and services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Use</h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Browse and purchase our handicrafts and jewelry products</li>
                  <li>Create an account and manage your profile</li>
                  <li>Contact us for customer support</li>
                  <li>Subscribe to our newsletter and marketing communications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Use</h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Use the website for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Upload or transmit viruses or malicious code</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Harass or abuse other users or our staff</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Products and Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                Products and Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
                  that product descriptions or other content is accurate, complete, reliable, or error-free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Acceptance</h3>
                <p className="text-muted-foreground">
                  All orders are subject to availability and confirmation of the order price. We reserve the right 
                  to decline or cancel any order for any reason.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <p className="text-muted-foreground">
                  All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. 
                  Prices are subject to change without notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-2" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Payment is required at the time of order placement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We accept major credit cards, debit cards, and digital payment methods
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  All transactions are processed securely through encrypted payment gateways
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  In case of payment failure, your order may be cancelled
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 text-primary mr-2" />
                Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delivery Timeframe</h3>
                <p className="text-muted-foreground">
                  Standard delivery typically takes 5-7 business days within India. Express delivery options are available 
                  for an additional charge.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Charges</h3>
                <p className="text-muted-foreground">
                  Shipping charges are calculated based on the delivery location and order value. Free shipping may be 
                  available for orders above a certain amount.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk of Loss</h3>
                <p className="text-muted-foreground">
                  Risk of loss and title for products purchased pass to you upon delivery to the shipping address you provide.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card>
            <CardHeader>
              <CardTitle>Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Return Policy</h3>
                <p className="text-muted-foreground">
                  You may return items within 30 days of delivery for a full refund, provided they are in original condition 
                  with all tags and packaging intact.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Non-Returnable Items</h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Customized or personalized jewelry items</li>
                  <li>Items damaged due to misuse or wear</li>
                  <li>Items returned without original packaging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refund Processing</h3>
                <p className="text-muted-foreground">
                  Refunds will be processed within 5-10 business days after we receive and inspect the returned item.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                BhavyaKavya's or its content suppliers and is protected by copyright and other intellectual property laws. 
                You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                BhavyaKavya's shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, 
                goodwill, or other intangible losses resulting from your use of our website or services.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
                upon posting on our website. Your continued use of our website constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Contact Information */}
          <div className="text-center py-8">
            <h3 className="font-semibold mb-4">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> legal@bhavyakavyas.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}