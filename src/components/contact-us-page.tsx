import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface ContactUsPageProps {
  onBackToHome: () => void;
}

export function ContactUsPage({ onBackToHome }: ContactUsPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!', {
      description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
    });
  };

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
            <h1 className="text-4xl md:text-5xl text-primary mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We'd love to hear from you. Get in touch with our team.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl text-primary mb-8">Get in Touch</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Have questions about our products, need assistance with your order, or want to learn more about our artisans? 
                  We're here to help! Reach out to us through any of the following methods.
                </p>

                <div className="space-y-6">
                  {/* Address */}
                  <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg text-primary mb-2">Visit Our Store</h3>
                          <p className="text-muted-foreground">
                            123 Heritage Lane, Craft District<br />
                            New Delhi, India - 110001<br />
                            Near Traditional Arts Center
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone */}
                  <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg text-primary mb-2">Call Us</h3>
                          <p className="text-muted-foreground">
                            <strong>Customer Service:</strong> +91 98765 43210<br />
                            <strong>WhatsApp:</strong> +91 98765 43211<br />
                            <strong>Wholesale Inquiries:</strong> +91 98765 43212
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg text-primary mb-2">Email Us</h3>
                          <p className="text-muted-foreground">
                            <strong>General:</strong> hello@bhavyakavyas.com<br />
                            <strong>Orders:</strong> orders@bhavyakavyas.com<br />
                            <strong>Support:</strong> support@bhavyakavyas.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Hours */}
                  <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg text-primary mb-2">Business Hours</h3>
                          <p className="text-muted-foreground">
                            <strong>Monday - Friday:</strong> 9:00 AM - 7:00 PM<br />
                            <strong>Saturday:</strong> 10:00 AM - 6:00 PM<br />
                            <strong>Sunday:</strong> 11:00 AM - 4:00 PM<br />
                            <em>Closed on major festivals</em>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Enter your first name" 
                            required 
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Enter your last name" 
                            required 
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email address" 
                          required 
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone number" 
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="What is this regarding?" 
                          required 
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us how we can help you..." 
                          rows={6}
                          required 
                          className="mt-2"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow duration-300"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Additional Information */}
            <motion.div
              className="mt-16 bg-gradient-to-r from-secondary/50 to-accent/30 rounded-2xl p-8 md:p-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl text-primary mb-4">Customer Support</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
                Our dedicated customer support team is committed to providing you with the best shopping experience. 
                Whether you need help choosing the perfect piece, tracking your order, or learning about our artisan stories, 
                we're here to assist you every step of the way.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-primary">Response Time</div>
                  <div className="text-muted-foreground">Within 24 hours</div>
                </div>
                <div>
                  <div className="text-primary">Languages</div>
                  <div className="text-muted-foreground">Hindi, English</div>
                </div>
                <div>
                  <div className="text-primary">Support Channels</div>
                  <div className="text-muted-foreground">Email, Phone, WhatsApp</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}