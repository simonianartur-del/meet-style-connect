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
import { Search, User, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

const NewChatDialog = ({ open, onOpenChange, onChatCreated }: NewChatDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .neq('id', user?.id)
        .limit(20);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const createDirectChat = async (otherUserId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chat_participants')
        .select('chat_id, chats!inner(*)')
        .eq('user_id', user.id)
        .eq('chats.is_group', false);

      if (existingChat) {
        const existingDirectChat = existingChat.find(async (chat) => {
          const { data: participants } = await supabase
            .from('chat_participants')
            .select('user_id')
            .eq('chat_id', chat.chat_id);
          
          return participants?.some(p => p.user_id === otherUserId);
        });

        if (existingDirectChat) {
          toast.error('Chat already exists with this user');
          return;
        }
      }

      // Create new chat
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          is_group: false,
          created_by: user.id,
        })
        .select()
        .single();

      if (chatError) throw chatError;

      // Add participants
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert([
          { chat_id: newChat.id, user_id: user.id },
          { chat_id: newChat.id, user_id: otherUserId },
        ]);

      if (participantError) throw participantError;

      toast.success('Chat created successfully');
      onChatCreated();
      onOpenChange(false);
    } catch (error) {
      toast.error('Error creating chat');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle size={20} className="text-primary" />
            <span>{t('messages.newChat')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10"
            />
          </div>

          {/* Users List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredUsers.map((userData) => (
              <Card key={userData.id} className="p-3 interactive cursor-pointer">
                <div 
                  className="flex items-center space-x-3"
                  onClick={() => createDirectChat(userData.id)}
                >
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
                </div>
              </Card>
            ))}

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

export default NewChatDialog;