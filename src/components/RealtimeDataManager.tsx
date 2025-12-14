import React, { useEffect, useState } from 'react';
import { supabaseLive } from '../lib/supabaseService';
import type { User, Event, Achievement, Suggestion } from '../lib/supabase';

interface RealtimeDataManagerProps {
  children: React.ReactNode;
}

export const RealtimeDataManager: React.FC<RealtimeDataManagerProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    console.log('🔄 Setting up real-time subscriptions...');

    // Users subscription
    const unsubscribeUsers = supabaseLive.onUsers({
      onInsert: (user: User) => {
        console.log('👤 New user registered:', user.full_name, user.roll_number);
        setLastUpdate(new Date());
        // You can add toast notifications here
      },
      onUpdate: (user: User) => {
        console.log('👤 User updated:', user.full_name);
        setLastUpdate(new Date());
      },
      onDelete: (user: User) => {
        console.log('👤 User deleted:', user.full_name);
        setLastUpdate(new Date());
      }
    });

    // Events subscription
    const unsubscribeEvents = supabaseLive.onEvents({
      onInsert: (event: Event) => {
        console.log('📅 New event created:', event.title);
        setLastUpdate(new Date());
      },
      onUpdate: (event: Event) => {
        console.log('📅 Event updated:', event.title);
        setLastUpdate(new Date());
      },
      onDelete: (event: Event) => {
        console.log('📅 Event deleted:', event.title);
        setLastUpdate(new Date());
      }
    });

    // Achievements subscription
    const unsubscribeAchievements = supabaseLive.onAchievements({
      onInsert: (achievement: Achievement) => {
        console.log('🏆 New achievement added:', achievement.title);
        setLastUpdate(new Date());
      },
      onUpdate: (achievement: Achievement) => {
        console.log('🏆 Achievement updated:', achievement.title);
        setLastUpdate(new Date());
      },
      onDelete: (achievement: Achievement) => {
        console.log('🏆 Achievement deleted:', achievement.title);
        setLastUpdate(new Date());
      }
    });

    // Suggestions subscription
    const unsubscribeSuggestions = supabaseLive.onSuggestions({
      onInsert: (suggestion: Suggestion) => {
        console.log('💬 New suggestion submitted:', suggestion.title);
        setLastUpdate(new Date());
      },
      onUpdate: (suggestion: Suggestion) => {
        console.log('💬 Suggestion updated:', suggestion.title);
        setLastUpdate(new Date());
      },
      onDelete: (suggestion: Suggestion) => {
        console.log('💬 Suggestion deleted:', suggestion.title);
        setLastUpdate(new Date());
      }
    });

    setIsConnected(true);
    console.log('✅ Real-time subscriptions active');

    // Cleanup function
    return () => {
      console.log('🔄 Cleaning up real-time subscriptions...');
      unsubscribeUsers();
      unsubscribeEvents();
      unsubscribeAchievements();
      unsubscribeSuggestions();
      setIsConnected(false);
    };
  }, []);

  return (
    <div className="relative">
      {/* Real-time status indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isConnected ? '🟢 Live' : '🔴 Disconnected'}
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-500 mt-1">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {children}
    </div>
  );
};

// Hook for real-time data
export const useRealtimeData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: false });
        const { data: achievementsData } = await supabase.from('achievements').select('*').order('achievement_date', { ascending: false });
        const { data: suggestionsData } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false });

        if (usersData) setUsers(usersData);
        if (eventsData) setEvents(eventsData);
        if (achievementsData) setAchievements(achievementsData);
        if (suggestionsData) setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    // Real-time subscriptions
    const unsubscribeUsers = supabaseLive.onUsers({
      onInsert: (user) => setUsers(prev => [user, ...prev]),
      onUpdate: (user) => setUsers(prev => prev.map(u => u.id === user.id ? user : u)),
      onDelete: (user) => setUsers(prev => prev.filter(u => u.id !== user.id))
    });

    const unsubscribeEvents = supabaseLive.onEvents({
      onInsert: (event) => setEvents(prev => [event, ...prev]),
      onUpdate: (event) => setEvents(prev => prev.map(e => e.id === event.id ? event : e)),
      onDelete: (event) => setEvents(prev => prev.filter(e => e.id !== event.id))
    });

    const unsubscribeAchievements = supabaseLive.onAchievements({
      onInsert: (achievement) => setAchievements(prev => [achievement, ...prev]),
      onUpdate: (achievement) => setAchievements(prev => prev.map(a => a.id === achievement.id ? achievement : a)),
      onDelete: (achievement) => setAchievements(prev => prev.filter(a => a.id !== achievement.id))
    });

    const unsubscribeSuggestions = supabaseLive.onSuggestions({
      onInsert: (suggestion) => setSuggestions(prev => [suggestion, ...prev]),
      onUpdate: (suggestion) => setSuggestions(prev => prev.map(s => s.id === suggestion.id ? suggestion : s)),
      onDelete: (suggestion) => setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    });

    return () => {
      unsubscribeUsers();
      unsubscribeEvents();
      unsubscribeAchievements();
      unsubscribeSuggestions();
    };
  }, []);

  return {
    users,
    events,
    achievements,
    suggestions,
    setUsers,
    setEvents,
    setAchievements,
    setSuggestions
  };
};
