// src/pages/Home.tsx

import React from 'react';
//import allColors from "../assets/images/shilling-logo/all-colors.gif"

import { CampaignGrid } from '../components/Campaign/CampaignGrid';
import { KOLMiniRanking } from '../components/KOL/KolMiniRanking';
import { KOLRankingTable } from '../components/KOL/KOLRanking';
import { ActivityFeed } from '../components/LiveFeed/ActivityFeed';
import PublicLayout from '../components/Common/layouts/PublicLayout';
import Button from '../components/Common/Button';
import { useNavigate } from 'react-router-dom';
import Jumbotron from '../components/Common/Jumbotron';


export const Home: React.FC = () => {
  const navigate = useNavigate()
  return (
    <PublicLayout>
      <div className="min-h-screen">
        <div className='sm:-mx-8 -mx-4'>
          <Jumbotron/>
        </div>
        <div className="max-w-[1600px] mx-auto p-10 grid grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="flex flex-col gap-8">
            {/* Campaigns Section */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-3xl font-bold font-afacad">
                  Trending campaigns
                </h2>
                <Button onClick={() => navigate('/campaigns')} label='Vew all'/>
              </div>
              <CampaignGrid limit={6} />
            </section>

            {/* KOL Ranking Section */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-3xl font-bold font-afacad">
                  Top KOLs
                </h2>
                <Button onClick={() => navigate('/leaderboard')} label='Full leaderboard'/>
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
