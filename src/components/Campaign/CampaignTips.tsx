// src/components/Campaign/CampaignTips.tsx

import React from 'react';
import { FaLightbulb } from 'react-icons/fa6';
import ContentBlock from '../Common/layouts/ContentBlock';
import { CAMPAIGN_TIPS } from '../../utils/constants';

export const CampaignTips: React.FC = () => {
  return (
    <ContentBlock title="Tips" className="!bg-purple-100 text-[#3e2b56]">
      <ul>
        {CAMPAIGN_TIPS.map((tip: string, index: number) => (
          <li key={index} className="flex flex-row gap-2 items-center">
            <FaLightbulb />
            {tip}
          </li>
        ))}
      </ul>
    </ContentBlock>
  );
};