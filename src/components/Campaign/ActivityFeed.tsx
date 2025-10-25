// src/components/Campaign/ActivityFeed.tsx

import React from 'react';

interface ActivityStats {
  likes?: number;
  retweets?: number;
  earned?: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  stats?: ActivityStats;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="border border-[#2a2a35] p-6 bg-indigo-500/5">
        <div className="text-center py-6 text-gray-400">
          No activity yet
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#2a2a35] p-6 max-h-[700px] bg-indigo-500/5 overflow-y-auto">
      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-indigo-500/5 border-l-2 border-indigo-500 hover:bg-indigo-500/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[7px]">
                {activity.type.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-[6px] text-gray-600">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="text-xs text-gray-300 mb-2 leading-relaxed">
              {activity.description}
            </div>

            {activity.stats && (
              <div className="flex gap-4 text-[7px]">
                {activity.stats.likes && (
                  <div className="flex items-center gap-1">
                    <span className="text-indigo-500">♥</span>
                    <span>{activity.stats.likes}</span>
                  </div>
                )}
                {activity.stats.retweets && (
                  <div className="flex items-center gap-1">
                    <span className="text-indigo-500">↻</span>
                    <span>{activity.stats.retweets}</span>
                  </div>
                )}
                {activity.stats.earned && (
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500">+</span>
                    <span>${activity.stats.earned.toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
