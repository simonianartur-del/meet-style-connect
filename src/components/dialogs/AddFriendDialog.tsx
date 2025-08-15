import React, { useState, useEffect } from 'react';
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
import { Card } from '@/components/ui/card';
import { Search, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddFriendDialog = ({ open, onOpenChange }: AddFriendDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    if (open && user) {
      fetchUsers();
      fetchExistingFriends();
    }
  }, [open, user]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .neq('id', user?.id)
        .order('display_name')
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const fetchExistingFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFriends(data?.map(f => f.friend_id) || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;
      
      setFriends(prev => [...prev, friendId]);
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error('Error sending friend request');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(query) ||
      u.display_name?.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus size={20} className="text-primary" />
            <span>{t('friends.addNew')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('friends.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10"
            />
          </div>

          {/* Users List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredUsers.map((userData) => {
              const isFriend = friends.includes(userData.id);
              
              return (
                <Card key={userData.id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      {userData.avatar_url ? (
                        <img 
                          src={userData.avatar_url} 
                          alt={userData.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate">
                        {userData.display_name || userData.username}
                      </h3>
                      {userData.username && userData.display_name && (
                        <p className="text-sm text-muted-foreground">@{userData.username}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isFriend ? "secondary" : "default"}
                      disabled={isFriend || loading}
                      onClick={() => sendFriendRequest(userData.id)}
                      className={isFriend ? "" : "btn-premium"}
                    >
                      <UserPlus size={14} className="mr-1" />
                      {isFriend ? 'Sent' : 'Add'}
                    </Button>
                  </div>
                </Card>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <User size={48} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;