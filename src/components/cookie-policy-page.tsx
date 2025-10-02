import { ArrowLeft, Cookie, Settings, BarChart3, Target, Shield, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface CookiePolicyPageProps {
  onBackToHome: () => void;
}

export function CookiePolicyPage({ onBackToHome }: CookiePolicyPageProps) {
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
              <Cookie className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This Cookie Policy explains how BhavyaKavya's uses cookies and similar technologies to enhance 
              your browsing experience.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Last Updated */}
          <Card>
            <CardHeader>
              <CardTitle>Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This Cookie Policy was last updated on September 30, 2025.</p>
            </CardContent>
          </Card>

          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
              <CardDescription>
                Understanding cookies and how they work on our website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners. 
                Cookies help us understand how visitors interact with our website and improve your overall experience.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies We Use */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
              <CardDescription>
                We use different types of cookies for various purposes on our website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Essential Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Essential Cookies</h3>
                  <Badge variant="secondary" className="ml-2">Required</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Shopping cart functionality</li>
                  <li>User authentication and security</li>
                  <li>Website preferences and settings</li>
                  <li>Load balancing and performance</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Analytics Cookies</h3>
                  <Badge variant="outline" className="ml-2">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies help us understand how visitors use our website so we can improve it.
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Page views and user interactions</li>
                  <li>Popular products and categories</li>
                  <li>Website performance metrics</li>
                  <li>Error tracking and debugging</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Marketing Cookies</h3>
                  <Badge variant="outline" className="ml-2">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies are used to show you relevant advertisements and measure campaign effectiveness.
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Personalized product recommendations</li>
                  <li>Targeted advertising campaigns</li>
                  <li>Social media integration</li>
                  <li>Retargeting and remarketing</li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Settings className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Functional Cookies</h3>
                  <Badge variant="outline" className="ml-2">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies enhance website functionality and personalization features.
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Language and region preferences</li>
                  <li>Dark mode and theme settings</li>
                  <li>Recently viewed products</li>
                  <li>Wishlist and favorites</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may use third-party services that also set cookies on your device. These include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-muted-foreground">
                    Helps us understand website traffic and user behavior to improve our services.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Payment Processors</h4>
                  <p className="text-muted-foreground">
                    Secure payment gateways may set cookies for fraud protection and transaction processing.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Social Media</h4>
                  <p className="text-muted-foreground">
                    Social sharing buttons and embedded content from platforms like Facebook and Instagram.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Customer Support</h4>
                  <p className="text-muted-foreground">
                    Live chat and help desk services to provide better customer support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
              <CardDescription>
                You have control over which cookies are stored on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Browser Settings</h3>
                <p className="text-muted-foreground">
                  Most web browsers allow you to control cookies through their settings. You can typically:
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                  <li>View which cookies are stored on your device</li>
                  <li>Delete existing cookies</li>
                  <li>Block all or some cookies</li>
                  <li>Set preferences for specific websites</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Our Cookie Banner</h3>
                <p className="text-muted-foreground">
                  When you first visit our website, you'll see a cookie banner where you can choose which types of cookies 
                  to accept. You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Impact of Disabling Cookies</h3>
                <p className="text-muted-foreground">
                  Please note that disabling certain cookies may affect the functionality of our website. Essential cookies 
                  are required for basic website operations and cannot be disabled.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Cookie Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Session Cookies</h4>
                  <p className="text-muted-foreground">
                    These are temporary cookies that are deleted when you close your browser. They're used for essential 
                    functions like maintaining your shopping cart.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                  <p className="text-muted-foreground">
                    These cookies remain on your device for a set period (usually 1-2 years) or until you delete them. 
                    They remember your preferences across visits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the updated policy on our website and updating the 
                "Last Updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@bhavyakavyas.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Craft Street, Artisan Quarter, Mumbai, Maharashtra 400001</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Footer Note */}
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}