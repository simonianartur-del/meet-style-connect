import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MapPin, Users, Phone, Video } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { mockFriends } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddFriendDialog from '@/components/dialogs/AddFriendDialog';
import CallDialog from '@/components/dialogs/CallDialog';

const Friends = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [preSelectedFriendId, setPreSelectedFriendId] = useState<string | undefined>();

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (friendId: string, type: 'audio' | 'video', e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    setCallType(type);
    setPreSelectedFriendId(friendId);
    setCallDialogOpen(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate">{t('friends.title')}</h1>
          
          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('friends.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10"
            />
          </div>

          {/* Add Friend Button */}
          <Button 
            className="btn-premium"
            onClick={() => setAddFriendOpen(true)}
          >
            <UserPlus size={18} className="mr-2" />
            {t('friends.addNew')}
          </Button>
        </div>
      </div>

      <div className="px-4">
        {/* Friends List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate">{t('friends.myFriends')}</h2>
            <span className="text-sm text-muted-foreground">{filteredFriends.length} friends</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredFriends.map((friend, index) => (
              <div
                key={friend.id}
                className="card-premium p-4 interactive cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/profile/${friend.id}`)}
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border-light">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate">{friend.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                      <MapPin size={12} />
                      <span>{friend.location}</span>
                    </div>
                    <p className="text-sm text-slate-light mt-1 line-clamp-2">
                      {friend.bio}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users size={10} />
                        <span>{friend.mutualFriends} mutual</span>
                      </div>
                      <span>•</span>
                      <span>{friend.photosCount} photos</span>
                      <span>•</span>
                      <span>{friend.meetupsCount} meetups</span>
                    </div>

                    {/* Call Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => handleCall(friend.id, 'audio', e)}
                      >
                        <Phone size={14} className="mr-1" />
                        Audio
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => handleCall(friend.id, 'video', e)}
                      >
                        <Video size={14} className="mr-1" />
                        Video
                      </Button>
                    </div>
                  </div>

                  {/* Action Indicator */}
                  <div className="text-primary">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AddFriendDialog 
        open={addFriendOpen}
        onOpenChange={setAddFriendOpen}
      />

      <CallDialog
        open={callDialogOpen}
        onOpenChange={setCallDialogOpen}
        callType={callType}
        preSelectedFriendId={preSelectedFriendId}
      />
    </div>
  );
};

export default Friends;