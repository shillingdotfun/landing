// src/components/activity/ActivityFeed.tsx

import React from 'react';
import { useActivity } from '../../hooks/useActivity';
import { ActivityItem } from './ActivityItem';
import { LiveIndicator } from './LiveIndicator';
import { Spinner } from '../Common/Spinner';
import ContentBlock from '../Common/layouts/ContentBlock';


export const ActivityFeed: React.FC = () => {
  const { activities, loading } = useActivity(20);

  return (
    <ContentBlock className="top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-5 pb-4">
        <h2 className="text-3xl font-bold font-afacad">
          Live feed
        </h2>
        <LiveIndicator />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activities?.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </ContentBlock>
  );
};
