import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Image, Plus, UserPlus, Upload, Clock, Activity } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/ui/StatCard';
import QuickAction from '@/components/ui/QuickAction';
import { mockMeetups, mockUserMedia, mockFriends } from '@/data/mockData';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const currentUser = {
    id: user?.id || '',
    name: userProfile?.display_name || user?.user_metadata?.display_name || user?.email || 'User',
    avatar: userProfile?.avatar_url || user?.user_metadata?.avatar_url || `https://i.pravatar.cc/100?seed=${user?.id}`,
    friendsCount: 156, // This would come from actual data
    meetupsCount: 12,  // This would come from actual data
    photosCount: 24,   // This would come from actual data
  };

  const upcomingMeetups = mockMeetups.filter(m => m.status === 'upcoming');

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-subtle px-4 py-8 mb-6">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate">{t('dashboard.title')}</h1>
            <p className="text-slate-light">{t('dashboard.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title={t('dashboard.friends')}
            value={currentUser.friendsCount}
            icon={Users}
            onClick={() => navigate('/friends')}
            className="animate-slide-up"
          />
          <StatCard
            title={t('dashboard.meetups')}
            value={currentUser.meetupsCount}
            icon={Calendar}
            onClick={() => navigate('/meetups')}
            className="animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          />
          <StatCard
            title={t('dashboard.photos')}
            value={currentUser.photosCount}
            icon={Image}
            onClick={() => navigate('/gallery')}
            className="animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 gap-3">
            <QuickAction
              title={t('dashboard.createMeetup')}
              icon={Plus}
              onClick={() => navigate('/create')}
              variant="primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                title={t('dashboard.addFriend')}
                icon={UserPlus}
                onClick={() => navigate('/friends')}
                variant="secondary"
              />
              <QuickAction
                title={t('dashboard.uploadPhoto')}
                icon={Upload}
                onClick={() => navigate('/gallery')}
                variant="accent"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Meetups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate">{t('dashboard.upcomingMeetups')}</h2>
            <button 
              onClick={() => navigate('/meetups')}
              className="text-primary font-medium text-sm hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingMeetups.slice(0, 2).map((meetup, index) => (
              <div 
                key={meetup.id} 
                className="card-premium p-4 interactive cursor-pointer animate-slide-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                onClick={() => navigate(`/meetup/${meetup.id}`)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate truncate">{meetup.title}</h3>
                    <div className="flex items-center space-x-1 text-sm text-slate-light mt-1">
                      <Clock size={14} />
                      <span>{meetup.date} at {meetup.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {meetup.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate">{t('dashboard.recentActivity')}</h2>
          
          <div className="space-y-3">
            {mockUserMedia.slice(0, 2).map((media, index) => {
              const friend = mockFriends.find(f => f.id === media.userId);
              const user = media.userId === currentUser.id ? currentUser : friend;
              
              return (
                <div 
                  key={media.id} 
                  className="card-premium p-4 interactive cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  onClick={() => navigate('/gallery')}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={user?.avatar} 
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <Activity size={14} className="text-primary" />
                        <span className="text-sm font-medium text-slate">
                          {user?.name} shared a photo
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {media.caption}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        src={media.url} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;