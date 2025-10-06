# 🚀 Quick Image Changes - Step by Step

## **1. Change Hero Image (5 minutes)**

### **Current Hero Image:**
```typescript
// File: src/components/hero-section.tsx (Line 88)
<ImageWithFallback
  src="https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080"
  alt="Indian Traditional Handicrafts"
  className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
/>
```

### **Replace with your image:**
```typescript
<ImageWithFallback
  src="https://images.unsplash.com/photo-YOUR_NEW_IMAGE_ID"
  alt="Your Custom Hero Image"
  className="relative z-10 rounded-2xl shadow-2xl w-full h-96 object-cover"
/>
```

## **2. Add New Product (10 minutes)**

### **Add to sampleProducts.ts:**
```typescript
// File: src/data/sampleProducts.ts
// Add this at the end of the array (before the closing bracket)

{
  id: '21', // Next available ID
  name: 'Handcrafted Wooden Mandala',
  price: 1500,
  originalPrice: 2000,
  image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwd29vZGVufGVufDF8fHx8MTc1OTIzNDQ5MHww&ixlib=rb-4.0&q=80&w=1080',
  images: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwd29vZGVufGVufDF8fHx8MTc1OTIzNDQ5MHww&ixlib=rb-4.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwd29vZGVufGVufDF8fHx8MTc1OTIzNDQ5MHww&ixlib=rb-4.0&q=80&w=1080'
  ],
  category: 'Mandala Art',
  rating: 4.6,
  reviews: 18,
  isPremium: false,
  isNew: true,
  inStock: true,
  stock: 12,
  lowStockThreshold: 5,
  description: 'Beautiful handcrafted wooden mandala with intricate traditional patterns.',
  features: [
    'Handcrafted from premium wood',
    'Traditional Indian mandala design',
    'Perfect for home decoration',
    'Eco-friendly materials'
  ],
  specifications: {
    'Material': 'Premium Wood',
    'Dimensions': '12x12 inches',
    'Finish': 'Natural wood with protective coating',
    'Weight': '800 grams'
  }
}
```

## **3. Test Your Changes**

1. **Save the files**
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open http://localhost:3000**
4. **Check the hero section and product listings**

## **4. Image Sources for Quick Testing**

### **Hero Images (High Quality):**
- `https://images.unsplash.com/photo-1578662996442-48f60103fc96` (Mandala art)
- `https://images.unsplash.com/photo-1756483560049-e7b2208f99a0` (Jewelry)
- `https://images.unsplash.com/photo-1699799085041-e288623615ed` (Handicrafts)

### **Product Images:**
- **Jewelry**: Search "indian jewelry" on Unsplash
- **Mandala**: Search "mandala art" on Unsplash  
- **Handicrafts**: Search "indian handicrafts" on Unsplash

## **5. Pro Tips**

1. **Use high-resolution images** (at least 1920x1080)
2. **Keep file sizes under 2MB** for fast loading
3. **Use consistent aspect ratios** for better layout
4. **Add descriptive alt text** for accessibility
5. **Test on mobile devices** to ensure images look good

That's it! Your changes will be live immediately in development mode. 🎉
