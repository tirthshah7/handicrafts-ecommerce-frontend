# 🛍️ Handicrafts E-commerce Frontend

A modern, full-featured e-commerce application built with React, TypeScript, and Tailwind CSS, specializing in traditional handicrafts, jewelry, and art.

## ✨ Features

### 🛒 Core E-commerce Features
- **Product Catalog**: Browse handicrafts, jewelry, mandala art, and novelty products
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Wishlist**: Save favorite items for later purchase
- **User Authentication**: Secure sign-up/sign-in with Supabase
- **Payment Processing**: Razorpay integration for secure payments
- **Order Management**: Complete order lifecycle with tracking

### 🔍 Advanced Features
- **Smart Search**: Real-time search with advanced filtering
- **Category Filtering**: Filter by price, rating, stock status, and categories
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Dark/Light Theme**: Toggle between themes
- **User Profiles**: Manage personal information and addresses
- **Order Tracking**: Track orders from placement to delivery

### 📧 Communication
- **Email Notifications**: Order confirmations, shipping updates, and delivery notifications
- **Welcome Emails**: Automated welcome messages for new users
- **Professional Templates**: Beautiful HTML email templates

### ⚙️ Admin Features
- **Admin Dashboard**: Comprehensive order and product management
- **Order Processing**: Update order status with automatic email notifications
- **Analytics**: Order statistics and performance metrics
- **Customer Management**: View and manage customer information

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Email**: Custom notification service
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd handicrafts-ecommerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the environment variables with your configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── figma/           # Custom components
│   └── *.tsx            # Page components
├── services/            # Business logic services
│   ├── paymentService.ts
│   ├── orderService.ts
│   └── notificationService.ts
├── utils/               # Utility functions
│   ├── api.ts          # API client
│   └── supabase/       # Supabase configuration
├── data/               # Static data and samples
├── styles/             # Global styles
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (if using custom email service)
VITE_EMAIL_SERVICE_URL=your_email_service_url
```

### Supabase Setup

1. Create a new Supabase project
2. Set up authentication
3. Create the required database tables
4. Configure Row Level Security (RLS) policies

### Razorpay Setup

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Configure webhook endpoints for payment verification

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

The application uses a consistent design system with:

- **Color Palette**: Green-based theme with proper contrast ratios
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable components from shadcn/ui
- **Icons**: Lucide React icon library

## 🔒 Security Features

- **Authentication**: Secure user authentication with Supabase
- **Payment Security**: Razorpay integration with signature verification
- **Data Validation**: Client-side and server-side validation
- **HTTPS**: Secure communication (in production)
- **Environment Variables**: Sensitive data stored in environment variables

## 📊 Performance

- **Code Splitting**: Dynamic imports for better performance
- **Image Optimization**: Optimized images with fallbacks
- **Lazy Loading**: Components loaded on demand
- **Caching**: Proper caching strategies
- **Bundle Optimization**: Optimized build output

## 🧪 Testing

The application includes:

- **Type Safety**: Full TypeScript coverage
- **Error Boundaries**: Graceful error handling
- **Fallback Data**: Sample data when API fails
- **Responsive Testing**: Mobile and desktop compatibility

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your repository to Netlify
2. Configure build settings
3. Set environment variables
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve the SPA correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Razorpay](https://razorpay.com/) for payment processing
- [Lucide](https://lucide.dev/) for the icon library

## 📞 Support

For support, email support@handicrafts-ecommerce.com or create an issue in the repository.

---

**Built with ❤️ for traditional handicrafts and art lovers**