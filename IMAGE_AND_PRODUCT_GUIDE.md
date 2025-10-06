# 🖼️ Image and Product Management Guide

## 📸 **How to Change Hero Section Images**

### **Current Hero Image Location:**
File: `src/components/hero-section.tsx` (Line 88)

### **Step 1: Replace the Hero Image**

```typescript
// Current hero image (Line 88):
<ImageWithFallback
  src="https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  alt="Indian Traditional Handicrafts"
  className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
/>
```

### **Option 1: Use Your Own Images (Recommended)**

1. **Create a folder for your images:**
   ```bash
   mkdir -p public/images/hero
   mkdir -p public/images/products
   ```

2. **Add your hero image:**
   - Place your hero image in `public/images/hero/`
   - Name it something like `hero-main.jpg`

3. **Update the hero section:**
   ```typescript
   <ImageWithFallback
     src="/images/hero/hero-main.jpg"
     alt="Your Custom Hero Image"
     className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
   />
   ```

### **Option 2: Use Different Unsplash Images**

Replace the current URL with a new Unsplash image URL:

```typescript
<ImageWithFallback
  src="https://images.unsplash.com/photo-YOUR_NEW_IMAGE_ID"
  alt="Your New Hero Image"
  className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
/>
```

### **Image Requirements:**
- **Aspect Ratio**: 16:9 or 4:3 works best
- **Resolution**: At least 1920x1080px
- **Format**: JPG, PNG, or WebP
- **File Size**: Under 2MB for fast loading

---

## 🛍️ **How to Add New Real Products**

### **Step 1: Understand the Product Structure**

Each product needs these properties:

```typescript
interface Product {
  id: string;                    // Unique identifier
  name: string;                  // Product name
  price: number;                 // Current price (in rupees)
  originalPrice?: number;        // Original price (for discounts)
  image: string;                 // Main product image URL
  images?: string[];             // Additional product images
  category: string;              // Product category
  rating: number;                // Rating (1-5)
  reviews: number;               // Number of reviews
  isPremium?: boolean;           // Premium product flag
  isNew?: boolean;               // New product flag
  inStock?: boolean;             // Stock availability
  stock?: number;                // Stock quantity
  lowStockThreshold?: number;    // Low stock warning threshold
  description?: string;          // Product description
  features?: string[];           // Product features
  specifications?: Record<string, string>; // Technical specs
}
```

### **Step 2: Add Products to the Database**

#### **Option A: Add to Sample Products (For Testing)**

File: `src/data/sampleProducts.ts`

```typescript
export const sampleProducts: Product[] = [
  // ... existing products ...
  
  // Add your new product here:
  {
    id: '21', // Use next available ID
    name: 'Your Product Name',
    price: 2500,
    originalPrice: 3000,
    image: 'https://your-image-url.com/product-main.jpg',
    images: [
      'https://your-image-url.com/product-1.jpg',
      'https://your-image-url.com/product-2.jpg',
      'https://your-image-url.com/product-3.jpg'
    ],
    category: 'Your Category',
    rating: 4.5,
    reviews: 12,
    isPremium: false,
    isNew: true,
    inStock: true,
    stock: 25,
    lowStockThreshold: 5,
    description: 'Detailed description of your product...',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    specifications: {
      'Material': 'Your material',
      'Weight': 'Your weight',
      'Dimensions': 'Your dimensions',
      'Color': 'Your color options'
    }
  }
];
```

#### **Option B: Add to Supabase Database (Recommended for Production)**

1. **Go to your Supabase dashboard**
2. **Navigate to the KV Store table**
3. **Add new product entries with keys like:**
   - `product:21` (your product data)
   - `product:22` (next product data)

### **Step 3: Image Management for Products**

#### **Option 1: Use Your Own Images**

1. **Create product image folders:**
   ```bash
   mkdir -p public/images/products/jewelry
   mkdir -p public/images/products/mandala
   mkdir -p public/images/products/novelty
   ```

2. **Add your product images:**
   - Main image: `product-name-main.jpg`
   - Additional images: `product-name-1.jpg`, `product-name-2.jpg`, etc.

3. **Use in your product:**
   ```typescript
   image: '/images/products/jewelry/necklace-main.jpg',
   images: [
     '/images/products/jewelry/necklace-1.jpg',
     '/images/products/jewelry/necklace-2.jpg'
   ]
   ```

#### **Option 2: Use Unsplash Images**

```typescript
image: 'https://images.unsplash.com/photo-YOUR_IMAGE_ID',
images: [
  'https://images.unsplash.com/photo-IMAGE_ID_1',
  'https://images.unsplash.com/photo-IMAGE_ID_2'
]
```

### **Step 4: Image Optimization Tips**

1. **Use WebP format** for better compression
2. **Optimize images** before uploading (use tools like TinyPNG)
3. **Use multiple sizes** for responsive design
4. **Add alt text** for accessibility

---

## 🎨 **Image Categories and Suggestions**

### **Hero Section Images:**
- Traditional Indian handicrafts showcase
- Artisan working on crafts
- Beautiful product arrangements
- Cultural heritage themes

### **Product Categories:**

#### **Jewelry:**
- Necklaces, earrings, bracelets
- Traditional Indian jewelry
- Gold, silver, kundan work
- Bridal jewelry

#### **Mandala Art:**
- Hand-drawn mandalas
- Painted mandalas
- Digital mandala prints
- Mandala wall art

#### **Novelty Items:**
- Home decor items
- Traditional artifacts
- Handicraft accessories
- Cultural souvenirs

---

## 🚀 **Quick Start Guide**

### **To Change Hero Image:**
1. Open `src/components/hero-section.tsx`
2. Find line 88 with the `ImageWithFallback` component
3. Replace the `src` URL with your image
4. Save and test

### **To Add New Product:**
1. Open `src/data/sampleProducts.ts`
2. Add your product object to the array
3. Make sure to use a unique `id`
4. Add proper image URLs
5. Save and test

### **To Add Images to Public Folder:**
1. Create `public/images/` folder
2. Add your images there
3. Reference them as `/images/your-image.jpg`

---

## 📝 **Example: Adding a Real Product**

```typescript
{
  id: '21',
  name: 'Handcrafted Silver Earrings',
  price: 1800,
  originalPrice: 2200,
  image: '/images/products/jewelry/silver-earrings-main.jpg',
  images: [
    '/images/products/jewelry/silver-earrings-1.jpg',
    '/images/products/jewelry/silver-earrings-2.jpg'
  ],
  category: 'Mahima\'s Jewellery',
  rating: 4.7,
  reviews: 23,
  isPremium: false,
  isNew: true,
  inStock: true,
  stock: 18,
  lowStockThreshold: 5,
  description: 'Beautiful handcrafted silver earrings with traditional Indian design patterns.',
  features: [
    '100% Pure Silver',
    'Handcrafted by skilled artisans',
    'Traditional Indian design',
    'Comfortable to wear'
  ],
  specifications: {
    'Material': 'Pure Silver',
    'Weight': '12 grams',
    'Dimensions': '2.5 inches length',
    'Finish': 'Polished silver'
  }
}
```

This guide will help you easily manage images and products for your e-commerce website! 🎉
