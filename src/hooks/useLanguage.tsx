import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.friends': 'Friends',
    'nav.create': 'Create',
    'nav.discover': 'Discover',
    'nav.meetups': 'My Meetups',
    'nav.gallery': 'Gallery',
    'nav.wall': 'Wall',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.title': 'Welcome to Meet',
    'dashboard.subtitle': 'Your social meetup companion',
    'dashboard.friends': 'Friends',
    'dashboard.meetups': 'Meetups',
    'dashboard.photos': 'Photos',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.createMeetup': 'Create Meetup',
    'dashboard.addFriend': 'Add Friend',
    'dashboard.uploadPhoto': 'Upload Photo',
    'dashboard.upcomingMeetups': 'Upcoming Meetups',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Friends
    'friends.title': 'Friends',
    'friends.myFriends': 'My Friends',
    'friends.addNew': 'Add New Friend',
    'friends.searchPlaceholder': 'Search friends...',
    
    // Meetups
    'meetups.title': 'My Meetups',
    'meetups.upcoming': 'Upcoming',
    'meetups.past': 'Past',
    'meetups.create': 'Create New Meetup',
    'meetups.details': 'Details',
    'meetups.chat': 'Chat',
    'meetups.photos': 'Photos',
    
    // Gallery
    'gallery.title': 'Gallery',
    'gallery.myPhotos': 'My Photos',
    'gallery.sharedPhotos': 'Shared Photos',
    'gallery.upload': 'Upload Photo',
    
    // Wall
    'wall.title': 'Community Wall',
    'wall.whatsOnMind': "What's on your mind?",
    'wall.post': 'Post',
    
    // Messages
    'messages.title': 'Messages',
    'messages.direct': 'Direct Messages',
    'messages.groups': 'Group Chats',
    'messages.typing': 'Type a message...',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.posts': 'Posts',
    'profile.photos': 'Photos',
    'profile.friends': 'Friends',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.share': 'Share',
    'common.like': 'Like',
    'common.comment': 'Comment',
  },
  ru: {
    // Navigation
    'nav.dashboard': 'Главная',
    'nav.friends': 'Друзья',
    'nav.create': 'Создать',
    'nav.discover': 'Поиск',
    'nav.meetups': 'Мои встречи',
    'nav.gallery': 'Галерея',
    'nav.wall': 'Стена',
    'nav.messages': 'Сообщения',
    'nav.profile': 'Профиль',
    
    // Dashboard
    'dashboard.title': 'Добро пожаловать в Meet',
    'dashboard.subtitle': 'Ваш спутник для социальных встреч',
    'dashboard.friends': 'Друзья',
    'dashboard.meetups': 'Встречи',
    'dashboard.photos': 'Фото',
    'dashboard.quickActions': 'Быстрые действия',
    'dashboard.createMeetup': 'Создать встречу',
    'dashboard.addFriend': 'Добавить друга',
    'dashboard.uploadPhoto': 'Загрузить фото',
    'dashboard.upcomingMeetups': 'Предстоящие встречи',
    'dashboard.recentActivity': 'Недавняя активность',
    
    // Friends
    'friends.title': 'Друзья',
    'friends.myFriends': 'Мои друзья',
    'friends.addNew': 'Добавить нового друга',
    'friends.searchPlaceholder': 'Поиск друзей...',
    
    // Meetups
    'meetups.title': 'Мои встречи',
    'meetups.upcoming': 'Предстоящие',
    'meetups.past': 'Прошедшие',
    'meetups.create': 'Создать новую встречу',
    'meetups.details': 'Детали',
    'meetups.chat': 'Чат',
    'meetups.photos': 'Фото',
    
    // Gallery
    'gallery.title': 'Галерея',
    'gallery.myPhotos': 'Мои фото',
    'gallery.sharedPhotos': 'Общие фото',
    'gallery.upload': 'Загрузить фото',
    
    // Wall
    'wall.title': 'Общая стена',
    'wall.whatsOnMind': 'О чем думаете?',
    'wall.post': 'Опубликовать',
    
    // Messages
    'messages.title': 'Сообщения',
    'messages.direct': 'Личные сообщения',
    'messages.groups': 'Групповые чаты',
    'messages.typing': 'Введите сообщение...',
    
    // Profile
    'profile.title': 'Профиль',
    'profile.edit': 'Редактировать профиль',
    'profile.posts': 'Посты',
    'profile.photos': 'Фото',
    'profile.friends': 'Друзья',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.share': 'Поделиться',
    'common.like': 'Нравится',
    'common.comment': 'Комментарий',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};