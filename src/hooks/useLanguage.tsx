import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back!',
      upcomingMeetups: 'Upcoming Meetups',
      friends: 'Friends',
      photosShared: 'Photos Shared',
      createMeetup: 'Create Meetup',
      addFriend: 'Add Friend',
      uploadPhoto: 'Upload Photo',
      noUpcomingMeetups: 'No upcoming meetups',
      createFirst: 'Create your first meetup!',
      subtitle: 'Welcome back!',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      displayName: 'Display Name',
      welcomeBack: 'Welcome back to Meet',
      createAccount: 'Create your Meet account',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      usernamePlaceholder: 'Choose a username',
      displayNamePlaceholder: 'Enter your display name',
      loginSuccess: 'Successfully logged in!',
      signupSuccess: 'Account created successfully!',
      error: 'An error occurred',
      loading: 'Loading...',
      needAccount: "Don't have an account? Sign up",
      haveAccount: 'Already have an account? Login',
    },
    wall: {
      title: 'Community Wall',
      shareThoughts: "What's on your mind?",
      post: 'Post',
      comment: 'Comment',
      noPosts: 'No posts yet. Be the first to share!',
      postCreated: 'Post created successfully!',
      errorFetching: 'Error fetching posts',
      errorCreating: 'Error creating post',
      errorLiking: 'Error updating like',
    },
    messages: {
      title: 'Messages',
      newChat: 'New Chat',
      back: 'Back to Chats',
      typeMessage: 'Type a message...',
      noChats: 'No chats yet. Start a conversation!',
      noMessages: 'No messages',
      unknownUser: 'Unknown User',
      errorFetching: 'Error fetching chats',
      errorFetchingMessages: 'Error fetching messages',
      errorSending: 'Error sending message',
    },
    map: {
      title: 'Find Friends',
      shareLocation: 'Share Location',
      shareLocationDesc: 'Let friends see your location',
      getCurrentLocation: 'Get Current Location',
      currentLocation: 'Current location',
      mapPlaceholder: 'Interactive Map Coming Soon',
      mapIntegration: 'Map integration will show friend locations',
      nearbyUsers: 'Nearby Friends',
      onlineNow: 'Online now',
      noNearbyUsers: 'No friends nearby',
      enableLocationToSee: 'Enable location sharing to see nearby friends',
      locationUpdated: 'Location updated successfully',
      locationEnabled: 'Location sharing enabled',
      locationDisabled: 'Location sharing disabled',
      errorUpdatingLocation: 'Error updating location',
      errorGettingLocation: 'Error getting your location',
      errorToggling: 'Error toggling location sharing',
      geolocationNotSupported: 'Geolocation is not supported by this browser',
    },
    friends: {
      title: 'Friends',
      myFriends: 'My Friends',
      addNew: 'Add New Friend',
      searchPlaceholder: 'Search friends...',
    },
    meetups: {
      title: 'Meetups',
      create: 'Create Meetup',
      upcoming: 'Upcoming',
      past: 'Past',
      join: 'Join',
      leave: 'Leave',
      noUpcoming: 'No upcoming meetups',
      noPast: 'No past meetups',
    },
    nav: {
      dashboard: 'Dashboard',
      friends: 'Friends',
      messages: 'Messages',
      meetups: 'Meetups',
      discover: 'Discover',
      gallery: 'Gallery',
      map: 'Map',
      profile: 'Profile',
      wall: 'Wall',
      create: 'Create',
    },
    profile: {
      photos: 'Photos',
      posts: 'Posts',
      friends: 'Friends',
      edit: 'Edit Profile',
    },
  },
  ru: {
    dashboard: {
      title: 'Панель управления',
      welcome: 'Добро пожаловать!',
      upcomingMeetups: 'Предстоящие встречи',
      friends: 'Друзья',
      photosShared: 'Поделились фото',
      createMeetup: 'Создать встречу',
      addFriend: 'Добавить друга',
      uploadPhoto: 'Загрузить фото',
      noUpcomingMeetups: 'Нет предстоящих встреч',
      createFirst: 'Создайте свою первую встречу!',
      subtitle: 'Добро пожаловать обратно!',
      quickActions: 'Быстрые действия',
      recentActivity: 'Недавняя активность',
    },
    auth: {
      login: 'Войти',
      logout: 'Выйти',
      signup: 'Регистрация',
      email: 'Электронная почта',
      password: 'Пароль',
      username: 'Имя пользователя',
      displayName: 'Отображаемое имя',
      welcomeBack: 'Добро пожаловать в Meet',
      createAccount: 'Создайте аккаунт Meet',
      emailPlaceholder: 'Введите вашу почту',
      passwordPlaceholder: 'Введите пароль',
      usernamePlaceholder: 'Выберите имя пользователя',
      displayNamePlaceholder: 'Введите отображаемое имя',
      loginSuccess: 'Успешный вход!',
      signupSuccess: 'Аккаунт создан успешно!',
      error: 'Произошла ошибка',
      loading: 'Загрузка...',
      needAccount: 'Нет аккаунта? Зарегистрируйтесь',
      haveAccount: 'Уже есть аккаунт? Войдите',
    },
    wall: {
      title: 'Стена сообщества',
      shareThoughts: 'О чём думаете?',
      post: 'Опубликовать',
      comment: 'Комментарий',
      noPosts: 'Пока нет постов. Будьте первым!',
      postCreated: 'Пост успешно создан!',
      errorFetching: 'Ошибка загрузки постов',
      errorCreating: 'Ошибка создания поста',
      errorLiking: 'Ошибка обновления лайка',
    },
    messages: {
      title: 'Сообщения',
      newChat: 'Новый чат',
      back: 'Назад к чатам',
      typeMessage: 'Введите сообщение...',
      noChats: 'Пока нет чатов. Начните разговор!',
      noMessages: 'Нет сообщений',
      unknownUser: 'Неизвестный пользователь',
      errorFetching: 'Ошибка загрузки чатов',
      errorFetchingMessages: 'Ошибка загрузки сообщений',
      errorSending: 'Ошибка отправки сообщения',
    },
    map: {
      title: 'Найти друзей',
      shareLocation: 'Поделиться местоположением',
      shareLocationDesc: 'Позвольте друзьям видеть ваше местоположение',
      getCurrentLocation: 'Получить текущее местоположение',
      currentLocation: 'Текущее местоположение',
      mapPlaceholder: 'Интерактивная карта скоро',
      mapIntegration: 'Интеграция карты покажет местоположения друзей',
      nearbyUsers: 'Друзья рядом',
      onlineNow: 'Сейчас в сети',
      noNearbyUsers: 'Нет друзей рядом',
      enableLocationToSee: 'Включите геолокацию, чтобы видеть друзей рядом',
      locationUpdated: 'Местоположение обновлено',
      locationEnabled: 'Геолокация включена',
      locationDisabled: 'Геолокация отключена',
      errorUpdatingLocation: 'Ошибка обновления местоположения',
      errorGettingLocation: 'Ошибка получения местоположения',
      errorToggling: 'Ошибка переключения геолокации',
      geolocationNotSupported: 'Геолокация не поддерживается браузером',
    },
    friends: {
      title: 'Друзья',
      myFriends: 'Мои друзья',
      addNew: 'Добавить нового друга',
      searchPlaceholder: 'Поиск друзей...',
    },
    meetups: {
      title: 'Встречи',
      create: 'Создать встречу',
      upcoming: 'Предстоящие',
      past: 'Прошедшие',
      join: 'Присоединиться',
      leave: 'Покинуть',
      noUpcoming: 'Нет предстоящих встреч',
      noPast: 'Нет прошедших встреч',
    },
    nav: {
      dashboard: 'Главная',
      friends: 'Друзья',
      messages: 'Сообщения',
      meetups: 'Встречи',
      discover: 'Поиск',
      gallery: 'Галерея',
      map: 'Карта',
      profile: 'Профиль',
      wall: 'Стена',
      create: 'Создать',
    },
    profile: {
      photos: 'Фото',
      posts: 'Посты',
      friends: 'Друзья',
      edit: 'Редактировать профиль',
    },
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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