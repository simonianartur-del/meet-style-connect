import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  Image, 
  MessageSquare, 
  Megaphone,
  User,
  Map
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const MobileNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.dashboard'), color: 'text-slate-light' },
    { to: '/friends', icon: Users, label: t('nav.friends'), color: 'text-slate-light' },
    { to: '/messages', icon: MessageSquare, label: t('nav.messages'), color: 'text-slate-light' },
    { to: '/create', icon: Plus, label: t('nav.create'), color: 'text-primary', isSpecial: true },
    { to: '/meetups', icon: Calendar, label: t('nav.meetups'), color: 'text-slate-light' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border-light z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-0 ${
                isActive
                  ? 'bg-primary/10 text-primary scale-110'
                  : `${item.color} hover:bg-accent hover:scale-105`
              } ${item.isSpecial ? 'bg-gradient-primary text-primary-foreground hover:shadow-lg' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={`mb-1 ${isActive ? 'animate-pulse-glow' : ''}`} 
                />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;