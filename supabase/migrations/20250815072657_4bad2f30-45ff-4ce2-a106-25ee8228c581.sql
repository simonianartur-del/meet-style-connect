-- Check the current constraint on user_media table
SELECT conname, pg_get_constraintdef(oid) as definition 
FROM pg_constraint 
WHERE conrelid = 'user_media'::regclass 
AND contype = 'c';

-- Drop the existing check constraint if it exists
ALTER TABLE user_media DROP CONSTRAINT IF EXISTS user_media_media_type_check;

-- Add the correct check constraint that allows 'image', 'video', and 'audio'
ALTER TABLE user_media ADD CONSTRAINT user_media_media_type_check 
CHECK (media_type IN ('image', 'video', 'audio'));