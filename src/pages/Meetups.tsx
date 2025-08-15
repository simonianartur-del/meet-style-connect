import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Plus, MessageSquare, Camera } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { mockMeetups, mockFriends, currentUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Meetups = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const upcomingMeetups = mockMeetups.filter(m => m.status === 'upcoming');
  const pastMeetups = mockMeetups.filter(m => m.status === 'completed');

  const MeetupCard = ({ meetup, isPast = false }: { meetup: typeof mockMeetups[0], isPast?: boolean }) => {
    const organizer = meetup.organizer === currentUser.id ? currentUser : mockFriends.find(f => f.id === meetup.organizer);
    
    return (
      <div className="card-premium p-4 space-y-4 interactive cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate">{meetup.title}</h3>
            <p className="text-sm text-slate-light">Organized by {organizer?.name}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
          }`}>
            {isPast ? 'Completed' : 'Upcoming'}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{meetup.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-slate-light">
            <Calendar size={14} />
            <span>{meetup.date}</span>
            <Clock size={14} className="ml-2" />
            <span>{meetup.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-light">
            <MapPin size={14} />
            <span>{meetup.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-light">
            <Users size={14} />
            <span>{meetup.attendees.length} attending</span>
            {meetup.maxAttendees && (
              <span>• Max {meetup.maxAttendees}</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {meetup.attendees.slice(0, 3).map((attendeeId) => {
              const attendee = attendeeId === currentUser.id ? currentUser : mockFriends.find(f => f.id === attendeeId);
              return (
                <div key={attendeeId} className="w-6 h-6 rounded-full overflow-hidden border-2 border-card">
                  <img 
                    src={attendee?.avatar} 
                    alt={attendee?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
            {meetup.attendees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                <span className="text-xs font-medium">+{meetup.attendees.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-2 border-t border-border-light">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <MessageSquare size={12} className="mr-1" />
            {t('meetups.chat')}
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Camera size={12} className="mr-1" />
            {t('meetups.photos')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate">{t('meetups.title')}</h1>
          
          <Button 
            onClick={() => navigate('/create')}
            className="btn-premium"
          >
            <Plus size={18} className="mr-2" />
            {t('meetups.create')}
          </Button>
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card rounded-xl p-1">
            <TabsTrigger value="upcoming" className="rounded-lg">{t('meetups.upcoming')}</TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg">{t('meetups.past')}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingMeetups.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetups.map((meetup, index) => (
                  <div 
                    key={meetup.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/meetup/${meetup.id}`)}
                  >
                    <MeetupCard meetup={meetup} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-premium p-8 text-center">
                <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-slate mb-2">No upcoming meetups</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first meetup and start connecting with friends!
                </p>
                <Button 
                  onClick={() => navigate('/create')}
                  className="btn-premium"
                >
                  <Plus size={18} className="mr-2" />
                  Create Meetup
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastMeetups.length > 0 ? (
              <div className="space-y-4">
                {pastMeetups.map((meetup, index) => (
                  <div 
                    key={meetup.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <MeetupCard meetup={meetup} isPast={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-premium p-8 text-center">
                <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-slate mb-2">No past meetups</h3>
                <p className="text-muted-foreground text-sm">
                  Your completed meetups will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Meetups;