import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Users, Heart, Filter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Discover = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const venues = [
    {
      id: 'venue-1',
      name: 'Blue Bottle Coffee',
      category: 'Cafe',
      rating: 4.5,
      distance: '0.3 miles',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      address: '66 Mint St, San Francisco',
      priceLevel: '$$',
      isOpen: true
    },
    {
      id: 'venue-2',
      name: 'Golden Gate Park',
      category: 'Park',
      rating: 4.8,
      distance: '1.2 miles',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      address: 'Golden Gate Park, San Francisco',
      priceLevel: 'Free',
      isOpen: true
    },
    {
      id: 'venue-3',
      name: 'The Museum of Modern Art',
      category: 'Museum',
      rating: 4.6,
      distance: '2.1 miles',
      image: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=400&h=300&fit=crop',
      address: '151 3rd St, San Francisco',
      priceLevel: '$$$',
      isOpen: false
    }
  ];

  const events = [
    {
      id: 'event-1',
      title: 'Photography Walk & Coffee',
      organizer: 'SF Photo Group',
      date: '2024-08-20',
      time: '10:00 AM',
      attendees: 12,
      maxAttendees: 15,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      location: 'Mission District',
      price: 'Free',
      category: 'Photography'
    },
    {
      id: 'event-2',
      title: 'Cooking Class: Asian Fusion',
      organizer: 'Culinary Adventures',
      date: '2024-08-22',
      time: '6:00 PM',
      attendees: 8,
      maxAttendees: 10,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      location: 'SOMA District',
      price: '$45',
      category: 'Food & Drink'
    },
    {
      id: 'event-3',
      title: 'Sunrise Yoga in the Park',
      organizer: 'Morning Warriors',
      date: '2024-08-25',
      time: '6:30 AM',
      attendees: 20,
      maxAttendees: 25,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      location: 'Dolores Park',
      price: '$15',
      category: 'Fitness'
    }
  ];

  const VenueCard = ({ venue }: { venue: typeof venues[0] }) => (
    <div className="card-premium overflow-hidden interactive cursor-pointer">
      <div className="aspect-video relative">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star size={12} className="text-warning fill-current" />
          <span className="text-xs font-medium">{venue.rating}</span>
        </div>
        {venue.isOpen && (
          <div className="absolute top-3 left-3 bg-success text-success-foreground rounded-full px-2 py-1">
            <span className="text-xs font-medium">Open</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate">{venue.name}</h3>
          <p className="text-sm text-slate-light">{venue.category} • {venue.priceLevel}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin size={12} />
            <span>{venue.distance}</span>
          </div>
          <span className="text-primary font-medium">View Details</span>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: typeof events[0] }) => (
    <div className="card-premium overflow-hidden interactive cursor-pointer">
      <div className="aspect-video relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-medium">{event.price}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Users size={12} />
          <span className="text-xs">{event.attendees}/{event.maxAttendees}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate">{event.title}</h3>
          <p className="text-sm text-slate-light">by {event.organizer}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{event.date} at {event.time}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-light">{event.location}</span>
          <Button size="sm" className="btn-ghost text-xs">
            <Heart size={12} className="mr-1" />
            Join
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate">{t('nav.discover')}</h1>
          
          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search venues or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10"
            />
          </div>

          {/* Filter Button */}
          <Button variant="outline" className="btn-ghost">
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="venues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card rounded-xl p-1">
            <TabsTrigger value="venues" className="rounded-lg">Venues</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate">Popular Venues</h2>
              <span className="text-sm text-muted-foreground">Near you</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {venues.map((venue, index) => (
                <div 
                  key={venue.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VenueCard venue={venue} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate">Upcoming Events</h2>
              <span className="text-sm text-muted-foreground">This week</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {events.map((event, index) => (
                <div 
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Suggestions */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate">AI Suggestions</h2>
          <div className="card-premium p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-xl flex items-center justify-center">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on your interests in photography and outdoor activities, we suggest checking out the Photography Walk & Coffee event this weekend!
              </p>
            </div>
            <Button className="btn-premium">
              View Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;