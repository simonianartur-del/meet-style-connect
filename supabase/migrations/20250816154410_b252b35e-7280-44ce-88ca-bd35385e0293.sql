-- Add some test users to demonstrate messaging functionality
INSERT INTO profiles (id, username, display_name, avatar_url) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'sarah_chen',
  'Sarah Chen',
  'https://images.unsplash.com/photo-1494790108755-2616b612b5-b5?w=150&h=150&fit=crop&crop=face'
),
(
  '550e8400-e29b-41d4-a716-446655440002', 
  'marcus_rodriguez',
  'Marcus Rodriguez',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'emma_thompson', 
  'Emma Thompson',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
)
ON CONFLICT (id) DO NOTHING;