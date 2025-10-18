// src/components/activity/ActivityItem.tsx

import React from 'react';
import { Activity } from '../../types/activity.types';
import { formatTimeAgo } from '../../utils/formatters';

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getBorderColor = () => {
    switch (activity.type) {
      case 'new_campaign': return 'border-l-emerald-500';
      case 'milestone': return 'border-l-amber-500';
      default: return 'border-l-indigo-500';
    }
  };

  const getGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-indigo-500 to-purple-600',
      'bg-gradient-to-br from-purple-600 to-pink-600',
      'bg-gradient-to-br from-emerald-500 to-cyan-500',
      'bg-gradient-to-br from-amber-500 to-red-500',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className={`p-4 bg-indigo-500/5 border-l-2 ${getBorderColor()} transition-all hover:bg-indigo-500/10 animate-slideIn`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[7px] text-gray-500" >
          {activity.type.toUpperCase().replace('_', ' ')}
        </span>
        <span className="text-[6px] text-gray-600" >
          {formatTimeAgo(activity.timestamp)}
        </span>
      </div>
      
      <div className="flex gap-3 mb-2">
        <div className={`w-8 h-8 ${getGradient()} flex-shrink-0`} style={{ imageRendering: 'pixelated' }} />
        <div className="flex-1">
          <div className="text-[9px] text-gray-200 mb-1" >
            {activity.campaignName}
          </div>
          <div className="text-[7px] text-gray-400 leading-relaxed" >
            {activity.description}
          </div>
          {activity.stats && (
            <div className="flex gap-4 mt-2 text-[7px] text-gray-500" >
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
                  <span className="text-indigo-500">+</span>
                  <span>${activity.stats.earned.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
