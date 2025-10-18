// src/components/kols/KOLMiniRanking.tsx

import React from 'react';
import { useKOLs } from '../../hooks/useKOLs';
import { KOLMiniCard } from './KOLMiniCard';
import { Spinner } from '../Common/Spinner';


export const KOLMiniRanking: React.FC = () => {
  const { kols, loading } = useKOLs(5);

  return (
    <div className="bg-[#14141f] border border-[#2a2a35] p-5">
      <h3 className="text-xs text-gray-200 mb-5 pb-4 border-b border-[#2a2a35]" >
        TOP KOLS
      </h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {kols.map(kol => (
            <KOLMiniCard key={kol.id} kol={kol} />
          ))}
        </div>
      )}
    </div>
  );
};
