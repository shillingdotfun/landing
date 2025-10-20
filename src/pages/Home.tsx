// src/pages/Home.tsx

import React from 'react';

//import allColors from "../assets/images/shilling-logo/all-colors.gif"
//import allColorsMobile from "../assets/images/shilling-logo/all-colors-mobile.gif"

import { CampaignGrid } from '../components/Campaign/CampaignGrid';
import { KOLMiniRanking } from '../components/KOL/KolMiniRanking';
import { KOLRankingTable } from '../components/KOL/KOLRanking';
import { ActivityFeed } from '../components/LiveFeed/ActivityFeed';
import PublicLayout from '../components/Common/layouts/PublicLayout';


export const Home: React.FC = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen">
        <section className='flex flex-col max-w-[1600px] mx-auto p-10 my-12 gap-2'>
          <h2 className='text-2xl'>
            Welcome the Attention Capital Markets
          </h2>
          <h1 className='font-afacad text-5xl font-bold'>
            Work for your bags. Earn from your shill.
          </h1>
        </section>
        <div className="max-w-[1600px] mx-auto p-10 grid grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="flex flex-col gap-8">
            {/* Campaigns Section */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm" >
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
                <h2 className="text-sm" >
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
    </PublicLayout>
  );
};

export default Home;
