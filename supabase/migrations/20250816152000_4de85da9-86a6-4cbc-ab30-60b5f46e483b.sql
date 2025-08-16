-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view chats they participate in" ON chats;
DROP POLICY IF EXISTS "Users can manage chat participants" ON chat_participants;

-- Disable RLS temporarily to avoid recursion issues
ALTER TABLE chat_participants DISABLE ROW LEVEL SECURITY;

-- Create simple policies that avoid recursion
CREATE POLICY "Users can view chats they participate in" ON chats
FOR SELECT USING (
  created_by = auth.uid() OR 
  id IN (
    SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()
  )
);

-- Enable RLS back on chat_participants with a simple policy
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all chat participants" ON chat_participants
FOR SELECT USING (true);

CREATE POLICY "Users can add participants to chats they created" ON chat_participants  
FOR INSERT WITH CHECK (
  chat_id IN (
    SELECT id FROM chats WHERE created_by = auth.uid()
  )
);