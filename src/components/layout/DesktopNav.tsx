import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar, 
  Image, 
  Search,
  Megaphone,
  Map,
  User
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

const DesktopNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.dashboard') },
    { to: '/friends', icon: Users, label: t('nav.friends') },
    { to: '/messages', icon: MessageSquare, label: t('nav.messages') },
    { to: '/meetups', icon: Calendar, label: t('nav.meetups') },
    { to: '/discover', icon: Search, label: t('nav.discover') },
    { to: '/gallery', icon: Image, label: t('nav.gallery') },
    { to: '/wall', icon: Megaphone, label: t('nav.wall') },
    { to: '/map', icon: Map, label: t('nav.map') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1 mr-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`
          }
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNav;