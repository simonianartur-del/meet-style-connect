// Mock data for the Meet app

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  photosCount: number;
  friendsCount: number;
  meetupsCount: number;
}

export interface Friend extends User {
  relationshipStatus: 'friend' | 'pending' | 'blocked';
  mutualFriends: number;
}

export interface Meetup {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  maxAttendees?: number;
  isPrivate: boolean;
  photos: string[];
}

export interface UserMedia {
  id: string;
  userId: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  caption: string;
  likes: number;
  comments: Comment[];
  uploadedAt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface DirectChat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface DirectMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
  isRead: boolean;
}

export interface WallPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  media?: UserMedia[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

export interface Gallery {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  photos: UserMedia[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  collaborators: string[];
}

// Current user
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  bio: 'Adventure seeker and coffee enthusiast. Love organizing fun meetups!',
  location: 'San Francisco, CA',
  joinedDate: '2023-01-15',
  photosCount: 45,
  friendsCount: 28,
  meetupsCount: 12
};

// Sample friends
export const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5-b5?w=150&h=150&fit=crop&crop=face',
    bio: 'Photographer and travel lover',
    location: 'San Francisco, CA',
    joinedDate: '2022-08-20',
    photosCount: 89,
    friendsCount: 45,
    meetupsCount: 23,
    relationshipStatus: 'friend',
    mutualFriends: 5
  },
  {
    id: 'friend-2',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Fitness enthusiast and outdoor adventurer',
    location: 'Oakland, CA',
    joinedDate: '2023-03-10',
    photosCount: 34,
    friendsCount: 67,
    meetupsCount: 18,
    relationshipStatus: 'friend',
    mutualFriends: 8
  },
  {
    id: 'friend-3',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Food blogger and cooking enthusiast',
    location: 'Berkeley, CA',
    joinedDate: '2022-11-05',
    photosCount: 156,
    friendsCount: 92,
    meetupsCount: 31,
    relationshipStatus: 'friend',
    mutualFriends: 12
  },
  {
    id: 'friend-4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech entrepreneur and music lover',
    location: 'Palo Alto, CA',
    joinedDate: '2023-06-18',
    photosCount: 72,
    friendsCount: 58,
    meetupsCount: 15,
    relationshipStatus: 'friend',
    mutualFriends: 7
  },
  {
    id: 'friend-5',
    name: 'Lisa Park',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Artist and creative director',
    location: 'San Jose, CA',
    joinedDate: '2022-12-20',
    photosCount: 201,
    friendsCount: 134,
    meetupsCount: 42,
    relationshipStatus: 'friend',
    mutualFriends: 15
  }
];

// Sample meetups
export const mockMeetups: Meetup[] = [
  {
    id: 'meetup-1',
    title: 'Weekend Hiking Adventure',
    description: 'Join us for a scenic hike through the beautiful trails of Mount Tamalpais. Perfect for all skill levels!',
    date: '2024-08-20',
    time: '09:00',
    location: 'Mount Tamalpais State Park',
    organizer: 'friend-2',
    attendees: ['user-1', 'friend-1', 'friend-2', 'friend-4'],
    status: 'upcoming',
    category: 'Outdoor',
    maxAttendees: 8,
    isPrivate: false,
    photos: []
  },
  {
    id: 'meetup-2',
    title: 'Cooking Class: Italian Cuisine',
    description: 'Learn to make authentic Italian pasta and pizza from scratch with Emma, our resident food expert!',
    date: '2024-08-22',
    time: '18:30',
    location: "Emma's Kitchen Studio",
    organizer: 'friend-3',
    attendees: ['user-1', 'friend-3', 'friend-5'],
    status: 'upcoming',
    category: 'Food & Drink',
    maxAttendees: 6,
    isPrivate: true,
    photos: []
  },
  {
    id: 'meetup-3',
    title: 'Photography Walk in Golden Gate Park',
    description: 'Capture the beauty of Golden Gate Park with fellow photography enthusiasts. Bring your camera!',
    date: '2024-08-25',
    time: '10:00',
    location: 'Golden Gate Park',
    organizer: 'friend-1',
    attendees: ['user-1', 'friend-1', 'friend-4', 'friend-5'],
    status: 'upcoming',
    category: 'Photography',
    maxAttendees: 10,
    isPrivate: false,
    photos: []
  }
];

// Sample user media
export const mockUserMedia: UserMedia[] = [
  {
    id: 'media-1',
    userId: 'user-1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    caption: 'Amazing sunset from last weekend\'s hike! 🌅',
    likes: 23,
    comments: [
      {
        id: 'comment-1',
        userId: 'friend-1',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5-b5?w=50&h=50&fit=crop&crop=face',
        content: 'Absolutely stunning! 😍',
        createdAt: '2024-08-10T15:30:00Z',
        likes: 5
      }
    ],
    uploadedAt: '2024-08-10T14:20:00Z',
    tags: ['sunset', 'hiking', 'nature']
  },
  {
    id: 'media-2',
    userId: 'friend-1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
    caption: 'Coffee art practice session ☕️',
    likes: 18,
    comments: [],
    uploadedAt: '2024-08-12T09:15:00Z',
    tags: ['coffee', 'art', 'morning']
  }
];

// Sample galleries
export const mockGalleries: Gallery[] = [
  {
    id: 'gallery-1',
    name: 'Summer Adventures 2024',
    description: 'Our amazing summer meetups and adventures',
    coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    photos: [mockUserMedia[0]],
    createdBy: 'user-1',
    createdAt: '2024-06-01T00:00:00Z',
    isPublic: true,
    collaborators: ['friend-1', 'friend-2']
  },
  {
    id: 'gallery-2',
    name: 'Food Adventures',
    description: 'Culinary experiences and cooking sessions',
    coverPhoto: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    photos: [mockUserMedia[1]],
    createdBy: 'friend-3',
    createdAt: '2024-07-15T00:00:00Z',
    isPublic: false,
    collaborators: ['user-1', 'friend-5']
  }
];

// Sample direct chats
export const mockDirectChats: DirectChat[] = [
  {
    id: 'chat-1',
    participants: ['user-1', 'friend-1'],
    lastMessage: 'Looking forward to the photo walk!',
    lastMessageTime: '2024-08-15T16:45:00Z',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 'chat-2',
    participants: ['user-1', 'friend-2'],
    lastMessage: 'Don\'t forget to bring water for the hike',
    lastMessageTime: '2024-08-15T14:30:00Z',
    unreadCount: 0,
    isOnline: false
  }
];

// Sample wall posts
export const mockWallPosts: WallPost[] = [
  {
    id: 'post-1',
    userId: 'friend-1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5-b5?w=50&h=50&fit=crop&crop=face',
    content: 'Just finished an amazing photo session in the city! Can\'t wait to share the results 📸',
    likes: 15,
    comments: [
      {
        id: 'comment-2',
        userId: 'user-1',
        userName: 'Alex Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        content: 'Can\'t wait to see them!',
        createdAt: '2024-08-15T18:30:00Z',
        likes: 2
      }
    ],
    createdAt: '2024-08-15T17:20:00Z',
    isLiked: true
  },
  {
    id: 'post-2',
    userId: 'friend-3',
    userName: 'Emma Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    content: 'Who\'s ready for tonight\'s cooking class? We\'re making the most amazing carbonara! 🍝',
    likes: 12,
    comments: [],
    createdAt: '2024-08-15T12:15:00Z',
    isLiked: false
  }
];