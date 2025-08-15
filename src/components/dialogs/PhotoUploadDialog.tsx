import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoUploaded: () => void;
}

const PhotoUploadDialog = ({ open, onOpenChange, onPhotoUploaded }: PhotoUploadDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadPhoto = async () => {
    if (!file || !user) return;
    
    setLoading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('user_media')
        .insert({
          user_id: user.id,
          url: urlData.publicUrl,
          media_type: 'image',
          caption: caption || null,
          is_private: false
        });

      if (dbError) throw dbError;

      toast.success('Photo uploaded successfully!');
      onPhotoUploaded();
      onOpenChange(false);
      
      // Reset form
      setFile(null);
      setCaption('');
      setPreview(null);
    } catch (error) {
      toast.error('Error uploading photo');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload size={20} className="text-primary" />
            <span>{t('gallery.upload')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Select Photo</Label>
            <div className="border-2 border-dashed border-border-light rounded-lg p-6 text-center">
              {preview ? (
                <div className="space-y-3">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Image size={48} className="mx-auto text-muted-foreground" />
                  <div>
                    <Button variant="outline" asChild>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select an image file to upload
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your photo..."
              className="resize-none"
            />
          </div>

          {/* Upload Button */}
          <Button 
            onClick={uploadPhoto}
            disabled={!file || loading}
            className="btn-premium w-full"
          >
            {loading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;