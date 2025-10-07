import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  Image, 
  Phone, 
  Settings,
  Save,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';

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

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

export default function AdminDashboardProduction() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hero content state
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Discover India's Artistic Heritage",
    subtitle: "Handcrafted with Love, Delivered with Care",
    tagline: "Experience the timeless beauty of traditional Indian handicrafts.",
    description: "BhavyaKavya's brings you an exquisite collection of handcrafted jewelry, mandala art, and novelty products, each piece telling a story of rich cultural heritage and skilled artistry.",
    ctaPrimary: "Shop Now",
    ctaSecondary: "Explore Categories",
    heroImage: "https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080",
    heroImageAlt: "Indian Traditional Handicrafts"
  });

  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@bhavyakavyas.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    businessHours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    instagram: 'https://instagram.com/bhavyakavyas',
    facebook: 'https://facebook.com/bhavyakavyas',
    twitter: 'https://twitter.com/bhavyakavyas'
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load hero content
        try {
          const heroResponse = await api.getHeroContent();
          if (heroResponse.success && heroResponse.data.content) {
            setHeroContent(heroResponse.data.content);
          }
        } catch (error) {
          console.log('Failed to load hero content:', error);
        }

        // Load contact info
        try {
          const contactResponse = await api.getContactInfo();
          if (contactResponse.success && contactResponse.data.contactInfo) {
            setContactInfo(contactResponse.data.contactInfo);
          }
        } catch (error) {
          console.log('Failed to load contact info:', error);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveHeroContent = async () => {
    try {
      setIsLoading(true);
      const response = await api.updateHeroContent(heroContent);
      if (response.success) {
        toast.success('Hero content saved successfully!');
      } else {
        toast.error('Failed to save hero content');
      }
    } catch (error) {
      console.error('Error saving hero content:', error);
      toast.error('Failed to save hero content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      setIsLoading(true);
      const response = await api.updateContactInfo(contactInfo);
      if (response.success) {
        toast.success('Contact information saved successfully!');
      } else {
        toast.error('Failed to save contact information');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce website</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Production Mode
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full overflow-x-auto mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 whitespace-nowrap">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 whitespace-nowrap">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 whitespace-nowrap">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 whitespace-nowrap">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2 whitespace-nowrap">
              <Image className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2 whitespace-nowrap">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 whitespace-nowrap">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7,207</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,234,567</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+3 new this week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hero Management Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Hero Section Management</h2>
              <p className="text-muted-foreground">Customize your homepage hero section with dynamic content and images</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hero Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Content</CardTitle>
                  <CardDescription>Update the main hero section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={heroContent.title}
                      onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={heroContent.subtitle}
                      onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-description">Description</Label>
                    <Textarea
                      id="hero-description"
                      value={heroContent.description}
                      onChange={(e) => setHeroContent(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta-primary">Primary CTA</Label>
                      <Input
                        id="hero-cta-primary"
                        value={heroContent.ctaPrimary}
                        onChange={(e) => setHeroContent(prev => ({ ...prev, ctaPrimary: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta-secondary">Secondary CTA</Label>
                      <Input
                        id="hero-cta-secondary"
                        value={heroContent.ctaSecondary}
                        onChange={(e) => setHeroContent(prev => ({ ...prev, ctaSecondary: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-image">Hero Image URL</Label>
                    <Input
                      id="hero-image"
                      value={heroContent.heroImage}
                      onChange={(e) => setHeroContent(prev => ({ ...prev, heroImage: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your hero section will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{heroContent.title}</h3>
                    <p className="text-lg text-amber-600 font-semibold mb-4">{heroContent.subtitle}</p>
                    <p className="text-gray-600 mb-6">{heroContent.description}</p>
                    <div className="flex gap-4">
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                        {heroContent.ctaPrimary}
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-500 text-amber-600">
                        {heroContent.ctaSecondary}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setHeroContent({
                  title: "Discover India's Artistic Heritage",
                  subtitle: "Handcrafted with Love, Delivered with Care",
                  tagline: "Experience the timeless beauty of traditional Indian handicrafts.",
                  description: "BhavyaKavya's brings you an exquisite collection of handcrafted jewelry, mandala art, and novelty products, each piece telling a story of rich cultural heritage and skilled artistry.",
                  ctaPrimary: "Shop Now",
                  ctaSecondary: "Explore Categories",
                  heroImage: "https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080",
                  heroImageAlt: "Indian Traditional Handicrafts"
                })}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={handleSaveHeroContent} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Hero Changes
              </Button>
            </div>
          </TabsContent>

          {/* Contact Management Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Contact Information Management</h2>
              <p className="text-muted-foreground">Manage contact details displayed in the footer</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                  <CardDescription>Update contact information displayed in the website footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-address">Address</Label>
                    <Textarea
                      id="contact-address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-hours">Business Hours</Label>
                    <Input
                      id="contact-hours"
                      value={contactInfo.businessHours}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, businessHours: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Manage social media links displayed in the footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-instagram">Instagram URL</Label>
                    <Input
                      id="contact-instagram"
                      type="url"
                      value={contactInfo.instagram}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-facebook">Facebook URL</Label>
                    <Input
                      id="contact-facebook"
                      type="url"
                      value={contactInfo.facebook}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, facebook: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-twitter">Twitter URL</Label>
                    <Input
                      id="contact-twitter"
                      type="url"
                      value={contactInfo.twitter}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setContactInfo({
                  email: 'info@bhavyakavyas.com',
                  phone: '+91 98765 43210',
                  address: 'Mumbai, Maharashtra, India',
                  businessHours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
                  instagram: 'https://instagram.com/bhavyakavyas',
                  facebook: 'https://facebook.com/bhavyakavyas',
                  twitter: 'https://twitter.com/bhavyakavyas'
                })}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={handleSaveContactInfo} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Changes
              </Button>
            </div>
          </TabsContent>

          {/* Other tabs placeholder */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Order management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your application settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
