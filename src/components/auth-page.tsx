import { useState } from 'react';
import { useBackend } from './backend-provider';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

import { Separator } from './ui/separator';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { NotificationService } from '../services/notificationService';

interface AuthPageProps {
  onBackToHome?: () => void;
  initialTab?: 'signin' | 'signup';
}

export function AuthPage({ onBackToHome, initialTab = 'signin' }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use backend authentication
  const { signIn, signUp } = useBackend();

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    acceptTerms: false
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signIn(signInData.email, signInData.password);
      if (success) {
        onBackToHome?.();
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!signUpData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${signUpData.firstName} ${signUpData.lastName}`.trim();
      const success = await signUp(signUpData.email, signUpData.password, fullName);
      if (success) {
        // Send welcome email
        try {
          await NotificationService.sendWelcomeEmail({
            name: fullName,
            email: signUpData.email
          });
          console.log('Welcome email sent successfully');
        } catch (error) {
          console.error('Failed to send welcome email:', error);
          // Don't fail the sign-up process if email fails
        }
        
        // Switch to sign in tab after successful registration
        setActiveTab('signin');
        setSignInData({ email: signUpData.email, password: '' });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login feature coming soon!`, {
      description: 'We\'re working on social login integration.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 relative">
      {/* Centered Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl text-primary">BhavyaKavya's</h1>
          <p className="text-sm text-muted-foreground italic mt-2">Crafting a Poem of Splendid Living</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-xl border-primary/10">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-primary">Welcome</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Join our community of handicraft lovers
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="w-full">
                  {/* Custom Tab Header with Sliding Indicator */}
                  <div className="relative mb-6">
                    <div className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
                      {/* Sliding Background Indicator */}
                      <motion.div
                        className="absolute top-1 bottom-1 bg-card shadow-sm rounded-md"
                        initial={false}
                        animate={{
                          left: activeTab === 'signin' ? '4px' : 'calc(50% + 2px)',
                          width: 'calc(50% - 6px)'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      
                      {/* Tab Buttons */}
                      <button
                        onClick={() => setActiveTab('signin')}
                        className={`relative z-10 py-2 px-4 text-sm font-medium text-center transition-colors duration-200 ${
                          activeTab === 'signin' 
                            ? 'text-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setActiveTab('signup')}
                        className={`relative z-10 py-2 px-4 text-sm font-medium text-center transition-colors duration-200 ${
                          activeTab === 'signup' 
                            ? 'text-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                  {/* Form Container with Sliding Animation */}
                  <div className="relative overflow-hidden">
                    <motion.div
                      className="flex"
                      animate={{ x: activeTab === 'signin' ? '0%' : '-100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Sign In Form */}
                      <motion.div 
                        className="w-full flex-shrink-0 space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeTab === 'signin' ? 1 : 0.3 }}
                        transition={{ duration: 0.3 }}
                      >
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            value={signInData.email}
                            onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={signInData.password}
                            onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 px-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-primary/20" />
                          <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                          Forgot password?
                        </Button>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialLogin('Google')}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialLogin('Facebook')}
                      >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                      </motion.div>

                      {/* Sign Up Form */}
                      <motion.div 
                        className="w-full flex-shrink-0 space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeTab === 'signup' ? 1 : 0.3 }}
                        transition={{ duration: 0.3 }}
                      >
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="first-name"
                              placeholder="First name"
                              className="pl-10"
                              value={signUpData.firstName}
                              onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            placeholder="Last name"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="pl-10"
                            value={signUpData.phone}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 px-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 w-8 px-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="address"
                              placeholder="Street address"
                              className="pl-10"
                              value={signUpData.address}
                              onChange={(e) => setSignUpData(prev => ({ ...prev, address: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            value={signUpData.city}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="terms"
                          className="rounded border-primary/20"
                          checked={signUpData.acceptTerms}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the{' '}
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                            Terms & Conditions
                          </Button>
                          {' '}and{' '}
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialLogin('Google')}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSocialLogin('Facebook')}
                      >
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                    </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to receive updates about new products and exclusive offers from BhavyaKavya's.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Floating Back to Home Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button 
          onClick={onBackToHome}
          size="sm"
          className="shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}