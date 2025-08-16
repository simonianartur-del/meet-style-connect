-- Temporarily disable RLS on chat_participants to break the recursion cycle
ALTER TABLE chat_participants DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view chat participants for their chats" ON chat_participants;
DROP POLICY IF EXISTS "Users can add participants to their chats" ON chat_participants;

-- Create a simpler approach - handle all security through the chats table
-- The chat_participants table will be accessible, but users can only see chats they're part of
-- This effectively controls access to chat_participants through the chats relationship

-- Re-enable RLS on chat_participants 
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

-- Create a basic policy for chat_participants that allows access if the user can see the chat
CREATE POLICY "Users can manage chat participants" ON chat_participants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = chat_participants.chat_id 
    AND public.user_can_access_chat(chats.id, auth.uid())
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = chat_participants.chat_id 
    AND chats.created_by = auth.uid()
  )
);