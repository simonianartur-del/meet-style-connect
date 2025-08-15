import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends';

export const useFriendStatus = (targetUserId: string) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<FriendStatus>('none');
  const [loading, setLoading] = useState(true);

  const checkFriendStatus = async () => {
    if (!user || !targetUserId || user.id === targetUserId) {
      setLoading(false);
      return;
    }

    try {
      // Check if there's a friendship record
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        setStatus('none');
      } else if (data.status === 'accepted') {
        setStatus('friends');
      } else if (data.user_id === user.id) {
        setStatus('pending_sent');
      } else {
        setStatus('pending_received');
      }
    } catch (error) {
      console.error('Error checking friend status:', error);
      setStatus('none');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!user || !targetUserId) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      // Create notification for the target user
      await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          type: 'friend_request',
          title: 'New Friend Request',
          message: `${user.user_metadata?.display_name || user.email} sent you a friend request`,
          data: { from_user_id: user.id }
        });

      setStatus('pending_sent');
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  };

  const removeFriend = async () => {
    if (!user || !targetUserId) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`);

      if (error) throw error;

      setStatus('none');
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      return false;
    }
  };

  const acceptFriendRequest = async () => {
    if (!user || !targetUserId) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('user_id', targetUserId)
        .eq('friend_id', user.id);

      if (error) throw error;

      setStatus('friends');
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  };

  useEffect(() => {
    checkFriendStatus();
  }, [user, targetUserId]);

  return {
    status,
    loading,
    sendFriendRequest,
    removeFriend,
    acceptFriendRequest,
    refetch: checkFriendStatus
  };
};