// src/pages/CampaignDetail.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import Header from '../components/Common/Header';
import { Spinner } from '../components/Common/Spinner';
import { useCampaignDetail } from '../hooks/campaign/useCampaignDetail';
import { getRandomGradient } from '../utils/constants';
import { formatCurrency, formatTimeRemaining, formatNumber } from '../utils/formatters';
import Button from '../components/Common/Button';
import { useToasts } from '../hooks/useToast';


export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useToasts();
  const navigate = useNavigate();
  const { campaign, participants, activities, loading, error, joinCampaign } = useCampaignDetail(id!);
  const [isJoining, setIsJoining] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Header />
        <div className="max-w-[1200px] mx-auto p-10">
          <ErrorMessage message={error || 'Campaign not found'} />
          <Button
            onClick={() => navigate('/')}
            label="← BACK"
            className='mb-6'
          />
        </div>
      </div>
    );
  }

  const handleJoin = async () => {
    setIsJoining(true);
    const result = await joinCampaign(campaign.id);
    setIsJoining(false);
    
    if (result.success) {
      addNotification('Successfully joined campaign!', 'success');
    } else {
      addNotification(result.error || 'Failed to join campaign', 'error');
    }
  };

  const isCommunity = campaign.type === 'community';
  const progress = ((campaign.distributedAmount / campaign.budget) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      
      <div className="max-w-[1400px] mx-auto p-10">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          label="← BACK"
          className='mb-6'
        />

        {/* Campaign Header */}
        <div className="bg-[#14141f] border border-[#2a2a35] p-8 mb-8">
          <div className="flex items-start gap-8 mb-8">
            <div className={`w-24 h-24 ${getRandomGradient()} flex-shrink-0`} style={{ imageRendering: 'pixelated' }} />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-2xl text-gray-200" >
                  {campaign.projectName}
                </h1>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[8px] border border-indigo-500" >
                  {campaign.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-[8px] border border-purple-500" >
                  {isCommunity ? 'COMMUNITY' : 'KOL EXCLUSIVE'}
                </span>
              </div>
              
              <div className="flex gap-6 text-[9px] text-gray-400 mb-6" >
                {campaign.hashtags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-[8px] text-gray-500 mb-2" >
                    {isCommunity ? 'POOL' : 'BUDGET'}
                  </div>
                  <div className="text-xl text-indigo-400" >
                    {formatCurrency(campaign.budget)}
                  </div>
                </div>
                
                <div>
                  <div className="text-[8px] text-gray-500 mb-2" >
                    PARTICIPANTS
                  </div>
                  <div className="text-xl text-gray-200" >
                    {campaign.participantsCount}
                  </div>
                </div>
                
                <div>
                  <div className="text-[8px] text-gray-500 mb-2" >
                    ENDS IN
                  </div>
                  <div className="text-xl text-amber-400" >
                    {formatTimeRemaining(campaign.endsAt)}
                  </div>
                </div>
                
                <div>
                  <div className="text-[8px] text-gray-500 mb-2" >
                    DISTRIBUTED
                  </div>
                  <div className="text-xl text-emerald-400" >
                    {progress}%
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleJoin}
              disabled={isJoining}
              label={isJoining ? 'JOINING...' : isCommunity ? 'JOIN NOW' : 'APPLY'}
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-6 bg-[#0a0a0f] border border-[#2a2a35] relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[7px] text-gray-500" >
              <span>DISTRIBUTED: {formatCurrency(campaign.distributedAmount)}</span>
              <span>REMAINING: {formatCurrency(campaign.budget - campaign.distributedAmount)}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#14141f] border border-[#2a2a35] p-6">
            <div className="text-[8px] text-gray-500 mb-3" >
              TOTAL ENGAGEMENT
            </div>
            <div className="text-2xl text-indigo-400 mb-2" >
              {formatNumber(campaign.totalEngagement)}
            </div>
            <div className="text-[7px] text-gray-500" >
              Likes, RTs, Replies
            </div>
          </div>

          <div className="bg-[#14141f] border border-[#2a2a35] p-6">
            <div className="text-[8px] text-gray-500 mb-3" >
              TOTAL IMPRESSIONS
            </div>
            <div className="text-2xl text-purple-400 mb-2" >
              {formatNumber(campaign.totalImpressions)}
            </div>
            <div className="text-[7px] text-gray-500" >
              Total Reach
            </div>
          </div>

          <div className="bg-[#14141f] border border-[#2a2a35] p-6">
            <div className="text-[8px] text-gray-500 mb-3" >
              TOTAL TWEETS
            </div>
            <div className="text-2xl text-emerald-400 mb-2" >
              {campaign.totalTweets}
            </div>
            <div className="text-[7px] text-gray-500" >
              Posts Created
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Participants List */}
          <div>
            <h2 className="text-lg text-gray-200 mb-6" >
              PARTICIPANTS ({participants.length})
            </h2>
            
            <div className="bg-[#14141f] border border-[#2a2a35]">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 bg-indigo-500/5 border-b border-[#2a2a35] text-[7px] text-gray-500" >
                <div>RANK</div>
                <div>KOL</div>
                <div>TWEETS</div>
                <div>ENGAGEMENT</div>
                <div>EARNED</div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-[#2a2a35] items-center hover:bg-indigo-500/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/kols/${participant.username}`)}
                  >
                    <div className="text-[12px] text-amber-500" >
                      #{index + 1}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600" style={{ imageRendering: 'pixelated' }} />
                      <div>
                        <div className="text-[10px] text-gray-200" >
                          {participant.username}
                        </div>
                        <div className="text-[7px] text-gray-500" >
                          Joined {new Date(participant.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-gray-400 text-right" >
                      {participant.totalTweets}
                    </div>
                    
                    <div className="text-[10px] text-indigo-400 text-right" >
                      {formatNumber(participant.engagementScore)}
                    </div>
                    
                    <div className="text-[10px] text-emerald-400 text-right" >
                      {formatCurrency(participant.earnedAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg text-gray-200 mb-6" >
              RECENT ACTIVITY
            </h2>
            
            <div className="bg-[#14141f] border border-[#2a2a35] p-6 max-h-[700px] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="p-4 bg-indigo-500/5 border-l-2 border-indigo-500 hover:bg-indigo-500/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[7px] text-gray-500" >
                        {activity.type.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className="text-[6px] text-gray-600" >
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="text-[8px] text-gray-300 mb-2 leading-relaxed" >
                      {activity.description}
                    </div>
                    
                    {activity.stats && (
                      <div className="flex gap-4 text-[7px] text-gray-500" >
                        {activity.stats.likes && (
                          <div className="flex items-center gap-1">
                            <span className="text-indigo-500">♥</span>
                            <span>{activity.stats.likes}</span>
                          </div>
                        )}
                        {activity.stats.retweets && (
                          <div className="flex items-center gap-1">
                            <span className="text-indigo-500">↻</span>
                            <span>{activity.stats.retweets}</span>
                          </div>
                        )}
                        {activity.stats.earned && (
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-500">+</span>
                            <span>${activity.stats.earned.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;