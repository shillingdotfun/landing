// src/pages/Home.tsx

import React from 'react';
import Header from '../components/Common/Header';
import { CampaignGrid } from '../components/Campaign/CampaignGrid';
import { KOLMiniRanking } from '../components/KOL/KolMiniRanking';
import { KOLRankingTable } from '../components/KOL/KOLRanking';
import { ActivityFeed } from '../components/LiveFeed/ActivityFeed';


export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      
      <div className="max-w-[1600px] mx-auto p-10 grid grid-cols-[1fr_380px] gap-8">
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Campaigns Section */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm text-gray-200" >
                ACTIVE CAMPAIGNS
              </h2>
              <a 
                href="/campaigns" 
                className="text-[8px] text-indigo-500 px-4 py-2 border border-indigo-500 transition-all hover:bg-indigo-500/10" 
                
              >
                VIEW ALL
              </a>
            </div>
            <CampaignGrid limit={6} />
          </section>

          {/* KOL Ranking Section */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm text-gray-200" >
                TOP KOLS
              </h2>
              <a 
                href="/leaderboard" 
                className="text-[8px] text-indigo-500 px-4 py-2 border border-indigo-500 transition-all hover:bg-indigo-500/10" 
                
              >
                FULL LEADERBOARD
              </a>
            </div>
            <KOLRankingTable limit={8} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          <ActivityFeed />
          <KOLMiniRanking />
        </aside>
      </div>
    </div>
  );
};

export default Home;
