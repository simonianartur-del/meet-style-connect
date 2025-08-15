-- Allow system to create notifications for friend requests
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (true);