import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export function ImageUploadTest() {
  const [isUploading, setIsUploading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('https://bqeilonnsefbdoyiirsc.supabase.co/functions/v1/make-server-33f75b66/health');
      const data = await response.json();
      console.log('Backend health check:', data);
      setTestResult(`Backend is ${data.status} - ${data.timestamp}`);
      toast.success('Backend connection successful!');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setTestResult(`Backend connection failed: ${error}`);
      toast.error('Backend connection failed!');
    }
  };

  const testImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      console.log('Testing image upload with file:', file);
      
      // Convert to base64
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const base64Data = dataUrl.split(',')[1];
      console.log('Base64 data length:', base64Data.length);
      
      // Test with simple endpoint first
      const testResponse = await fetch('https://bqeilonnsefbdoyiirsc.supabase.co/functions/v1/make-server-33f75b66/test-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZWlsb25uc2VmYmRveWlpcnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjAzNDUsImV4cCI6MjA3NDk5NjM0NX0.I_0N3jfa7VWn8W8P-pHd-U9HNObzGuLqgzRVsPXzt00`
        },
        body: JSON.stringify({
          imageData: base64Data,
          filename: file.name,
          type: file.type
        })
      });
      
      const testData = await testResponse.json();
      console.log('Test upload response:', testData);
      
      if (testData.success) {
        setTestResult(`Test upload successful: ${JSON.stringify(testData.received)}`);
        toast.success('Test upload successful!');
      } else {
        setTestResult(`Test upload failed: ${testData.error}`);
        toast.error('Test upload failed!');
      }
    } catch (error) {
      console.error('Test upload error:', error);
      setTestResult(`Test upload error: ${error}`);
      toast.error('Test upload error!');
    } finally {
      setIsUploading(false);
    }
  };

  const testHeroSave = async () => {
    try {
      console.log('Testing hero content save...');
      
      const testHeroData = {
        title: "Test Title",
        subtitle: "Test Subtitle",
        tagline: "Test Tagline",
        description: "Test Description",
        ctaPrimary: "Test CTA",
        ctaSecondary: "Test CTA 2",
        heroImage: "https://example.com/test.jpg",
        heroImageAlt: "Test Image"
      };
      
      const testResponse = await fetch('https://bqeilonnsefbdoyiirsc.supabase.co/functions/v1/make-server-33f75b66/test-hero-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZWlsb25uc2VmYmRveWlpcnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjAzNDUsImV4cCI6MjA3NDk5NjM0NX0.I_0N3jfa7VWn8W8P-pHd-U9HNObzGuLqgzRVsPXzt00`
        },
        body: JSON.stringify(testHeroData)
      });
      
      const testData = await testResponse.json();
      console.log('Test hero save response:', testData);
      
      if (testData.success) {
        setTestResult(`Test hero save successful: ${JSON.stringify(testData.received)}`);
        toast.success('Test hero save successful!');
      } else {
        setTestResult(`Test hero save failed: ${testData.error}`);
        toast.error('Test hero save failed!');
      }
    } catch (error) {
      console.error('Test hero save error:', error);
      setTestResult(`Test hero save error: ${error}`);
      toast.error('Test hero save error!');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      testImageUpload(file);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Image Upload Debug</h3>
      
      <div className="space-y-2">
        <Button onClick={testBackendConnection}>
          Test Backend Connection
        </Button>
        <Button onClick={testHeroSave} variant="outline">
          Test Hero Save
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label>Test Image Upload</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
      </div>
      
      {testResult && (
        <div className="p-2 bg-muted rounded text-sm">
          <strong>Result:</strong> {testResult}
        </div>
      )}
      
      {isUploading && (
        <div className="text-sm text-muted-foreground">
          Testing upload...
        </div>
      )}
    </div>
  );
}
