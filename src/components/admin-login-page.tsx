import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Shield, Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface AdminLoginPageProps {
  onBackToHome: () => void;
  onAdminLogin: (email: string, password: string) => Promise<boolean>;
}

export function AdminLoginPage({ onBackToHome, onAdminLogin }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo admin credentials (in real app, this would be handled by backend)
  const ADMIN_CREDENTIALS = {
    email: 'admin@bhavyakavya.com',
    password: 'admin123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onAdminLogin(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Admin login error:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToHome}
                className="hover:bg-secondary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl text-primary">BhavyaKavya's</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Admin Portal</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground hidden sm:block">Secure Admin Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <motion.div
                  className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Shield className="h-8 w-8 text-primary" />
                </motion.div>
                <h1 className="text-3xl text-center mb-2">Admin Login</h1>
                <p className="text-muted-foreground text-center">
                  Access the administrative dashboard
                </p>
              </div>

              {/* Login Card */}
              <Card className="shadow-lg border-border/50">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Enter your admin credentials to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Admin Email</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@bhavyakavya.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Sign In</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>

              {/* Demo Credentials Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6"
              >
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-sm mb-2 text-muted-foreground">Demo Credentials</h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p><strong>Email:</strong> admin@bhavyakavya.com</p>
                        <p><strong>Password:</strong> admin123</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Back to Home Link */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  onClick={onBackToHome}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to Website
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}