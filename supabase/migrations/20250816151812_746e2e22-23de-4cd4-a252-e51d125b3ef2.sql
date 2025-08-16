-- Drop all existing problematic policies first
DROP POLICY IF EXISTS "Users can view chats they participate in" ON chats;
DROP POLICY IF EXISTS "Users can view chat participants for their chats" ON chat_participants;

-- Create a security definer function to check if user is in a chat
CREATE OR REPLACE FUNCTION public.user_can_access_chat(chat_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM chat_participants 
    WHERE chat_participants.chat_id = $1 
    AND chat_participants.user_id = $2
  );
$$;

-- Create new policies using the security definer function
CREATE POLICY "Users can view chats they participate in" 
ON chats 
FOR SELECT 
USING (public.user_can_access_chat(id, auth.uid()));

CREATE POLICY "Users can view chat participants for their chats" 
ON chat_participants 
FOR SELECT 
USING (public.user_can_access_chat(chat_id, auth.uid()));