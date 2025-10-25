// src/utils/helpers.ts

import { CampaignFunding } from '../types/campaign.types';

export const calculateCampaignFunding = (
  funding: CampaignFunding[],
  budget: number
) => {
  const currentFunds = funding.reduce(
    (sum, funding) => sum + funding.amountPaid,
    0
  );
  const hasPendingFunding = currentFunds < budget;
  const pendingFunds = budget - currentFunds;

  return {
    alreadyFunded: currentFunds,
    hasPendingFunding,
    pendingFunds,
  };
};