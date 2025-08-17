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
import { Card } from '@/components/ui/card';
import { Bell, CheckCheck, Check, X, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const NotificationsDialog = ({ open, onOpenChange, onUpdate }: NotificationsDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchNotifications();
    }
  }, [open, user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      toast.error('Error fetching notifications');
    }
  };

  const handleFriendRequest = async (action: 'accept' | 'decline', friendRequestId: string, fromUserId: string) => {
    if (!user) return;
    
    try {
      if (action === 'accept') {
        // Update friend request status to accepted
        const { error: updateError } = await supabase
          .from('friends')
          .update({ status: 'accepted' })
          .eq('id', friendRequestId);

        if (updateError) throw updateError;
        
        toast.success('Friend request accepted!');
      } else {
        // Delete the friend request
        const { error: deleteError } = await supabase
          .from('friends')
          .delete()
          .eq('id', friendRequestId);

        if (deleteError) throw deleteError;
        
        toast.success('Friend request declined');
      }

      // Mark the notification as read
      await markNotificationAsRead(friendRequestId);
      
      // Refresh notifications and update parent
      await fetchNotifications();
      onUpdate?.();
    } catch (error) {
      toast.error(`Error ${action}ing friend request`);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
      onUpdate?.();
    } catch (error) {
      toast.error('Error updating notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      onUpdate?.();
    } catch (error) {
      toast.error('Error updating notification');
    }
  };

  const renderNotificationActions = (notification: Notification) => {
    if (notification.type === 'friend_request' && !notification.is_read) {
      const friendRequestId = notification.data?.friend_request_id;
      const fromUserId = notification.data?.from_user_id;
      
      if (friendRequestId && fromUserId) {
        return (
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleFriendRequest('accept', friendRequestId, fromUserId);
              }}
              className="flex-1"
            >
              <Check size={14} className="mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleFriendRequest('decline', friendRequestId, fromUserId);
              }}
              className="flex-1"
            >
              <X size={14} className="mr-1" />
              Decline
            </Button>
          </div>
        );
      }
    }
    return null;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell size={20} className="text-primary" />
              <span>{t('notifications.title')}</span>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={loading}
                className="text-primary hover:text-primary/80"
              >
                <CheckCheck size={16} className="mr-1" />
                {t('notifications.markAllRead')}
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 cursor-pointer transition-all ${
                  !notification.is_read ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {notification.type === 'friend_request' && <Users size={16} className="text-primary" />}
                      <h4 className="font-medium text-slate">{notification.title}</h4>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-slate-light">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  {renderNotificationActions(notification)}
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;