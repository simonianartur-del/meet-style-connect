import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, LogOut, Settings } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DesktopNav from './DesktopNav';
import NotificationsDialog from '@/components/dialogs/NotificationsDialog';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border-light">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Meet
          </h1>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="interactive-bounce"
          >
            <Globe size={18} className="mr-1" />
            <span className="text-xs font-medium uppercase">
              {language}
            </span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative interactive-bounce"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.display_name || user?.email} />
                  <AvatarFallback>
                    {(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t('settings.title')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <NotificationsDialog 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
    </header>
  );
};

export default Header;