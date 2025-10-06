// Local Image Service for Development
// This service handles image uploads locally and integrates with backend API

import { api } from '../utils/api';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  file?: File;
  imageId?: string;
}

export class LocalImageService {
  // Convert file to data URL for preview
  static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Upload image (tries backend first, falls back to local)
  static async uploadImage(file: File, productId?: string): Promise<ImageUploadResult> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return {
          success: false,
          error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'Image size must be less than 5MB'
        };
      }

      // Try backend upload first (with quick timeout)
      try {
        console.log('Attempting backend upload...');
        
        const dataUrl = await this.fileToDataUrl(file);
        const base64Data = dataUrl.split(',')[1];
        
        // Quick timeout for backend (5 seconds)
        const uploadPromise = api.uploadImage(
          base64Data,
          file.name,
          file.type,
          productId
        );

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Backend timeout')), 5000);
        });

        const response = await Promise.race([uploadPromise, timeoutPromise]) as any;

        if (response.success && response.data) {
          console.log('Backend upload successful');
          return {
            success: true,
            url: response.data.imageUrl,
            imageId: response.data.imageId,
            file: file
          };
        }
      } catch (backendError) {
        console.log('Backend upload failed, using local fallback:', backendError);
      }

      // Fallback to local upload
      console.log('Using local upload fallback...');
      return await this.uploadImageLocal(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Failed to upload image'
      };
    }
  }

  // Upload image locally (fallback)
  static async uploadImageLocal(file: File): Promise<ImageUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please select a valid image file'
        };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'Image size must be less than 5MB'
        };
      }

      // Convert to data URL for local storage
      const dataUrl = await this.fileToDataUrl(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        url: dataUrl,
        file: file
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process image'
      };
    }
  }

  // Generate thumbnail
  static generateThumbnail(dataUrl: string, size: number = 150): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = size;
        canvas.height = size;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    });
  }

  // Validate image URL
  static isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  }

  // Load image from URL
  static async loadImageFromUrl(url: string): Promise<ImageUploadResult> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to load image from URL'
        };
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      return {
        success: true,
        url: url,
        file: file
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid image URL'
      };
    }
  }
}
