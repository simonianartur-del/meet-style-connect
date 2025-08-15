import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Plus, User, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Chat {
  id: string;
  name?: string;
  is_group: boolean;
  created_at: string;
  participants: {
    profiles: {
      id: string;
      username: string;
      display_name: string;
      avatar_url?: string;
    };
  }[];
  messages: {
    content: string;
    created_at: string;
    sender_id: string;
  }[];
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          participants:chat_participants (
            profiles:user_id (id, username, display_name, avatar_url)
          ),
          messages (content, created_at, sender_id)
        `)
        .eq('chat_participants.user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      toast.error(t('messages.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (username, display_name, avatar_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast.error(t('messages.errorFetchingMessages'));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          chat_id: selectedChat,
          sender_id: user.id
        });

      if (error) throw error;
      
      setNewMessage('');
      fetchMessages(selectedChat);
    } catch (error) {
      toast.error(t('messages.errorSending'));
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.is_group && chat.name) return chat.name;
    
    const otherParticipant = chat.participants.find(
      p => p.profiles.id !== user?.id
    );
    
    return otherParticipant?.profiles.display_name || 
           otherParticipant?.profiles.username || 
           t('messages.unknownUser');
  };

  const getLastMessage = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage?.content || t('messages.noMessages');
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate">{t('messages.title')}</h1>
          <Button className="btn-premium">
            <Plus size={18} className="mr-2" />
            {t('messages.newChat')}
          </Button>
        </div>
      </div>

      <div className="px-4">
        {selectedChat ? (
          // Chat View
          <div className="space-y-4">
            <Button
              onClick={() => setSelectedChat(null)}
              variant="outline"
              className="mb-4"
            >
              ← {t('messages.back')}
            </Button>

            {/* Messages */}
            <Card className="card-premium p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-primary text-white'
                          : 'bg-muted text-slate'
                      }`}
                    >
                      {message.sender_id !== user?.id && (
                        <div className="text-xs opacity-75 mb-1">
                          {message.profiles?.display_name || message.profiles?.username}
                        </div>
                      )}
                      <p>{message.content}</p>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Send Message */}
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('messages.typeMessage')}
                className="input-premium flex-1"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()} className="btn-premium">
                <Send size={16} />
              </Button>
            </div>
          </div>
        ) : (
          // Chats List
          <div className="space-y-4">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="card-premium p-4 interactive cursor-pointer"
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate">{getChatName(chat)}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {getLastMessage(chat)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}

            {chats.length === 0 && (
              <Card className="card-premium p-8 text-center">
                <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('messages.noChats')}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;