-- Enable RLS for required tables
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_likes ENABLE ROW LEVEL SECURITY;

-- Fix chat creation policy
DROP POLICY IF EXISTS "Users can create chats" ON public.chats;
CREATE POLICY "Users can create chats" 
ON public.chats 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Add RLS policies for post_likes
CREATE POLICY "Users can view all post likes" 
ON public.post_likes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own post likes" 
ON public.post_likes 
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for comments
CREATE POLICY "Users can view all comments" 
ON public.comments 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Add RLS policies for media_likes
CREATE POLICY "Users can view all media likes" 
ON public.media_likes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can manage their own media likes" 
ON public.media_likes 
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for chat_participants
CREATE POLICY "Users can view chat participants for their chats" 
ON public.chat_participants 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.chat_participants cp2 
  WHERE cp2.chat_id = chat_participants.chat_id 
  AND cp2.user_id = auth.uid()
));

CREATE POLICY "Users can add participants to their chats" 
ON public.chat_participants 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chats 
  WHERE id = chat_id 
  AND created_by = auth.uid()
));

-- Fix the media column to allow posting images and videos to wall
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_url text;