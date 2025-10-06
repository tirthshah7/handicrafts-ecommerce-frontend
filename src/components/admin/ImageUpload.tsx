import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { LocalImageService, type ImageUploadResult } from '../../services/localImageService';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageChange: (url: string) => void;
  currentImage?: string;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
}

export function ImageUpload({ 
  onImageChange, 
  currentImage, 
  placeholder = "Enter image URL or upload file",
  showPreview = true,
  className = ""
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result: ImageUploadResult = await LocalImageService.uploadImage(file);
      
      if (result.success && result.url) {
        setImageUrl(result.url);
        setPreviewUrl(result.url);
        onImageChange(result.url);
        toast.success('Image uploaded successfully!');
      } else {
        console.error('Upload failed:', result.error);
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
  };

  const handlePreview = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    if (LocalImageService.isValidImageUrl(imageUrl)) {
      try {
        const result = await LocalImageService.loadImageFromUrl(imageUrl);
        if (result.success) {
          setPreviewUrl(imageUrl);
          onImageChange(imageUrl);
          toast.success('Image loaded successfully!');
        } else {
          toast.error(result.error || 'Failed to load image');
        }
      } catch (error) {
        toast.error('Invalid image URL');
      }
    } else {
      toast.error('Please enter a valid image URL');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setPreviewUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image URL Input */}
      <div className="space-y-2">
        <Label>Image URL</Label>
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button 
            onClick={handlePreview} 
            variant="outline"
            disabled={isUploading || !imageUrl.trim()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Or Upload File</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={isUploading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {previewUrl && (
            <Button 
              onClick={clearImage}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {showPreview && previewUrl && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => {
                toast.error('Failed to load image preview');
                setPreviewUrl('');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageGallery({ images, onImagesChange, maxImages = 4 }: ImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    try {
      const result = await LocalImageService.uploadImage(file);
      
      if (result.success && result.url) {
        onImagesChange([...images, result.url]);
        toast.success('Image added successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => handleFileUpload(file));
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Additional Images ({images.length}/{maxImages})</Label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            disabled={isUploading || images.length >= maxImages}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Add Images'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: maxImages }).map((_, index) => (
          <div key={index} className="relative w-full h-20 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
            {images[index] ? (
              <>
                <img 
                  src={images[index]} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={() => removeImage(index)}
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
