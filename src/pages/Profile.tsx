import React from 'react';
import { useParams } from 'react-router-dom';
import { Edit, MapPin, Calendar, Camera, Users, Heart, Grid } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { mockFriends, mockUserMedia } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { t } = useLanguage();
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  
  // Determine if this is the current user's profile or a friend's profile
  const isOwnProfile = !userId || userId === currentUser?.id;
  const user = isOwnProfile ? {
    id: currentUser?.id || '',
    name: currentUser?.user_metadata?.display_name || currentUser?.email || 'User',
    avatar: currentUser?.user_metadata?.avatar_url || `https://i.pravatar.cc/100?seed=${currentUser?.id}`,
    location: 'San Francisco, CA', // This would come from profile table
    bio: 'Love meeting new people and exploring new places! 🌟',
    joinedDate: currentUser?.created_at || new Date().toISOString(),
    photosCount: 24,
    friendsCount: 156,
    meetupsCount: 12,
  } : mockFriends.find(f => f.id === userId) || mockFriends[0];
  
  const userMedia = mockUserMedia.filter(media => media.userId === user.id);

  return (
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-subtle px-4 py-8 mb-6">
        <div className="text-center space-y-4">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Camera size={16} className="text-white" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate">{user.name}</h1>
            <div className="flex items-center justify-center space-x-1 text-slate-light">
              <MapPin size={14} />
              <span>{user.location}</span>
            </div>
            <p className="text-slate-light max-w-sm mx-auto">{user.bio}</p>
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="text-lg font-bold text-slate">{user.photosCount}</p>
              <p className="text-xs text-slate-light">{t('profile.photos')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate">{user.friendsCount}</p>
              <p className="text-xs text-slate-light">{t('profile.friends')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate">{user.meetupsCount}</p>
              <p className="text-xs text-slate-light">Meetups</p>
            </div>
          </div>

          {/* Action Button */}
          {isOwnProfile ? (
            <Button className="btn-premium">
              <Edit size={18} className="mr-2" />
              {t('profile.edit')}
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button className="btn-premium flex-1">
                <Users size={18} className="mr-2" />
                Add Friend
              </Button>
              <Button variant="outline" className="btn-ghost">
                Message
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card rounded-xl p-1">
            <TabsTrigger value="photos" className="rounded-lg flex items-center space-x-1">
              <Grid size={14} />
              <span>{t('profile.photos')}</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg">{t('profile.posts')}</TabsTrigger>
            <TabsTrigger value="friends" className="rounded-lg">{t('profile.friends')}</TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            {userMedia.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {userMedia.map((media, index) => (
                  <div 
                    key={media.id}
                    className="aspect-square bg-card rounded-lg overflow-hidden interactive cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <img 
                      src={media.url} 
                      alt={media.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-premium p-8 text-center">
                <Camera size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-slate mb-2">No photos yet</h3>
                <p className="text-muted-foreground text-sm">
                  {isOwnProfile ? 'Start sharing your memories!' : `${user.name} hasn't shared any photos yet.`}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="space-y-4">
              {userMedia.map((media, index) => (
                <div 
                  key={media.id}
                  className="card-premium p-4 space-y-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Post Header */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate">{user.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(media.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Image */}
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={media.url} 
                      alt={media.caption}
                      className="w-full aspect-square object-cover"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="space-y-2">
                    <p className="text-sm text-slate">{media.caption}</p>
                    
                    {/* Tags */}
                    {media.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {media.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-light">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-destructive hover:text-destructive/80 transition-colors">
                          <Heart size={18} />
                          <span className="text-sm">{media.likes}</span>
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(media.uploadedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            {isOwnProfile ? (
              <div className="grid grid-cols-2 gap-4">
                {mockFriends.slice(0, 6).map((friend, index) => (
                  <div 
                    key={friend.id}
                    className="card-premium p-4 text-center interactive cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-slate text-sm">{friend.name}</h3>
                    <p className="text-xs text-muted-foreground">{friend.mutualFriends} mutual</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-premium p-8 text-center">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-slate mb-2">Friends list is private</h3>
                <p className="text-muted-foreground text-sm">
                  Only {user.name} can see their friends list.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;