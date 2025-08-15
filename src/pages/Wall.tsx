import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Share, User, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  user_liked: boolean;
}

const Wall = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(username, display_name, avatar_url),
          post_likes!left(user_id)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsWithLikes = data?.map(post => ({
        ...post,
        user_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
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
      fetchPosts();
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    try {
      if (currentlyLiked) {
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

      // Update posts locally for instant feedback
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              user_liked: !currentlyLiked,
              likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border-light p-4">
        <h1 className="text-2xl font-bold text-slate text-center">{t('wall.title')}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Create Post */}
        {user && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Your avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder={t('wall.shareThoughts')}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[80px] resize-none border-0 focus:ring-0 bg-transparent"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
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

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Card key={post.id} className="p-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="space-y-3">
                {/* Post Header */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    {post.profiles?.avatar_url ? (
                      <img 
                        src={post.profiles.avatar_url} 
                        alt={post.profiles.display_name || post.profiles.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate">
                      {post.profiles?.display_name || post.profiles?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="pl-13">
                  <p className="text-slate whitespace-pre-wrap">{post.content}</p>
                </div>

                <Separator />

                {/* Post Actions */}
                <div className="flex items-center justify-between pl-13">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleLike(post.id, post.user_liked)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        post.user_liked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart size={16} className={post.user_liked ? 'fill-current' : ''} />
                      <span>{post.likes_count}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle size={16} />
                      <span>0</span>
                    </button>
                  </div>

                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Share size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-slate mb-2">{t('wall.noPosts')}</h3>
              <p className="text-muted-foreground">Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wall;