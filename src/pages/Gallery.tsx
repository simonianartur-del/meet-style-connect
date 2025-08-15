import React, { useState, useEffect } from 'react';
import { Upload, Heart, MessageCircle, Share, Grid, List } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { mockUserMedia, mockFriends, currentUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhotoUploadDialog from '@/components/dialogs/PhotoUploadDialog';

const Gallery = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [userMedia, setUserMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserMedia();
  }, [user]);

  const fetchUserMedia = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_media')
        .select(`
          *,
          profiles!user_media_user_id_fkey(username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserMedia(data || []);
    } catch (error) {
      console.error('Error fetching user media:', error);
    } finally {
      setLoading(false);
    }
  };

  const myPhotos = userMedia.filter(media => media.user_id === user?.id);
  const sharedPhotos = userMedia.filter(media => media.user_id !== user?.id);

  const MediaCard = ({ media, isGrid = true }: { media: any, isGrid: boolean }) => {
    const mediaUser = media.user_id === user?.id ? {
      name: user?.user_metadata?.display_name || user?.email,
      avatar: user?.user_metadata?.avatar_url || `https://i.pravatar.cc/100?seed=${user?.id}`
    } : {
      name: media.profiles?.display_name || media.profiles?.username,
      avatar: media.profiles?.avatar_url || `https://i.pravatar.cc/100?seed=${media.user_id}`
    };
    
    if (isGrid) {
      return (
        <div className="card-glass overflow-hidden interactive cursor-pointer aspect-square">
          <div className="relative h-full">
            <img 
              src={media.url} 
              alt={media.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart size={16} className="text-white" />
                    <span className="text-sm">{media.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle size={16} className="text-white" />
                    <span className="text-sm">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card-premium p-4 space-y-4">
        {/* User Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={mediaUser?.avatar} 
              alt={mediaUser?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate">{mediaUser?.name}</h3>
            <p className="text-xs text-muted-foreground">{new Date(media.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-xl overflow-hidden">
          <img 
            src={media.url} 
            alt={media.caption}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Caption */}
        <p className="text-sm text-slate">{media.caption}</p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border-light">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-destructive hover:text-destructive/80 transition-colors">
              <Heart size={18} />
              <span className="text-sm">{media.likes_count || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-slate-light hover:text-slate transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">0</span>
            </button>
          </div>
          <button className="text-slate-light hover:text-slate transition-colors">
            <Share size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate">{t('gallery.title')}</h1>
          
          {/* Upload Button */}
          <Button 
            className="btn-premium"
            onClick={() => setUploadOpen(true)}
          >
            <Upload size={18} className="mr-2" />
            {t('gallery.upload')}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-slate-light hover:bg-accent'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-slate-light hover:bg-accent'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="my-photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card rounded-xl p-1">
            <TabsTrigger value="my-photos" className="rounded-lg">{t('gallery.myPhotos')}</TabsTrigger>
            <TabsTrigger value="shared-photos" className="rounded-lg">{t('gallery.sharedPhotos')}</TabsTrigger>
          </TabsList>

          <TabsContent value="my-photos" className="space-y-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {myPhotos.map((media, index) => (
                  <div 
                    key={media.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MediaCard media={media} isGrid={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {myPhotos.map((media, index) => (
                  <div 
                    key={media.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MediaCard media={media} isGrid={false} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared-photos" className="space-y-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {sharedPhotos.map((media, index) => (
                  <div 
                    key={media.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MediaCard media={media} isGrid={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sharedPhotos.map((media, index) => (
                  <div 
                    key={media.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MediaCard media={media} isGrid={false} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <PhotoUploadDialog 
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onPhotoUploaded={() => {
          fetchUserMedia();
        }}
      />
    </div>
  );
};

export default Gallery;