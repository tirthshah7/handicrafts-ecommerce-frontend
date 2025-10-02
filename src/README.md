# BhavyaKavya's - Handicrafts E-commerce Website

## 🎨 Overview

BhavyaKavya's is a complete frontend for an Indian handicrafts e-commerce website featuring premium handcrafted jewelry, traditional art, and contemporary products. Built with React, TypeScript, and Tailwind CSS, it showcases a warm orangish/golden color palette optimized for the Indian market.

**Tagline:** *"Crafting a Poem of Splendid Living"*

## ✨ Key Features

### 🏠 **Core Pages**
- **Landing Page** - Hero section with featured categories and product showcase
- **Product Pages** - Detailed product views with image galleries, specifications, and reviews
- **Collection Pages** - "Mahima's Jewellery" and "Mahima's Mandala Art" curated collections
- **Cart & Checkout** - Full shopping cart functionality with quantity management
- **Search & Filtering** - Advanced product search with category-based filtering
- **View All Products** - Comprehensive product browsing with sort/filter options

### 🔐 **Authentication System**
- **Unified Auth Page** - Combined signin/signup experience with tab switching
- **Form Validation** - Real-time validation with error handling
- **Social Login Options** - Google, Facebook, and Apple sign-in buttons
- **Mobile Optimized** - Responsive design for all screen sizes
- **Password Requirements** - Secure password validation and strength indicators
- **Terms & Privacy** - Integrated legal agreement checkboxes

### 🌙 **Dark Mode System**
- **Handicrafts-Appropriate Palette** - Warm charcoal backgrounds with golden amber accents
- **Floating Toggle** - Bottom-left positioned theme switcher on all pages
- **Theme Persistence** - Local storage integration maintains user preferences
- **Comprehensive Coverage** - Works across all pages and components
- **Smooth Transitions** - Animated theme switching for better UX

### 📱 **User Experience**
- **Wishlist Functionality** - Save and manage favorite products
- **Smart Search Modal** - Quick product and category search
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization
- **Toast Notifications** - User feedback for all actions
- **Local Storage** - Cart and wishlist persistence across sessions

### 🛡️ **Legal & Compliance**
- **Privacy Policy** - Comprehensive data protection and usage policies
- **Terms of Service** - Complete user agreement and service terms
- **Cookie Policy** - Detailed cookie usage and management information
- **Indian Law Compliance** - Tailored for Indian e-commerce regulations
- **Professional Design** - Branded legal pages with easy navigation

### 🧭 **Navigation & Information**
- **Smart Header** - Category navigation with user profile dropdown
- **Enhanced Footer** - Complete navigation with company information and legal links
- **About Us Page** - Brand story, values, mission, and founder's story section
- **Contact Us Page** - Complete contact information with functional contact form
- **Legal Pages** - Privacy Policy, Terms of Service, and Cookie Policy
- **Quick Links** - Easy navigation to all major sections

## 📁 Project Structure

```
├── App.tsx                     # Main application with routing logic
├── components/
│   ├── about-us-page.tsx       # Company story and values
│   ├── auth-page.tsx           # Unified signin/signup page
│   ├── contact-us-page.tsx     # Contact information and form
│   ├── privacy-policy-page.tsx # Privacy policy with data practices
│   ├── terms-of-service-page.tsx # Terms of service and legal agreements
│   ├── cookie-policy-page.tsx  # Cookie usage and management policy
│   ├── header.tsx              # Navigation header with user dropdown
│   ├── footer.tsx              # Enhanced footer with legal links
│   ├── theme-provider.tsx      # Dark mode context provider
│   ├── theme-toggle.tsx        # Floating theme switcher
│   ├── [other-components].tsx  # Product pages, cart, search, etc.
│   └── ui/                     # Shadcn/ui component library
├── styles/
│   └── globals.css             # Tailwind v4 configuration with theme variables
└── guidelines/
    └── Guidelines.md           # Development guidelines and standards
```

## 🎨 Design System

### **Color Palette**
- **Light Mode**: Warm beige backgrounds (#faf7f2) with orange primary (#d97706)
- **Dark Mode**: Rich charcoal (#1a1612) with golden amber primary (#f59e0b)
- **Accents**: Traditional Indian craft-inspired warm tones

### **Typography**
- **Headers**: Medium weight (500) with proper hierarchy
- **Body Text**: Regular weight (400) with 1.5 line-height
- **Responsive**: Base 16px with proper scaling

### **Components**
- **Shadcn/ui Library**: Complete set of accessible components
- **Custom Animations**: Motion/React for smooth interactions
- **Icons**: Lucide React for consistent iconography

## 🛠 Technical Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **Tailwind CSS v4** for styling with CSS variables
- **Motion/React** for animations and transitions
- **Shadcn/ui** for accessible component library
- **Sonner** for toast notifications
- **Local Storage API** for data persistence

### **State Management**
- **React useState/useEffect** for local state
- **Local Storage** for cart, wishlist, and theme persistence
- **TypeScript interfaces** for type-safe data handling

## 🔧 Backend Requirements & Integration Points

### **Authentication API Endpoints**
```typescript
// Required backend endpoints for authentication
POST /api/auth/signin          # User login
POST /api/auth/signup          # User registration  
POST /api/auth/social-login    # Google/Facebook/Apple login
POST /api/auth/forgot-password # Password reset
GET  /api/auth/verify-email    # Email verification
POST /api/auth/refresh-token   # Token refresh
```

### **User Management**
```typescript
// User profile and account management
GET    /api/user/profile       # Get user profile
PUT    /api/user/profile       # Update user profile
GET    /api/user/orders        # Order history
GET    /api/user/wishlist      # Sync wishlist with backend
POST   /api/user/wishlist      # Add to wishlist
DELETE /api/user/wishlist/:id  # Remove from wishlist
```

### **Product & Inventory API**
```typescript
// Product catalog and inventory
GET /api/products              # Get all products with pagination
GET /api/products/:id          # Get single product details
GET /api/products/search       # Search products
GET /api/products/category/:cat # Get products by category
GET /api/categories            # Get all categories
GET /api/products/featured     # Get featured products
```

### **Cart & Checkout**
```typescript
// Shopping cart and order processing
GET    /api/cart               # Get user's cart
POST   /api/cart/add           # Add item to cart
PUT    /api/cart/update        # Update cart item quantity
DELETE /api/cart/remove/:id    # Remove item from cart
POST   /api/checkout           # Process order
GET    /api/orders/:id         # Get order details
```

### **Contact & Support**
```typescript
// Contact form and customer support
POST /api/contact              # Submit contact form
GET  /api/contact/info         # Get company contact information
POST /api/support/ticket       # Create support ticket
GET  /api/legal/privacy        # Get privacy policy content
GET  /api/legal/terms          # Get terms of service content
GET  /api/legal/cookies        # Get cookie policy content
```

### **Required Database Schema**

#### **Users Table**
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
)
```

#### **Products Table**
```sql
products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR NOT NULL,
  images JSON, -- Array of image URLs
  features JSON, -- Array of features
  specifications JSON, -- Key-value specifications
  stock_quantity INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### **Orders Table**
```sql
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'pending',
  shipping_address JSON,
  billing_address JSON,
  items JSON, -- Array of order items
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage
AWS_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Application
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

## 🚀 Getting Started

### **Development Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check
```

### **Current Frontend State**
The frontend is **100% complete** and includes:
- ✅ All pages and components implemented
- ✅ Authentication UI with form validation and smooth transitions
- ✅ Dark mode system fully functional
- ✅ Cart and wishlist with local persistence
- ✅ Search and filtering capabilities
- ✅ Responsive design for all devices
- ✅ About Us and Contact Us pages
- ✅ Complete legal pages (Privacy Policy, Terms of Service, Cookie Policy)
- ✅ Footer navigation with working legal links

### **Backend Integration Checklist**
- [ ] Set up authentication server with JWT
- [ ] Implement product catalog API
- [ ] Create user management system
- [ ] Set up order processing workflow
- [ ] Configure email service for notifications
- [ ] Implement payment gateway integration
- [ ] Set up file storage for product images
- [ ] Create admin panel for product management

## 📧 Contact Information

### **Current Example Data** (Replace with actual)
- **Address**: 123 Heritage Lane, Craft District, New Delhi, India - 110001
- **Phone**: +91 98765 43210 (Customer Service)
- **WhatsApp**: +91 98765 43211
- **Email**: hello@bhavyakavyas.com
- **Business Hours**: Mon-Fri 9AM-7PM, Sat 10AM-6PM, Sun 11AM-4PM

## 🎯 Key Differentiators

1. **Authentic Indian Aesthetic** - Warm color palette reflecting traditional handicrafts
2. **Premium User Experience** - Smooth animations and intuitive navigation
3. **Mobile-First Approach** - Optimized for Indian mobile users
4. **Local Storage Integration** - Works offline for better user experience
5. **Comprehensive Dark Mode** - Thoughtfully designed for handicrafts theme
6. **Cultural Sensitivity** - Design elements respect Indian art traditions

## 📱 Mobile Optimization

- **Touch-Friendly Interface** - Large tap targets and gesture support
- **Optimized Loading** - Image optimization and lazy loading
- **Offline Capability** - Local storage for cart and preferences
- **Responsive Typography** - Scales appropriately across devices
- **Mobile Navigation** - Hamburger menu and swipe gestures

## 🔮 Future Enhancements

### **Phase 2 Features**
- **User Reviews & Ratings** - Customer feedback system
- **Advanced Filtering** - Price range, availability, ratings
- **Recommendation Engine** - AI-powered product suggestions
- **Loyalty Program** - Points and rewards system
- **Live Chat Support** - Real-time customer assistance

### **Backend Integrations**
- **Inventory Management** - Real-time stock updates
- **Analytics Dashboard** - Sales and user behavior tracking
- **Email Marketing** - Newsletter and promotional campaigns
- **Multi-language Support** - Hindi and regional language options
- **Voice Search** - Hindi voice search capability

---

**Ready for Backend Integration** 🚀

The frontend is production-ready and waiting for backend API integration. All UI components are built, tested, and optimized for the Indian handicrafts market.