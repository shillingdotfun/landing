// src/components/Campaign/ParticipantsTable.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Participant } from '../../types/campaign.types';

interface ParticipantsTableProps {
  participants: Participant[];
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({ participants }) => {
  const navigate = useNavigate();

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No participants yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#2a2a35] bg-indigo-500/5">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2a2a35]">
            <th className="px-6 py-4 text-left text-xs text-amber-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
              Participant
            </th>
            <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
              Tweets
            </th>
            <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
              Engagement
            </th>
            <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
              Earned
            </th>
            <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr
              key={participant.id}
              className="border-b border-[#2a2a35] items-center hover:bg-indigo-500/5 transition-colors cursor-pointer"
              onClick={() => navigate(`/kols/${participant.id}`)}
            >
              <td className="px-6 py-4 text-amber-500">
                #{index + 1}
              </td>

              <td className="px-6 py-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="text-sm text-gray-200">
                  {participant.anon
                    ? participant.walletAddress?.substring(0, 10)
                    : participant.name}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-400">
                0
              </td>

              <td className="px-6 py-4 text-sm text-indigo-400">
                0
              </td>

              <td className="px-6 py-4 text-sm text-emerald-400">
                0
              </td>

              <td className="px-6 py-4 text-sm">
                {new Date(participant.joinedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
