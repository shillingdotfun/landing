// src/components/kols/KOLRankingTable.tsx

import React from 'react';
import { useKOLs } from '../../hooks/useKOLs';
import { KOLRankingRow } from './KOLRankingRow';
import { Spinner } from '../Common/Spinner';
import { ErrorMessage } from '../Common/ErrorMessage';

interface KOLRankingTableProps {
  limit?: number;
}

export const KOLRankingTable: React.FC<KOLRankingTableProps> = ({ limit = 10 }) => {
  const { kols, loading, error } = useKOLs(limit);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="border border-[#2a2a35]">
      <div className="grid grid-cols-[80px_1fr_100px_100px_100px_100px_110px_110px_100px] gap-3 px-6 py-5 bg-indigo-500/5 border-b border-[#2a2a35] text-[7px] text-gray-500" >
        <div className="text-center">RANK</div>
        <div>KOL</div>
        <div className="text-center">KARMA</div>
        <div className="text-center">CAMPAIGNS</div>
        <div className="text-center">REACH</div>
        <div className="text-center">EARNINGS</div>
        <div className="text-center">SUCCESS RATE</div>
        <div className="text-center">AVG ENGAGE</div>
        <div className="text-center">STREAK</div>
      </div>
      {kols.map(kol => (
        <KOLRankingRow key={kol.id} kol={kol} />
      ))}
    </div>
  );
};
