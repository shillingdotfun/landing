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
    <table className="border border-[#2a2a35] w-full">
      <thead className="grid grid-cols-[80px_1fr_100px_100px_100px_100px_110px_110px_100px] gap-3 px-6 py-5 bg-indigo-500/5 border-b border-[#2a2a35] text-xs">
        <th className="text-center">RANK</th>
        <th>KOL</th>
        <th className="text-center">KARMA</th>
        <th className="text-center">CAMPAIGNS</th>
        <th className="text-center">REACH</th>
        <th className="text-center">EARNINGS</th>
        <th className="text-center">SUCCESS RATE</th>
        <th className="text-center">AVG ENGAGE</th>
        <th className="text-center">STREAK</th>
      </thead>
      <tbody>
      {kols?.map(kol => (
        <KOLRankingRow key={kol.id} kol={kol} />
      ))}
      </tbody>
    </table>
  );
};
