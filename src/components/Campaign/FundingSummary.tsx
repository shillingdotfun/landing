// src/components/Campaign/FundingSummary.tsx

import React from 'react';
import Button from '../Common/Button';
import { formatCurrency } from '../../utils/formatters';
import solanaLogoWhite from '../../assets/images/solana-white.svg';
import { CAMPAIGN_CONSTANTS } from '../../utils/constants';

interface FundingSummaryProps {
  budget: number;
  alreadyFunded: number;
  pendingFunds: number;
  hasPendingFunding: boolean;
  onFundClick: () => void;
}

export const FundingSummary: React.FC<FundingSummaryProps> = ({
  budget,
  alreadyFunded,
  pendingFunds,
  hasPendingFunding,
  onFundClick,
}) => {
  const platformFee = CAMPAIGN_CONSTANTS.PLATFORM_FEE_PERCENTAGE;
  const totalWithFee = hasPendingFunding
    ? pendingFunds + pendingFunds * platformFee
    : budget + budget * platformFee;

  return (
    <div className="flex flex-col gap-4">
      <p>This is the SOL your shillers will work for:</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-100 rounded-md">
          <p className="text-[#3e2b56]">Total campaign budget pool</p>
          <div className="flex flex-row gap-2 items-center font-thin">
            <span>{formatCurrency(budget, 'SOL')}</span>
          </div>
          {hasPendingFunding && (
            <div className="flex flex-row gap-2 items-center font-thin text-[#3e2b56] text-xs mt-4">
              <p>Already paid</p>
              <span className="font-bold">
                {formatCurrency(alreadyFunded, 'SOL')}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 bg-purple-100 rounded-md">
          <p className="text-[#3e2b56]">Total platform fee</p>
          <div className="flex flex-row gap-2 items-center font-thin">
            <span>{formatCurrency(budget * platformFee, 'SOL')}</span>
          </div>
          {hasPendingFunding && (
            <div className="flex flex-row gap-2 items-center font-thin text-[#3e2b56] text-xs mt-4">
              <p>Platform fee already paid</p>
              <span className="font-bold">
                {formatCurrency(alreadyFunded * platformFee, 'SOL')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 p-4 gap-4 bg-slate-300 rounded-md items-center">
        <div>
          <p className="text-[#3e2b56]">
            {hasPendingFunding ? 'Pending' : 'Total'} amount to pay
          </p>
          <div className="flex flex-row gap-2 items-center font-thin">
            <span>{formatCurrency(totalWithFee, 'SOL')}</span>
          </div>
        </div>
        <div>
          <Button
            icon={<img className="h-4 w-4" src={solanaLogoWhite} alt="Solana" />}
            label="Fund campaign"
            onClick={onFundClick}
          />
        </div>
      </div>
    </div>
  );
};
