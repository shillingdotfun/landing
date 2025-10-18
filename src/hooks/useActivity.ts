// src/hooks/useActivity.ts

import { useState, useEffect } from 'react';
import { activityService } from '../services/activity.service';
import { wsService } from '../services/websocket.service';
import { Activity } from '../types/activity.types';

export const useActivity = (limit = 20) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
    
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const handleMockActivity = (event: CustomEvent) => {
        setActivities(prev => [event.detail, ...prev].slice(0, limit));
      };
      
      window.addEventListener('mock:new-activity', handleMockActivity as EventListener);
      return () => {
        window.removeEventListener('mock:new-activity', handleMockActivity as EventListener);
      };
    } else {
      wsService.connect();
      const unsubscribe = wsService.subscribe('activity', (newActivity: Activity) => {
        setActivities(prev => [newActivity, ...prev].slice(0, limit));
      });
      return () => unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getLatest(limit);
      setActivities(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching activities');
    } finally {
      setLoading(false);
    }
  };

  return { activities, loading, error, refetch: fetchActivities };
};
