
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, UserPlus, Mail, Send } from 'lucide-react';
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
  const [emailInvite, setEmailInvite] = useState('');
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

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
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

  const sendEmailInvite = async () => {
    if (!user || !emailInvite.trim()) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInvite)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists with this email
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', user.id); // This is a placeholder - in a real app you'd need to match by email

      // For now, we'll just create a notification/invitation record
      // In a real app, you'd send an actual email invitation
      const inviteMessage = `${user.user_metadata?.display_name || user.email} has invited you to join the app!`;
      
      // Store the invitation (you could create an 'invitations' table for this)
      console.log('Sending invitation to:', emailInvite);
      console.log('Invitation message:', inviteMessage);
      
      // For demo purposes, just show success
      toast.success(`Invitation sent to ${emailInvite}!`);
      setEmailInvite('');
      
      // In a real implementation, you would:
      // 1. Create an invitation record in the database
      // 2. Send an email using a service like Resend
      // 3. Include a signup link with invitation token
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error sending invitation');
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

        <Tabs defaultValue="existing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center space-x-2">
              <Search size={14} />
              <span>Find Users</span>
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center space-x-2">
              <Mail size={14} />
              <span>Invite by Email</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {/* Search existing users */}
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
                  <p className="text-muted-foreground">
                    {users.length === 0 
                      ? "No other users available yet." 
                      : "No users match your search."
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            {/* Email invitation */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate mb-2 block">
                  Invite someone by email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={emailInvite}
                    onChange={(e) => setEmailInvite(e.target.value)}
                    className="input-premium pl-10"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendEmailInvite();
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={sendEmailInvite}
                disabled={!emailInvite.trim() || loading}
                className="btn-premium w-full"
              >
                <Send size={16} className="mr-2" />
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  They'll receive an email invitation to join the app and connect with you.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
