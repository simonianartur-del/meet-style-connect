-- Fix RLS policies to prevent infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view chats they participate in" ON chats;
DROP POLICY IF EXISTS "Users can view chat participants for their chats" ON chat_participants;

-- Create correct RLS policies for chats
CREATE POLICY "Users can view chats they participate in" 
ON chats 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM chat_participants 
  WHERE chat_participants.chat_id = chats.id 
  AND chat_participants.user_id = auth.uid()
));

-- Create correct RLS policies for chat_participants  
CREATE POLICY "Users can view chat participants for their chats" 
ON chat_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM chat_participants cp2 
  WHERE cp2.chat_id = chat_participants.chat_id 
  AND cp2.user_id = auth.uid()
));