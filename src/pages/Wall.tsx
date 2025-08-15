import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Send, User } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  post_likes: { user_id: string }[];
}

const Wall = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, display_name, avatar_url),
          post_likes (user_id)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error(t('wall.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPost,
          user_id: user.id,
          is_private: false
        });

      if (error) throw error;
      
      setNewPost('');
      toast.success(t('wall.postCreated'));
      fetchPosts();
    } catch (error) {
      toast.error(t('wall.errorCreating'));
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }
      
      fetchPosts();
    } catch (error) {
      toast.error(t('wall.errorLiking'));
    }
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
        <h1 className="text-2xl font-bold text-slate text-center">{t('wall.title')}</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Create Post */}
        {user && (
          <Card className="card-premium p-4">
            <div className="space-y-4">
              <Input
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t('wall.shareThoughts')}
                className="input-premium"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {newPost.length}/500
                </span>
                <Button 
                  onClick={createPost}
                  disabled={!newPost.trim()}
                  className="btn-premium"
                >
                  <Send size={16} className="mr-2" />
                  {t('wall.post')}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = post.post_likes.some(like => like.user_id === user?.id);
            
            return (
              <Card key={post.id} className="card-premium p-4 animate-slide-up">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      {post.profiles?.avatar_url ? (
                        <img 
                          src={post.profiles.avatar_url} 
                          alt={post.profiles.display_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate">
                        {post.profiles?.display_name || post.profiles?.username || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-slate whitespace-pre-wrap">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center space-x-6 pt-2 border-t border-border-light">
                    <button
                      onClick={() => toggleLike(post.id, isLiked)}
                      className={`flex items-center space-x-2 transition-colors ${
                        isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                      }`}
                      disabled={!user}
                    >
                      <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                      <span>{post.likes_count}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-muted-foreground hover:text-slate transition-colors">
                      <MessageCircle size={16} />
                      <span>{t('wall.comment')}</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {posts.length === 0 && (
          <Card className="card-premium p-8 text-center">
            <p className="text-muted-foreground">{t('wall.noPosts')}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Wall;