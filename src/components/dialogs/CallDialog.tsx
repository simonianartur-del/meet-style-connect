import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Video, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callType: 'audio' | 'video';
}

interface Friend {
  id: string;
  friend_id: string;
  profiles: {
    display_name: string;
    avatar_url: string;
  };
}

const CallDialog: React.FC<CallDialogProps> = ({ open, onOpenChange, callType }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchFriends();
    }
  }, [open, user]);

  const fetchFriends = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          friend_id,
          profiles!friends_friend_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;
      setFriends(data || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleStartCall = () => {
    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend to call');
      return;
    }

    const callTypeText = callType === 'audio' ? 'Audio' : 'Video';
    const callMode = selectedFriends.length > 1 ? 'conference' : 'direct';
    
    toast.info(`${callTypeText} ${callMode === 'conference' ? 'conference' : ''} call feature coming soon!`);
    onOpenChange(false);
    setSelectedFriends([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {callType === 'audio' ? <Phone size={20} /> : <Video size={20} />}
            <span>Start {callType === 'audio' ? 'Audio' : 'Video'} Call</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select one or more friends to call
          </p>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading friends...
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No friends available</p>
              <p className="text-xs mt-2">Add friends to start calling them</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => toggleFriend(friend.friend_id)}
                >
                  <Checkbox
                    checked={selectedFriends.includes(friend.friend_id)}
                    onCheckedChange={() => toggleFriend(friend.friend_id)}
                  />
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={friend.profiles?.avatar_url || `https://i.pravatar.cc/100?seed=${friend.friend_id}`}
                      alt={friend.profiles?.display_name || 'Friend'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {friend.profiles?.display_name || 'Unknown User'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedFriends([]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartCall}
              disabled={selectedFriends.length === 0}
              className="flex-1 btn-premium"
            >
              {callType === 'audio' ? <Phone size={16} className="mr-2" /> : <Video size={16} className="mr-2" />}
              Call {selectedFriends.length > 0 && `(${selectedFriends.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
