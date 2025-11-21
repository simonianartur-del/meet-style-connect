-- Fix Public Data Exposure: Restrict profile access to authenticated users and friends
-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a new policy that restricts profile viewing to authenticated users
-- Users can view their own profile and profiles of their accepted friends
CREATE POLICY "Authenticated users can view friend profiles" ON profiles
  FOR SELECT USING (
    auth.role() = 'authenticated' AND (
      auth.uid() = id OR
      EXISTS (
        SELECT 1 FROM friends
        WHERE ((user_id = auth.uid() AND friend_id = profiles.id AND status = 'accepted')
           OR (friend_id = auth.uid() AND user_id = profiles.id AND status = 'accepted'))
      )
    )
  );

-- Add constraints to prevent data corruption and injection attacks
-- Limit username and display_name lengths
ALTER TABLE profiles 
  ADD CONSTRAINT username_length CHECK (char_length(username) <= 20 AND char_length(username) >= 3),
  ADD CONSTRAINT display_name_length CHECK (char_length(display_name) <= 50 AND char_length(display_name) >= 1),
  ADD CONSTRAINT bio_length CHECK (char_length(bio) <= 500);

-- Add constraints to posts table
ALTER TABLE posts
  ADD CONSTRAINT content_length CHECK (char_length(content) <= 5000 AND char_length(content) >= 1);

-- Add constraints to comments table
ALTER TABLE comments
  ADD CONSTRAINT content_length CHECK (char_length(content) <= 1000 AND char_length(content) >= 1);

-- Add constraints to user_media table
ALTER TABLE user_media
  ADD CONSTRAINT caption_length CHECK (caption IS NULL OR char_length(caption) <= 200);