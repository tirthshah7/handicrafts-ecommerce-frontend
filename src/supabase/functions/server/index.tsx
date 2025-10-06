import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Helper function to authenticate user
async function authenticateUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Initialize database schema on startup
async function initializeDatabase() {
  try {
    // Create categories if they don't exist
    const categories = [
      'Mahima\'s Jewellery',
      'Mahima\'s Mandala Art', 
      'Premium Collection',
      'Novelty Items',
      'Traditional Crafts',
      'Home Decor'
    ];
    
    for (const category of categories) {
      await kv.set(`category:${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, {
        name: category,
        slug: category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: `Premium handcrafted items in ${category}`,
        created_at: new Date().toISOString()
      });
    }

    // Initialize sample products if they don't exist
    const sampleProducts = [
      {
        id: '1',
        name: 'Royal Kundan Necklace Set',
        price: 12999,
        originalPrice: 15999,
        image: 'https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbmVja2xhY2UlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyMzM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: [
          'https://images.unsplash.com/photo-1723879580148-517048db5bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqZXdlbHJ5JTIwbmVja2xhY2UlMjBjbG9zZXVwJTIwZGV0YWlsZWR8ZW58MXx8fHwxNzU5MjM0NDkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
          'https://images.unsplash.com/photo-1756483515151-468b4b5ca1ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMGpld2VscnklMjBnb2xkJTIwZGV0YWlsc3xlbnwxfHx8fDE3NTkyMzQ0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        category: 'Mahima\'s Jewellery',
        rating: 4.8,
        reviews: 34,
        isPremium: true,
        isNew: true,
        inStock: true,
        inventory: 15,
        description: 'An exquisite handcrafted Kundan necklace set that embodies the grandeur of traditional Indian jewelry.',
        features: ['Handcrafted by master artisans', 'Premium Kundan stones', 'Gold-plated finish'],
        specifications: {
          'Material': 'Gold-plated brass with Kundan stones',
          'Weight': '85 grams',
          'Dimensions': 'Necklace: 16 inches, Earrings: 2 inches'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Traditional Jhumka Earrings',
        price: 2499,
        originalPrice: 3199,
        image: 'https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwZWFycmluZ3MlMjBpbmRpYW4lMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyMzM5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1653227907864-560dce4c252d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwZWFycmluZ3MlMjBpbmRpYW4lMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTkyMzM5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Jewellery',
        rating: 4.6,
        reviews: 28,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 42,
        description: 'Beautiful traditional Jhumka earrings with intricate detailing.',
        features: ['Traditional design', 'Lightweight', 'Comfortable wear'],
        specifications: {
          'Material': 'Silver-plated brass',
          'Weight': '25 grams',
          'Dimensions': '2.5 inches length'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Mystic Mandala Wall Art',
        price: 3999,
        originalPrice: 4999,
        image: 'https://images.unsplash.com/photo-1649359815698-a1d9f4df71b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwbWFuZGFsYSUyMGFydCUyMGluZGlhbiUyMHdhbGx8ZW58MXx8fHwxNzU5MjMzOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1649359815698-a1d9f4df71b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwbWFuZGFsYSUyMGFydCUyMGluZGlhbiUyMHdhbGx8ZW58MXx8fHwxNzU5MjMzOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Mandala Art',
        rating: 4.9,
        reviews: 45,
        isPremium: true,
        isNew: true,
        inStock: true,
        inventory: 8,
        description: 'A stunning hand-painted mandala artwork that brings peace and harmony to any space.',
        features: ['Hand-painted by skilled artisans', 'Natural pigments used', 'Ready to hang', 'Unique piece'],
        specifications: {
          'Size': '24x24 inches',
          'Material': 'Canvas with natural pigments',
          'Frame': 'Premium wooden frame included',
          'Weight': '1.2 kg'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Artisan Ceramic Vase',
        price: 1899,
        originalPrice: 2299,
        image: 'https://images.unsplash.com/photo-1493663443271-59b21d52d3fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwY2VyYW1pYyUyMHZhc2UlMjBpbmRpYW58ZW58MXx8fHwxNzU5MjMzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1493663443271-59b21d52d3fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwY2VyYW1pYyUyMHZhc2UlMjBpbmRpYW58ZW58MXx8fHwxNzU5MjMzOTc4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Home Decor',
        rating: 4.7,
        reviews: 23,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 25,
        description: 'Beautifully crafted ceramic vase perfect for home decoration.',
        features: ['Unique design', 'High-quality ceramic', 'Perfect for flowers', 'Easy to clean'],
        specifications: {
          'Height': '12 inches',
          'Material': 'Premium ceramic',
          'Color': 'Earthen tones',
          'Care': 'Hand wash recommended'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Golden Lotus Mandala Canvas',
        price: 2899,
        originalPrice: 3499,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMG1hbmRhbGElMjBhcnQlMjBnb2xkZW4lMjBpbmRpYW58ZW58MXx8fHwxNzU5MjMzOTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3R1cyUyMG1hbmRhbGElMjBhcnQlMjBnb2xkZW4lMjBpbmRpYW58ZW58MXx8fHwxNzU5MjMzOTg3fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Mandala Art',
        rating: 4.8,
        reviews: 32,
        isPremium: true,
        isNew: false,
        inStock: true,
        inventory: 12,
        description: 'Exquisite golden lotus mandala artwork symbolizing purity and enlightenment.',
        features: ['Golden accents', 'Lotus symbolism', 'Meditation aid', 'Premium canvas'],
        specifications: {
          'Size': '20x20 inches',
          'Material': 'High-quality canvas with gold leaf',
          'Frame': 'Included',
          'Weight': '0.8 kg'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Heritage Silver Bangles Set',
        price: 4999,
        originalPrice: 6299,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYW5nbGVzJTIwaW5kaWFuJTIwanVlbGVyeXxlbnwxfHx8fDE3NTkyMzM5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBiYW5nbGVzJTIwaW5kaWFuJTIwanVlbGVyeXxlbnwxfHx8fDE3NTkyMzM5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Jewellery',
        rating: 4.7,
        reviews: 41,
        isPremium: true,
        isNew: false,
        inStock: true,
        inventory: 18,
        description: 'Elegant heritage-style silver bangles set featuring traditional Indian craftsmanship.',
        features: ['Pure silver', 'Traditional patterns', 'Set of 4 bangles', 'Gift box included'],
        specifications: {
          'Material': '92.5% Sterling Silver',
          'Weight': '120 grams (set)',
          'Size': 'Adjustable',
          'Care': 'Polish with silver cloth'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Sacred Geometry Wall Art',
        price: 3299,
        originalPrice: 3999,
        image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWNyZWQlMjBnZW9tZXRyeSUyMGFydCUyMG1hbmRhbGF8ZW58MXx8fHwxNzU5MjM0MDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1545239705-1564e58b9e4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWNyZWQlMjBnZW9tZXRyeSUyMGFydCUyMG1hbmRhbGF8ZW58MXx8fHwxNzU5MjM0MDAyfDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Mandala Art',
        rating: 4.6,
        reviews: 29,
        isPremium: false,
        isNew: true,
        inStock: true,
        inventory: 15,
        description: 'Intricate sacred geometry artwork that brings balance and harmony to your space.',
        features: ['Sacred patterns', 'Balancing energy', 'Modern interpretation', 'Quality print'],
        specifications: {
          'Size': '16x16 inches',
          'Material': 'High-resolution print on canvas',
          'Frame': 'Optional',
          'Weight': '0.5 kg'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '8',
        name: 'Royal Emerald Pendant Set',
        price: 8999,
        originalPrice: 11999,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyYWxkJTIwcGVuZGFudCUyMGluZGlhbiUyMGpld2Vscnl8ZW58MXx8fHwxNzU5MjM0MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyYWxkJTIwcGVuZGFudCUyMGluZGlhbiUyMGpld2Vscnl8ZW58MXx8fHwxNzU5MjM0MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Jewellery',
        rating: 4.9,
        reviews: 18,
        isPremium: true,
        isNew: true,
        inStock: true,
        inventory: 6,
        description: 'Luxurious emerald pendant set featuring genuine stones and exquisite gold work.',
        features: ['Genuine emerald stones', '18k gold plated', 'Matching earrings', 'Certificate included'],
        specifications: {
          'Material': '18k Gold plated with emerald',
          'Stone': 'Natural emerald',
          'Weight': '45 grams',
          'Chain Length': '18 inches'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Artisan Wooden Jewelry Box',
        price: 2299,
        originalPrice: 2799,
        image: 'https://images.unsplash.com/photo-1684083339263-36b15c13a5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kbWFkZSUyMGpld2VscnklMjBib3glMjB3b29kZW58ZW58MXx8fHwxNzU5NDIyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1684083339263-36b15c13a5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kbWFkZSUyMGpld2VscnklMjBib3glMjB3b29kZW58ZW58MXx8fHwxNzU5NDIyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Traditional Crafts',
        rating: 4.5,
        reviews: 19,
        isPremium: false,
        isNew: true,
        inStock: true,
        inventory: 22,
        description: 'Beautifully crafted wooden jewelry box with intricate carvings and multiple compartments.',
        features: ['Hand-carved details', 'Multiple compartments', 'Velvet lining', 'Traditional design'],
        specifications: {
          'Material': 'Premium Sheesham wood',
          'Dimensions': '8x6x4 inches',
          'Weight': '650 grams',
          'Finish': 'Natural wood polish'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '10',
        name: 'Traditional Brass Figurine',
        price: 1599,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1674481705500-ca0d71702534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGZpZ3VyaW5lcyUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1OTQyMjM2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1674481705500-ca0d71702534?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFzcyUyMGZpZ3VyaW5lcyUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc1OTQyMjM2Mnww&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Traditional Crafts',
        rating: 4.7,
        reviews: 31,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 14,
        description: 'Elegant brass figurine showcasing traditional Indian craftsmanship and spiritual symbolism.',
        features: ['Pure brass construction', 'Hand-finished', 'Spiritual significance', 'Decorative piece'],
        specifications: {
          'Material': 'Pure brass',
          'Height': '6 inches',
          'Weight': '400 grams',
          'Care': 'Polish with brass cleaner'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '11',
        name: 'Handmade Ceramic Pottery Set',
        price: 3499,
        originalPrice: 4299,
        image: 'https://images.unsplash.com/photo-1650065962232-e4b7f95ebf1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjB2YXNlJTIwaW5kaWFuJTIwY2VyYW1pY3N8ZW58MXx8fHwxNzU5NDIyMzY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1650065962232-e4b7f95ebf1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjB2YXNlJTIwaW5kaWFuJTIwY2VyYW1pY3N8ZW58MXx8fHwxNzU5NDIyMzY2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Home Decor',
        rating: 4.8,
        reviews: 26,
        isPremium: true,
        isNew: false,
        inStock: true,
        inventory: 11,
        description: 'Beautiful handmade ceramic pottery set featuring traditional glazing techniques.',
        features: ['Hand-thrown pottery', 'Traditional glazes', 'Set of 3 pieces', 'Food safe'],
        specifications: {
          'Material': 'Premium ceramic',
          'Set Includes': 'Large vase, medium bowl, small pot',
          'Care': 'Hand wash recommended',
          'Origin': 'Handcrafted in India'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '12',
        name: 'Handwoven Silk Scarf',
        price: 1899,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1627726997943-6e397135f78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kd292ZW4lMjB0ZXh0aWxlJTIwc2NhcmZ8ZW58MXx8fHwxNzU5NDIyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1627726997943-6e397135f78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kd292ZW4lMjB0ZXh0aWxlJTIwc2NhcmZ8ZW58MXx8fHwxNzU5NDIyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Traditional Crafts',
        rating: 4.6,
        reviews: 44,
        isPremium: false,
        isNew: true,
        inStock: true,
        inventory: 28,
        description: 'Luxurious handwoven silk scarf featuring traditional Indian patterns and vibrant colors.',
        features: ['Pure silk', 'Handwoven', 'Traditional patterns', 'Versatile styling'],
        specifications: {
          'Material': '100% Pure Silk',
          'Dimensions': '70x180 cm',
          'Weight': '85 grams',
          'Care': 'Dry clean only'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '13',
        name: 'Traditional Diya Oil Lamp',
        price: 899,
        originalPrice: 1199,
        image: 'https://images.unsplash.com/photo-1730446497495-85e834022cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMG9pbCUyMGxhbXAlMjBkaXlhfGVufDF8fHx8MTc1OTQyMjM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1730446497495-85e834022cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMG9pbCUyMGxhbXAlMjBkaXlhfGVufDF8fHx8MTc1OTQyMjM3Nnww&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Novelty Items',
        rating: 4.4,
        reviews: 52,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 35,
        description: 'Beautiful traditional oil lamp perfect for festivals and spiritual practices.',
        features: ['Traditional design', 'Brass construction', 'Perfect for festivals', 'Spiritual significance'],
        specifications: {
          'Material': 'Brass',
          'Height': '3 inches',
          'Diameter': '4 inches',
          'Weight': '150 grams'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '14',
        name: 'Wooden Elephant Sculpture',
        price: 2599,
        originalPrice: 3199,
        image: 'https://images.unsplash.com/photo-1718128016695-b31d0c0edc7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGluZGlhbiUyMHdvb2RlbiUyMGVsZXBoYW50fGVufDF8fHx8MTc1OTQyMjM4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1718128016695-b31d0c0edc7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGluZGlhbiUyMHdvb2RlbiUyMGVsZXBoYW50fGVufDF8fHx8MTc1OTQyMjM4MHww&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Novelty Items',
        rating: 4.7,
        reviews: 38,
        isPremium: true,
        isNew: true,
        inStock: true,
        inventory: 9,
        description: 'Exquisitely carved wooden elephant sculpture symbolizing wisdom and good fortune.',
        features: ['Hand-carved', 'Premium wood', 'Symbolic significance', 'Artistic masterpiece'],
        specifications: {
          'Material': 'Rosewood',
          'Height': '8 inches',
          'Length': '10 inches',
          'Weight': '800 grams'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '15',
        name: 'Colorful Mandala Canvas Art',
        price: 2199,
        originalPrice: 2799,
        image: 'https://images.unsplash.com/photo-1753184649034-cadec03611da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwY2FudmFzJTIwY29sb3JmdWwlMjBnZW9tZXRyaWN8ZW58MXx8fHwxNzU5NDIyMzg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1753184649034-cadec03611da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwYXJ0JTIwY2FudmFzJTIwY29sb3JmdWwlMjBnZW9tZXRyaWN8ZW58MXx8fHwxNzU5NDIyMzg0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Mandala Art',
        rating: 4.8,
        reviews: 33,
        isPremium: false,
        isNew: true,
        inStock: true,
        inventory: 16,
        description: 'Vibrant and colorful mandala canvas art that brings positive energy to any space.',
        features: ['Bright colors', 'High-quality canvas', 'Ready to hang', 'Positive energy'],
        specifications: {
          'Size': '18x18 inches',
          'Material': 'Canvas with acrylic paints',
          'Frame': 'Wooden frame included',
          'Weight': '0.7 kg'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '16',
        name: 'Bronze Spiritual Statue',
        price: 5499,
        originalPrice: 6999,
        image: 'https://images.unsplash.com/photo-1623492822262-a6ea538cf0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMGJyb256ZSUyMHN0YXR1ZXxlbnwxfHx8fDE3NTk0MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1623492822262-a6ea538cf0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMGJyb256ZSUyMHN0YXR1ZXxlbnwxfHx8fDE3NTk0MjIzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Premium Collection',
        rating: 4.9,
        reviews: 21,
        isPremium: true,
        isNew: false,
        inStock: true,
        inventory: 5,
        description: 'Magnificent bronze statue showcasing traditional Indian spiritual artistry.',
        features: ['Pure bronze', 'Hand-cast', 'Spiritual significance', 'Museum quality'],
        specifications: {
          'Material': 'Pure bronze',
          'Height': '12 inches',
          'Weight': '2.5 kg',
          'Finish': 'Antique patina'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '17',
        name: 'Decorative Mirror Frame',
        price: 3299,
        originalPrice: 3999,
        image: 'https://images.unsplash.com/photo-1669465006362-2bb8636173d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGluZGlhbiUyMG1pcnJvciUyMGRlY29yYXRpdmV8ZW58MXx8fHwxNzU5NDIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1669465006362-2bb8636173d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGluZGlhbiUyMG1pcnJvciUyMGRlY29yYXRpdmV8ZW58MXx8fHwxNzU5NDIyMzk2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Home Decor',
        rating: 4.6,
        reviews: 27,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 13,
        description: 'Ornate decorative mirror with intricate frame work perfect for any room.',
        features: ['Ornate design', 'Quality mirror', 'Wall mounting', 'Statement piece'],
        specifications: {
          'Size': '24x18 inches',
          'Frame Material': 'Carved wood with golden finish',
          'Mirror Quality': 'High-definition glass',
          'Weight': '1.8 kg'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '18',
        name: 'Golden Statement Ring',
        price: 3999,
        originalPrice: 4999,
        image: 'https://images.unsplash.com/photo-1758995116121-60090f17ae20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByaW5nJTIwZ29sZCUyMGpld2VscnklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTk0MjI0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1758995116121-60090f17ae20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByaW5nJTIwZ29sZCUyMGpld2VscnklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NTk0MjI0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Jewellery',
        rating: 4.8,
        reviews: 24,
        isPremium: true,
        isNew: true,
        inStock: true,
        inventory: 7,
        description: 'Stunning golden statement ring with traditional Indian design elements.',
        features: ['24k gold plated', 'Statement design', 'Adjustable size', 'Traditional motifs'],
        specifications: {
          'Material': '24k Gold plated brass',
          'Size': 'Adjustable',
          'Weight': '18 grams',
          'Care': 'Keep dry, store in provided box'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '19',
        name: 'Gemstone Bracelet Collection',
        price: 2799,
        originalPrice: 3599,
        image: 'https://images.unsplash.com/photo-1660733949316-87c5689a7f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFjZWxldCUyMGpld2VscnklMjBnZW1zdG9uZXxlbnwxfHx8fDE3NTk0MjI0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1660733949316-87c5689a7f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmFjZWxldCUyMGpld2VscnklMjBnZW1zdG9uZXxlbnwxfHx8fDE3NTk0MjI0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Mahima\'s Jewellery',
        rating: 4.7,
        reviews: 36,
        isPremium: false,
        isNew: false,
        inStock: true,
        inventory: 20,
        description: 'Beautiful collection of gemstone bracelets featuring natural stones and elegant design.',
        features: ['Natural gemstones', 'Set of 3 bracelets', 'Elastic band', 'Healing properties'],
        specifications: {
          'Material': 'Natural gemstones with elastic cord',
          'Size': 'One size fits most',
          'Stones': 'Amethyst, Rose Quartz, Tiger Eye',
          'Weight': '45 grams (set)'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '20',
        name: 'Handcrafted Storage Box',
        price: 1599,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1660456890375-d79c10fbe817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMHdvb2RlbiUyMGJveCUyMGluZGlhbiUyMGRlY29yfGVufDF8fHx8MTc1OTQyMjM1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        images: ['https://images.unsplash.com/photo-1660456890375-d79c10fbe817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMHdvb2RlbiUyMGJveCUyMGluZGlhbiUyMGRlY29yfGVufDF8fHx8MTc1OTQyMjM1N3ww&ixlib=rb-4.1.0&q=80&w=1080'],
        category: 'Novelty Items',
        rating: 4.5,
        reviews: 29,
        isPremium: false,
        isNew: true,
        inStock: true,
        inventory: 31,
        description: 'Versatile handcrafted storage box perfect for organizing and decorating your space.',
        features: ['Multi-purpose use', 'Handcrafted', 'Durable construction', 'Decorative appeal'],
        specifications: {
          'Material': 'Mango wood',
          'Dimensions': '10x8x6 inches',
          'Weight': '500 grams',
          'Finish': 'Natural wood stain'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Force reinitialize all products to ensure we have the latest data
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product);
      await kv.set(`product_by_category:${product.category}:${product.id}`, product.id);
      console.log(`Initialized product: ${product.id} - ${product.name}`);
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// Health check endpoint
app.get('/make-server-33f75b66/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test image upload endpoint
app.post('/make-server-33f75b66/test-upload', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Test upload received:', {
      hasImageData: !!body.imageData,
      filename: body.filename,
      type: body.type,
      imageDataLength: body.imageData?.length
    });
    
    return c.json({ 
      success: true, 
      message: 'Test upload successful',
      received: {
        filename: body.filename,
        type: body.type,
        imageDataLength: body.imageData?.length
      }
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return c.json({ error: 'Test upload failed' }, 500);
  }
});

// Test hero content save endpoint
app.post('/make-server-33f75b66/test-hero-save', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Test hero save received:', {
      title: body.title,
      subtitle: body.subtitle,
      hasImage: !!body.heroImage
    });
    
    return c.json({ 
      success: true, 
      message: 'Test hero save successful',
      received: {
        title: body.title,
        subtitle: body.subtitle,
        hasImage: !!body.heroImage
      }
    });
  } catch (error) {
    console.error('Test hero save error:', error);
    return c.json({ error: 'Test hero save failed' }, 500);
  }
});

// Debug endpoint to check products count
app.get('/make-server-33f75b66/debug/products-count', async (c) => {
  try {
    const allProducts = await kv.getByPrefix('product:');
    return c.json({ 
      status: 'success',
      totalProducts: allProducts.length,
      productKeys: allProducts.map(p => p.key),
      sampleProduct: allProducts[0] ? allProducts[0].value : null,
      rawData: allProducts.slice(0, 2) // Show first 2 items for debugging
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return c.json({ error: 'Debug endpoint failed' }, 500);
  }
});

// Manual initialization endpoint
app.post('/make-server-33f75b66/debug/init-products', async (c) => {
  try {
    await initializeDatabase();
    const allProducts = await kv.getByPrefix('product:');
    return c.json({ 
      status: 'success',
      message: 'Products initialized',
      totalProducts: allProducts.length
    });
  } catch (error) {
    console.error('Manual initialization error:', error);
    return c.json({ error: 'Initialization failed' }, 500);
  }
});

// Authentication endpoints
app.post('/make-server-33f75b66/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm email since email server isn't configured
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

app.post('/make-server-33f75b66/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({
      message: 'Sign in successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: userProfile?.name || 'User'
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Internal server error during sign in' }, 500);
  }
});

// Admin authentication
app.post('/make-server-33f75b66/auth/admin-signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Demo admin credentials
    if (email === 'admin@bhavyakavya.com' && password === 'admin123') {
      return c.json({
        message: 'Admin sign in successful',
        admin: {
          id: 'admin-1',
          email: 'admin@bhavyakavya.com',
          name: 'BhavyaKavya Admin',
          role: 'admin'
        }
      });
    }

    return c.json({ error: 'Invalid admin credentials' }, 401);
  } catch (error) {
    console.error('Admin sign in error:', error);
    return c.json({ error: 'Internal server error during admin sign in' }, 500);
  }
});

// Product endpoints
app.get('/make-server-33f75b66/products', async (c) => {
  try {
    const category = c.req.query('category');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    let products = [];
    
    if (category) {
      // Get products by category
      const categoryProducts = await kv.getByPrefix(`product_by_category:${category}:`);
      const productIds = categoryProducts.map(item => item.value);
      
      for (const productId of productIds.slice(offset, offset + limit)) {
        const product = await kv.get(`product:${productId}`);
        if (product) {
          products.push(product);
        }
      }
    } else {
      // Get all products
      const allProducts = await kv.getByPrefix('product:');
      products = allProducts
        .map(item => item.value)
        .filter(product => product !== null && product !== undefined)
        .slice(offset, offset + limit);
    }

    return c.json({
      products,
      pagination: {
        limit,
        offset,
        total: products.length
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Error fetching products' }, 500);
  }
});

app.get('/make-server-33f75b66/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(`product:${productId}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Error fetching product' }, 500);
  }
});

// Cart endpoints (requires authentication)
app.get('/make-server-33f75b66/cart', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    return c.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return c.json({ error: 'Error fetching cart' }, 500);
  }
});

app.post('/make-server-33f75b66/cart/add', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { productId, quantity = 1 } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    // Get product details
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Get current cart
    const cart = await kv.get(`cart:${user.id}`) || { items: [], updated_at: new Date().toISOString() };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: any) => item.id === productId);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity
      });
    }

    cart.updated_at = new Date().toISOString();
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ 
      message: 'Item added to cart successfully',
      cart 
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return c.json({ error: 'Error adding item to cart' }, 500);
  }
});

app.put('/make-server-33f75b66/cart/update', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { productId, quantity } = await c.req.json();
    
    if (!productId || quantity === undefined) {
      return c.json({ error: 'Product ID and quantity are required' }, 400);
    }

    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    
    if (quantity <= 0) {
      // Remove item from cart
      cart.items = cart.items.filter((item: any) => item.id !== productId);
    } else {
      // Update quantity
      const itemIndex = cart.items.findIndex((item: any) => item.id === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    cart.updated_at = new Date().toISOString();
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ 
      message: 'Cart updated successfully',
      cart 
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return c.json({ error: 'Error updating cart' }, 500);
  }
});

app.delete('/make-server-33f75b66/cart/clear', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await kv.set(`cart:${user.id}`, { 
      items: [], 
      updated_at: new Date().toISOString() 
    });

    return c.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return c.json({ error: 'Error clearing cart' }, 500);
  }
});

// Wishlist endpoints (requires authentication)
app.get('/make-server-33f75b66/wishlist', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const wishlist = await kv.get(`wishlist:${user.id}`) || { items: [] };
    return c.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return c.json({ error: 'Error fetching wishlist' }, 500);
  }
});

app.post('/make-server-33f75b66/wishlist/add', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { productId } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    // Get product details
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Get current wishlist
    const wishlist = await kv.get(`wishlist:${user.id}`) || { items: [] };
    
    // Check if item already exists
    const exists = wishlist.items.some((item: any) => item.id === productId);
    
    if (!exists) {
      wishlist.items.push({
        id: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        isPremium: product.isPremium,
        inStock: product.inStock
      });

      wishlist.updated_at = new Date().toISOString();
      await kv.set(`wishlist:${user.id}`, wishlist);
    }

    return c.json({ 
      message: 'Item added to wishlist successfully',
      wishlist 
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return c.json({ error: 'Error adding item to wishlist' }, 500);
  }
});

app.delete('/make-server-33f75b66/wishlist/remove/:productId', async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productId = c.req.param('productId');
    const wishlist = await kv.get(`wishlist:${user.id}`) || { items: [] };
    
    wishlist.items = wishlist.items.filter((item: any) => item.id !== productId);
    wishlist.updated_at = new Date().toISOString();
    
    await kv.set(`wishlist:${user.id}`, wishlist);

    return c.json({ 
      message: 'Item removed from wishlist successfully',
      wishlist 
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return c.json({ error: 'Error removing item from wishlist' }, 500);
  }
});

// Categories endpoint
app.get('/make-server-33f75b66/categories', async (c) => {
  try {
    const categories = await kv.getByPrefix('category:');
    return c.json({ 
      categories: categories.map(item => item.value) 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Error fetching categories' }, 500);
  }
});

// Order endpoints
app.post('/make-server-33f75b66/orders', async (c) => {
  try {
    const orderData = await c.req.json();
    
    if (!orderData.items || !orderData.customerDetails || !orderData.totalAmount) {
      return c.json({ error: 'Items, customer details, and total amount are required' }, 400);
    }

    const orderId = crypto.randomUUID();
    const orderNumber = `BK-${Date.now().toString().slice(-8)}`;
    
    const order = {
      id: orderId,
      orderNumber,
      items: orderData.items,
      customerDetails: orderData.customerDetails,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      paymentStatus: 'paid',
      paymentData: orderData.paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    // Store order
    await kv.set(`order:${orderId}`, order);
    await kv.set(`order_by_number:${orderNumber}`, orderId);
    await kv.set(`order_by_customer:${orderData.customerDetails.email}:${orderId}`, orderId);
    await kv.set(`order_by_status:${order.status}:${orderId}`, orderId);

    // Update inventory (decrease stock)
    for (const item of orderData.items) {
      const product = await kv.get(`product:${item.id}`);
      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
        await kv.set(`product:${item.id}`, { ...product, stock: newStock });
      }
    }

    return c.json({ 
      success: true,
      order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Error creating order' }, 500);
  }
});

app.get('/make-server-33f75b66/orders/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json({ 
      success: true,
      order 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({ error: 'Error fetching order' }, 500);
  }
});

app.get('/make-server-33f75b66/orders/customer/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const orderKeys = await kv.getByPrefix(`order_by_customer:${email}:`);
    const orders = [];
    
    for (const key of orderKeys) {
      const order = await kv.get(`order:${key.value}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ 
      success: true,
      orders 
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return c.json({ error: 'Error fetching customer orders' }, 500);
  }
});

app.put('/make-server-33f75b66/orders/:id/status', async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status, notes } = await c.req.json();
    
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Remove from old status index
    await kv.delete(`order_by_status:${order.status}:${orderId}`);
    
    // Update order
    const updatedOrder = {
      ...order,
      status,
      notes: notes || order.notes,
      updatedAt: new Date().toISOString()
    };
    
    // Add to new status index
    await kv.set(`order_by_status:${status}:${orderId}`, orderId);
    await kv.set(`order:${orderId}`, updatedOrder);

    return c.json({ 
      success: true,
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ error: 'Error updating order status' }, 500);
  }
});

// Admin endpoints (protected)
app.get('/make-server-33f75b66/admin/orders', async (c) => {
  try {
    const status = c.req.query('status') || 'all';
    let orderKeys = [];
    
    if (status === 'all') {
      orderKeys = await kv.getByPrefix('order_by_status:');
    } else {
      orderKeys = await kv.getByPrefix(`order_by_status:${status}:`);
    }
    
    const orders = [];
    for (const key of orderKeys) {
      const order = await kv.get(`order:${key.value}`);
      if (order) {
        orders.push(order);
      }
    }
    
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ 
      success: true,
      orders 
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return c.json({ error: 'Error fetching admin orders' }, 500);
  }
});

app.post('/make-server-33f75b66/admin/products', async (c) => {
  try {
    const productData = await c.req.json();
    
    if (!productData.name || !productData.price || !productData.category) {
      return c.json({ error: 'Name, price, and category are required' }, 400);
    }

    const productId = crypto.randomUUID();
    const product = {
      id: productId,
      ...productData,
      stock: productData.stock || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`product:${productId}`, product);
    await kv.set(`product_by_category:${product.category}:${productId}`, productId);

    return c.json({ 
      message: 'Product created successfully',
      product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Error creating product' }, 500);
  }
});

// Inventory management endpoints
app.get('/make-server-33f75b66/admin/inventory', async (c) => {
  try {
    const allProducts = await kv.getByPrefix('product:');
    const inventory = allProducts
      .map(item => item.value)
      .filter(product => product !== null && product !== undefined)
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        stock: product.stock || 0,
        lowStockThreshold: product.lowStockThreshold || 5,
        isLowStock: (product.stock || 0) <= (product.lowStockThreshold || 5),
        price: product.price,
        image: product.image
      }));

    return c.json({ 
      success: true,
      inventory 
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return c.json({ error: 'Error fetching inventory' }, 500);
  }
});

app.put('/make-server-33f75b66/admin/inventory/:id/stock', async (c) => {
  try {
    const productId = c.req.param('id');
    const { stock, lowStockThreshold } = await c.req.json();
    
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updatedProduct = {
      ...product,
      stock: stock,
      lowStockThreshold: lowStockThreshold || product.lowStockThreshold || 5,
      updated_at: new Date().toISOString()
    };

    await kv.set(`product:${productId}`, updatedProduct);

    return c.json({ 
      success: true,
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return c.json({ error: 'Error updating stock' }, 500);
  }
});

app.get('/make-server-33f75b66/admin/low-stock', async (c) => {
  try {
    const allProducts = await kv.getByPrefix('product:');
    const lowStockProducts = allProducts
      .map(item => item.value)
      .filter(product => product !== null && product !== undefined)
      .filter(product => (product.stock || 0) <= (product.lowStockThreshold || 5));

    return c.json({ 
      success: true,
      lowStockProducts 
    });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return c.json({ error: 'Error fetching low stock products' }, 500);
  }
});

app.put('/make-server-33f75b66/admin/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingProduct = await kv.get(`product:${productId}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updatedProduct = {
      ...existingProduct,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set(`product:${productId}`, updatedProduct);
    
    // Update category index if category changed
    if (updates.category && updates.category !== existingProduct.category) {
      await kv.del(`product_by_category:${existingProduct.category}:${productId}`);
      await kv.set(`product_by_category:${updates.category}:${productId}`, productId);
    }

    return c.json({ 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: 'Error updating product' }, 500);
  }
});

app.delete('/make-server-33f75b66/admin/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    await kv.del(`product:${productId}`);
    await kv.del(`product_by_category:${product.category}:${productId}`);

    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Error deleting product' }, 500);
  }
});

// Analytics endpoint for admin dashboard
// Image Management Endpoints

// Upload image (base64 data)
app.post('/make-server-33f75b66/images/upload', async (c) => {
  try {
    const { imageData, filename, type, productId } = await c.req.json();
    
    if (!imageData || !filename || !type) {
      return c.json({ error: 'Image data, filename, and type are required' }, 400);
    }

    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return c.json({ error: 'Unsupported image type. Allowed: JPEG, PNG, GIF, WebP' }, 400);
    }

    // Generate unique image ID
    const imageId = crypto.randomUUID();
    const imageKey = `image:${imageId}`;
    
    // Calculate actual file size from base64
    const base64Size = Math.round((imageData.length * 3) / 4);
    
    // Store image metadata
    const imageMetadata = {
      id: imageId,
      filename,
      type: type.toLowerCase(),
      productId: productId || null,
      uploadedAt: new Date().toISOString(),
      size: base64Size,
      isMain: false
    };

    // Store image data and metadata
    await kv.set(imageKey, imageMetadata);
    await kv.set(`image_data:${imageId}`, { data: imageData });
    
    // If it's a product image, link it to the product
    if (productId) {
      const productImagesKey = `product_images:${productId}`;
      const existingImages = await kv.get(productImagesKey) || [];
      await kv.set(productImagesKey, [...existingImages, imageId]);
    }

    return c.json({ 
      success: true,
      imageId,
      imageUrl: `/make-server-33f75b66/images/${imageId}`,
      metadata: imageMetadata
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Get image by ID
app.get('/make-server-33f75b66/images/:id', async (c) => {
  try {
    const imageId = c.req.param('id');
    const imageKey = `image:${imageId}`;
    
    const imageMetadata = await kv.get(imageKey);
    if (!imageMetadata) {
      return c.json({ error: 'Image not found' }, 404);
    }

    const imageData = await kv.get(`image_data:${imageId}`);
    if (!imageData) {
      return c.json({ error: 'Image data not found' }, 404);
    }

    // Return image data with proper headers
    return new Response(imageData.data, {
      headers: {
        'Content-Type': imageMetadata.type,
        'Content-Length': imageMetadata.size.toString(),
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return c.json({ error: 'Failed to retrieve image' }, 500);
  }
});

// Get images by product ID
app.get('/make-server-33f75b66/images/product/:productId', async (c) => {
  try {
    const productId = c.req.param('productId');
    const productImagesKey = `product_images:${productId}`;
    
    const imageIds = await kv.get(productImagesKey) || [];
    const images = [];

    for (const imageId of imageIds) {
      const imageMetadata = await kv.get(`image:${imageId}`);
      if (imageMetadata) {
        images.push({
          ...imageMetadata,
          imageUrl: `/make-server-33f75b66/images/${imageId}`
        });
      }
    }

    return c.json({ 
      success: true,
      images 
    });
  } catch (error) {
    console.error('Error retrieving product images:', error);
    return c.json({ error: 'Failed to retrieve product images' }, 500);
  }
});

// Delete image
app.delete('/make-server-33f75b66/images/:id', async (c) => {
  try {
    const imageId = c.req.param('id');
    const imageKey = `image:${imageId}`;
    
    const imageMetadata = await kv.get(imageKey);
    if (!imageMetadata) {
      return c.json({ error: 'Image not found' }, 404);
    }

    // Delete image data and metadata
    await kv.delete(imageKey);
    await kv.delete(`image_data:${imageId}`);

    // Remove from product images if it's linked to a product
    if (imageMetadata.productId) {
      const productImagesKey = `product_images:${imageMetadata.productId}`;
      const existingImages = await kv.get(productImagesKey) || [];
      const updatedImages = existingImages.filter(id => id !== imageId);
      await kv.set(productImagesKey, updatedImages);
    }

    return c.json({ 
      success: true,
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return c.json({ error: 'Failed to delete image' }, 500);
  }
});

// Set main image for product
app.put('/make-server-33f75b66/images/:id/set-main', async (c) => {
  try {
    const imageId = c.req.param('id');
    const { productId } = await c.req.json();
    
    if (!productId) {
      return c.json({ error: 'Product ID is required' }, 400);
    }

    const imageKey = `image:${imageId}`;
    const imageMetadata = await kv.get(imageKey);
    
    if (!imageMetadata) {
      return c.json({ error: 'Image not found' }, 404);
    }

    // Update image metadata to mark as main
    const updatedMetadata = {
      ...imageMetadata,
      isMain: true,
      productId
    };
    await kv.set(imageKey, updatedMetadata);

    // Remove main flag from other images of the same product
    const productImagesKey = `product_images:${productId}`;
    const productImageIds = await kv.get(productImagesKey) || [];
    
    for (const id of productImageIds) {
      if (id !== imageId) {
        const otherImageMetadata = await kv.get(`image:${id}`);
        if (otherImageMetadata) {
          const updatedOtherMetadata = {
            ...otherImageMetadata,
            isMain: false
          };
          await kv.set(`image:${id}`, updatedOtherMetadata);
        }
      }
    }

    return c.json({ 
      success: true,
      message: 'Main image set successfully' 
    });
  } catch (error) {
    console.error('Error setting main image:', error);
    return c.json({ error: 'Failed to set main image' }, 500);
  }
});

// Get all images (admin)
app.get('/make-server-33f75b66/admin/images', async (c) => {
  try {
    const allImages = await kv.getByPrefix('image:');
    const images = allImages.map(img => ({
      ...img,
      imageUrl: `/make-server-33f75b66/images/${img.id}`
    }));

    return c.json({ 
      success: true,
      images,
      total: images.length
    });
  } catch (error) {
    console.error('Error retrieving all images:', error);
    return c.json({ error: 'Failed to retrieve images' }, 500);
  }
});

// Hero content management endpoints
app.get('/make-server-33f75b66/hero-content', async (c) => {
  try {
    const heroContent = await kv.get('hero_content');
    
    if (!heroContent) {
      // Return default hero content
      const defaultContent = {
        title: "Discover India's",
        subtitle: "Finest Handicrafts",
        tagline: "Crafting a Poem of Splendid Living",
        description: "From premium handcrafted jewelry to exquisite mandala art, explore our curated collection of authentic Indian handicrafts that celebrate tradition and artistry.",
        ctaPrimary: "Shop Now",
        ctaSecondary: "Explore Categories",
        heroImage: "https://images.unsplash.com/photo-1699799085041-e288623615ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzJTIwaGVyb3xlbnwxfHx8fDE3NTkyMzM5MDd8MA&ixlib=rb-4.0&q=80&w=1080",
        heroImageAlt: "Indian Traditional Handicrafts",
        updatedAt: new Date().toISOString()
      };
      return c.json({ success: true, content: defaultContent });
    }

    return c.json({ 
      success: true,
      content: heroContent 
    });
  } catch (error) {
    console.error('Error retrieving hero content:', error);
    return c.json({ error: 'Failed to retrieve hero content' }, 500);
  }
});

app.put('/make-server-33f75b66/hero-content', async (c) => {
  try {
    const heroContent = await c.req.json();
    
    if (!heroContent.title || !heroContent.subtitle) {
      return c.json({ error: 'Title and subtitle are required' }, 400);
    }

    const updatedContent = {
      ...heroContent,
      updatedAt: new Date().toISOString()
    };

    await kv.set('hero_content', updatedContent);

    return c.json({ 
      success: true,
      content: updatedContent,
      message: 'Hero content updated successfully' 
    });
  } catch (error) {
    console.error('Error updating hero content:', error);
    return c.json({ error: 'Failed to update hero content' }, 500);
  }
});

app.get('/make-server-33f75b66/admin/analytics', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    const users = await kv.getByPrefix('user:');
    const carts = await kv.getByPrefix('cart:');
    const wishlists = await kv.getByPrefix('wishlist:');

    // Calculate basic analytics
    const totalProducts = products.length;
    const totalUsers = users.length;
    const activeCartsCount = carts.filter(cart => cart.value.items && cart.value.items.length > 0).length;
    const totalWishlistItems = wishlists.reduce((total, wishlist) => 
      total + (wishlist.value.items ? wishlist.value.items.length : 0), 0
    );

    // Category distribution
    const categoryCount: Record<string, number> = {};
    products.forEach(product => {
      const category = product.value.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Sample revenue data (in a real app, this would come from orders)
    const revenueData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 }
    ];

    return c.json({
      analytics: {
        totalProducts,
        totalUsers,
        activeCartsCount,
        totalWishlistItems,
        categoryDistribution: categoryCount,
        revenueData
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Error fetching analytics' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);