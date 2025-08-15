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
  isProfilePhoto?: boolean; // New prop to indicate if this is for profile picture
}

const PhotoUploadDialog = ({ open, onOpenChange, onPhotoUploaded, isProfilePhoto = false }: PhotoUploadDialogProps) => {
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
      const bucketName = isProfilePhoto ? 'avatars' : 'media';
      const fileName = isProfilePhoto ? `${user.id}.${fileExt}` : `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          upsert: isProfilePhoto // Overwrite existing avatar if it's a profile photo
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (isProfilePhoto) {
        // Update profile avatar_url
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', user.id);

        if (profileError) throw profileError;
        toast.success('Profile picture updated successfully!');
      } else {
        // Save to user_media for gallery
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
      }

      onPhotoUploaded();
      onOpenChange(false);
      
      // Reset form
      setFile(null);
      setCaption('');
      setPreview(null);
    } catch (error) {
      toast.error(isProfilePhoto ? 'Error updating profile picture' : 'Error uploading photo');
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
            <span>{isProfilePhoto ? 'Update Profile Picture' : t('gallery.upload')}</span>
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

          {/* Caption - only show for gallery photos */}
          {!isProfilePhoto && (
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
          )}

          {/* Upload Button */}
          <Button 
            onClick={uploadPhoto}
            disabled={!file || loading}
            className="btn-premium w-full"
          >
            {loading ? 'Uploading...' : (isProfilePhoto ? 'Update Profile Picture' : 'Upload Photo')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;