import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    photos_private: false,
    friends_private: false,
    posts_private: false,
  });

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('photos_private, friends_private, posts_private')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setSettings({
          photos_private: data.photos_private || false,
          friends_private: data.friends_private || false,
          posts_private: data.posts_private || false,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          photos_private: settings.photos_private,
          friends_private: settings.friends_private,
          posts_private: settings.posts_private,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success(t('settings.saved'));
    } catch (error) {
      toast.error('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="flex items-center justify-center space-x-3">
          <SettingsIcon size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-slate">{t('settings.title')}</h1>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Privacy Settings */}
        <Card className="card-premium p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-slate">{t('settings.privacy')}</h2>
          </div>
          
          <div className="space-y-6">
            {/* Photos Privacy */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="photos-private" className="text-slate font-medium">
                  {t('settings.makePhotosPrivate')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only you can see your photos when enabled
                </p>
              </div>
              <Switch
                id="photos-private"
                checked={settings.photos_private}
                onCheckedChange={(checked) => handleSettingChange('photos_private', checked)}
              />
            </div>

            <Separator />

            {/* Friends Privacy */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="friends-private" className="text-slate font-medium">
                  {t('settings.makeFriendsPrivate')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hide your friends list from others
                </p>
              </div>
              <Switch
                id="friends-private"
                checked={settings.friends_private}
                onCheckedChange={(checked) => handleSettingChange('friends_private', checked)}
              />
            </div>

            <Separator />

            {/* Posts Privacy */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="posts-private" className="text-slate font-medium">
                  {t('settings.makePostsPrivate')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only you can see your posts when enabled
                </p>
              </div>
              <Switch
                id="posts-private"
                checked={settings.posts_private}
                onCheckedChange={(checked) => handleSettingChange('posts_private', checked)}
              />
            </div>
          </div>

          <Button 
            onClick={updateSettings} 
            disabled={loading}
            className="btn-premium w-full mt-6"
          >
            {loading ? 'Saving...' : t('settings.save')}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;