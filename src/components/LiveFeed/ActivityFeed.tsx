// src/components/activity/ActivityFeed.tsx

import React from 'react';
import { useActivity } from '../../hooks/useActivity';
import { ActivityItem } from './ActivityItem';
import { LiveIndicator } from './LiveIndicator';
import { Spinner } from '../Common/Spinner';


export const ActivityFeed: React.FC = () => {
  const { activities, loading } = useActivity(20);

  return (
    <div className="border border-[#2a2a35] p-5 top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#2a2a35]">
        <h3 className="text-sm text-gray-200" >
          LIVE FEED
        </h3>
        <LiveIndicator />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};
