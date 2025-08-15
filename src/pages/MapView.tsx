import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

interface UserLocation {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  location: [number, number]; // [longitude, latitude]
  location_enabled: boolean;
}

const MapView = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchUserLocation();
      fetchNearbyUsers();
    }
  }, [user]);

  const fetchUserLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('location, location_enabled')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data?.location) {
        // PostgreSQL POINT format: (longitude, latitude)
        const coords = String(data.location).replace(/[()]/g, '').split(',').map(Number);
        setUserLocation([coords[0], coords[1]]);
      }
      
      setLocationEnabled(data?.location_enabled || false);
    } catch (error) {
      console.error('Error fetching user location:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, location')
        .eq('location_enabled', true)
        .neq('id', user?.id);

      if (error) throw error;
      
      const usersWithLocation = data
        ?.filter(user => user.location)
        .map(user => {
          const coords = String(user.location).replace(/[()]/g, '').split(',').map(Number);
          return {
            ...user,
            location: [coords[0], coords[1]] as [number, number],
            location_enabled: true
          };
        }) || [];
      
      setNearbyUsers(usersWithLocation);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t('map.geolocationNotSupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              location: `(${longitude}, ${latitude})`,
              location_enabled: true
            })
            .eq('id', user?.id);

          if (error) throw error;
          
          setLocationEnabled(true);
          toast.success(t('map.locationUpdated'));
          fetchNearbyUsers();
        } catch (error) {
          toast.error(t('map.errorUpdatingLocation'));
        }
      },
      (error) => {
        toast.error(t('map.errorGettingLocation'));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const toggleLocationSharing = async () => {
    try {
      const newEnabled = !locationEnabled;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          location_enabled: newEnabled,
          location: newEnabled ? userLocation ? `(${userLocation[0]}, ${userLocation[1]})` : null : null
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      setLocationEnabled(newEnabled);
      
      if (newEnabled && !userLocation) {
        getCurrentLocation();
      } else {
        toast.success(newEnabled ? t('map.locationEnabled') : t('map.locationDisabled'));
        fetchNearbyUsers();
      }
    } catch (error) {
      toast.error(t('map.errorToggling'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <h1 className="text-2xl font-bold text-slate text-center">{t('map.title')}</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Location Controls */}
        <Card className="card-premium p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate">{t('map.shareLocation')}</h3>
                <p className="text-sm text-muted-foreground">{t('map.shareLocationDesc')}</p>
              </div>
              <button
                onClick={toggleLocationSharing}
                className="text-primary hover:text-primary-dark transition-colors"
              >
                {locationEnabled ? (
                  <ToggleRight size={32} className="text-primary" />
                ) : (
                  <ToggleLeft size={32} className="text-muted-foreground" />
                )}
              </button>
            </div>

            {locationEnabled && !userLocation && (
              <Button onClick={getCurrentLocation} className="btn-premium w-full">
                <MapPin size={16} className="mr-2" />
                {t('map.getCurrentLocation')}
              </Button>
            )}

            {userLocation && (
              <div className="text-sm text-muted-foreground">
                {t('map.currentLocation')}: {userLocation[1].toFixed(4)}, {userLocation[0].toFixed(4)}
              </div>
            )}
          </div>
        </Card>

        {/* Map Placeholder - Ready for Integration */}
        <Card className="card-premium p-4">
          <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <MapPin size={48} className="mx-auto text-primary mb-2" />
              <p className="text-slate font-medium">{t('map.title')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {locationEnabled 
                  ? `${nearbyUsers.length} users nearby` 
                  : 'Enable location to see nearby users'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Nearby Users */}
        <Card className="card-premium p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users size={20} className="text-primary" />
            <h3 className="font-semibold text-slate">{t('map.nearbyUsers')}</h3>
            <span className="text-sm text-muted-foreground">({nearbyUsers.length})</span>
          </div>

          <div className="space-y-3">
            {nearbyUsers.map((nearbyUser) => (
              <div key={nearbyUser.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  {nearbyUser.avatar_url ? (
                    <img 
                      src={nearbyUser.avatar_url} 
                      alt={nearbyUser.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users size={16} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate">
                    {nearbyUser.display_name || nearbyUser.username}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t('map.onlineNow')}
                  </p>
                </div>
                <MapPin size={16} className="text-primary" />
              </div>
            ))}

            {nearbyUsers.length === 0 && (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {locationEnabled ? t('map.noNearbyUsers') : t('map.enableLocationToSee')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MapView;