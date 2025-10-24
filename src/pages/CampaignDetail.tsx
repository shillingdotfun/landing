// src/pages/CampaignDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useToasts } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useJoinCampaign } from '../hooks/campaign/useJoinCampaign';
import { useCampaignDetail } from '../hooks/campaign/useCampaignDetail';

import { getRandomGradient } from '../utils/constants';
import { formatTimeRemaining, formatNumber, formatCurrency } from '../utils/formatters';

import { ErrorMessage } from '../components/Common/ErrorMessage';
import { Spinner } from '../components/Common/Spinner';
import Button from '../components/Common/Button';
import PublicLayout from '../components/Common/layouts/PublicLayout';
import ContentBlock from '../components/Common/layouts/ContentBlock';
import { Participant } from '../types/campaign.types';
import Modal from '../components/Common/Modal';
import { useModal } from '../hooks/useModal';
import solanaLogoWhite from '../assets/images/solana-white.svg'
import { SolanaPaymentWall } from '../components/Campaign/SolanaPaymentWall';

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const fundCampaignModal = useModal();
  const paymentWallModal = useModal();
  const navigate = useNavigate();

  const { addNotification } = useToasts();
  const { userProfile } = useAuth();

  const { campaign, activities, loading, error } = useCampaignDetail(id!);
  const {response, joinCampaign, loading: isJoining} = useJoinCampaign();
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!response) {
      return;
    }
    setIsJoined(response.success);
    addNotification(response.message, response.success ? 'success' : 'error');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    if (campaign?.participants && userProfile) {
      setIsJoined(campaign.participants.some((participant: Participant) => participant.id === userProfile.id))
    }
  }, [campaign, userProfile])

  const handleJoin = async () => {
    await joinCampaign(id!)
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen  text-white">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !campaign) {
    return (
      <PublicLayout>
        <div className="min-h-screen  text-white">
          <div className="max-w-[1200px] mx-auto p-10">
            <ErrorMessage message={error || 'Campaign not found'} />
            <Button
              onClick={() => navigate('/')}
              label="← BACK"
              className='mb-6'
            />
          </div>
        </div>
      </PublicLayout>
    );
  }

  const isCommunity = campaign.type.name === 'community';
  const progress = ((campaign.distributedAmount / campaign.budget) * 100).toFixed(0);

  return (
    <PublicLayout>
      <div className="min-h-screen  text-white">
        <div className="max-w-[1400px] mx-auto p-10">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            label="← Back"
            className='mb-6'
          />

          {/* Campaign Header */}
          <ContentBlock className="mb-8">
            <div className="flex items-start gap-8 mb-8">
              <div className={`w-24 h-24 rounded ${getRandomGradient()} flex-shrink-0`} style={{ imageRendering: 'pixelated' }} />
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl" >
                    {campaign.campaignName}
                  </h1>
                  <span className="px-3 py-1 bg-purple-100  text-purple-400 text-xs rounded-full uppercase">
                    {campaign.status.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-400 text-xs rounded-full uppercase">
                    {isCommunity ? 'Community' : 'KOL Exclusice'}
                  </span>
                </div>
                
                <div className='grid gird-cols-2 mb-8'>
                  <div className='flex flex-row gap-2'>
                      <span>Creator:</span> <span>{campaign.campaignCreatorUser.walletAddress}</span>
                  </div>
                  <div className="flex flex-col">
                    <p>
                      Tracked keywords:
                    </p>
                    <div className='flex flex-row items-left gap-1 text-xs'>
                      {campaign.keywords.map((tag, i) => (
                        <span className='px-3 py-1 rounded-full border' key={i}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-xs  mb-2">
                      {isCommunity ? 'POOL' : 'BUDGET'}
                    </div>
                    <div className="text-xl text-indigo-400">
                      {formatNumber(campaign.budget)} SOL
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs uppercase mb-2">
                      Participants
                    </div>
                    <div className="text-xl text-gray-200" >
                      {campaign.participantsCount}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs uppercase mb-2">
                      Ends in
                    </div>
                    <div className="text-xl text-amber-400" >
                      {formatTimeRemaining(campaign.endsAt)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs uppercase mb-2">
                      Distributed
                    </div>
                    <div className="text-xl text-emerald-400" >
                      {progress}%
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleJoin}
                disabled={isJoining || isJoined}
                label={isJoined ? 'Joined' : isJoining ? 'JOINING...' : isCommunity ? 'Join now' : 'Apply'}
              />
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-6 border border-purple-100/30 relative overflow-hidden rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs uppercase">
                <span>Distributed: {formatCurrency(campaign.distributedAmount, 'SOL')}</span>
                <span>Remaining: {formatCurrency(campaign.budget - campaign.distributedAmount, 'SOL')}</span>
              </div>
            </div>
          </ContentBlock>

          {/* Stats Grid */}
          <ContentBlock className="mb-8">
          <div className="grid grid-cols-3 gap-6 mb-8 text-[#3e2b56]">
            <div className="rounded-lg bg-purple-100 p-6">
              <div className="text-xs uppercase mb-3">
                Total engagement
              </div>
              <div className="text-2xl text-indigo-400 mb-2" >
                {formatNumber(campaign.totalEngagement)}
              </div>
              <div className="text-xs">
                Likes, RTs, Replies
              </div>
            </div>

            <div className="rounded-lg bg-purple-100 p-6">
              <div className="text-xs uppercase mb-3">
                Total impressions
              </div>
              <div className="text-2xl text-purple-400 mb-2" >
                {formatNumber(campaign.totalImpressions)}
              </div>
              <div className="text-xs">
                Total Reach
              </div>
            </div>

            <div className="rounded-lg bg-purple-100 p-6">
              <div className="text-xs uppercase mb-3">
                Total tweets
              </div>
              <div className="text-2xl text-emerald-400 mb-2" >
                {campaign.totalTweets}
              </div>
              <div className="text-xs">
                Posts Created
              </div>
            </div>
          </div>
          </ContentBlock>

          {/* Two Column Layout */}
          <div className="grid grid-cols-[1fr_400px] gap-8">
            {/* Participants List */}
            <div>
              <h2 className="text-lg mb-6 uppercase">
                Participants ({campaign.participantsCount})
              </h2>
              
              <table className="border border-[#2a2a35] w-full">
                <thead className="bg-indigo-500/5 border-b border-[#2a2a35] text-xs">
                  <tr className='text-xs uppercase text-left'>
                    <th className='px-6 py-4'>Rank</th>
                    <th className='px-6 py-4'>KOL</th>
                    <th className='px-6 py-4'>Posts</th>
                    <th className='px-6 py-4'>Engagement</th>
                    <th className='px-6 py-4'>Earned</th>
                    <th className='px-6 py-4'>Join date</th>
                  </tr>
                </thead>
                
                <tbody className="max-h-[600px] overflow-y-auto">
                  {campaign.participants.map((participant, index) => (
                    <tr 
                      key={participant.id}
                      className="border-b border-[#2a2a35] items-center hover:bg-indigo-500/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/kols/${participant.id}`)}
                    >
                      <td className="px-6 py-4 text-amber-500" >
                        #{index + 1}
                      </td>
                      
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded" style={{ imageRendering: 'pixelated' }} />
                        <div className="text-sm text-gray-200" >
                            {participant.name}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {/* TODO: participant.totalTweets */} 0
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-indigo-400">
                        {/* TODO: formatNumber(participant.engagementScore)} */} 0
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {/* TODO: formatNumber(participant.earnedAmount)} */} 0
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(participant.joinedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg mb-6 uppercase">
                Recent activity
              </h2>
              
              <div className="border border-[#2a2a35] p-6 max-h-[700px] overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="p-4 bg-indigo-500/5 border-l-2 border-indigo-500 hover:bg-indigo-500/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[7px] " >
                          {activity.type.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className="text-[6px] text-gray-600" >
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-300 mb-2 leading-relaxed" >
                        {activity.description}
                      </div>
                      
                      {activity.stats && (
                        <div className="flex gap-4 text-[7px] " >
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

              {/* Fund campaign modal */}
      <Modal
        ref={fundCampaignModal.modalRef}
        title="Time to load the bag!"
        animation='slide'
        animationDuration={300}
        maxWidth={'lg'}
        closeOnOverlayClick={false}
        bgColor='bg-slate-200'
        bgHeaderColor='slate-200'
      >
        {campaign.budget &&
          <div className='flex flex-col gap-4'>
            <p>This is the SOL your shillers will work for:</p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 bg-purple-100 rounded-md'>
                <p className='text-[#3e2b56]'>Campaign budget pool</p>
                <div className='flex flex-row gap-2 items-center font-thin'>
                  <span>{formatCurrency(campaign.budget, 'SOL')}</span>
                </div>
              </div>
              <div className='p-4 bg-purple-100 rounded-md'>
                <p className='text-[#3e2b56]'>Platform fee</p>
                <div className='flex flex-row gap-2 items-center font-thin'>
                  <span>{formatCurrency(campaign.budget * 0.1, 'SOL')}</span>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 p-4 gap-4 bg-slate-300 rounded-md items-center'>
              <div>
                <p className='text-[#3e2b56]'>Total amount to pay</p>
                <div className='flex flex-row gap-2 items-center font-thin'>
                  <span>{formatCurrency(campaign.budget + (campaign.budget * 0.1), 'SOL')}</span>
                </div>
              </div>
              <div>
                <Button
                  icon={<img className='h-4 w-4' src={solanaLogoWhite} />}
                  label='Fund campaign'
                  onClick={() => {
                    fundCampaignModal.close();
                    paymentWallModal.open();
                  }}
                />
              </div>
            </div>
          </div>
        }
      </Modal>
      
      {/* Checkout modal */}
      <Modal 
        title={'Funding > Payment'} 
        ref={paymentWallModal.modalRef}
        animation='slide'
        animationDuration={300}
        maxWidth={'xl'}
        closeOnOverlayClick={false}
        bgColor='bg-slate-200'
        bgHeaderColor='slate-200'
      >
        <SolanaPaymentWall
          amount={(campaign.budget! + (campaign.budget! * 0.1)).toFixed(6)}
          symbol={'SOL'}
          description={`Campaign pool funding`}
          orderId={`pool_funding-${userProfile?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
          onSuccess={() => alert('bien')}
          onError={() => alert('error')}
        />
      </Modal>
      </div>
    </PublicLayout>
  );
};

export default CampaignDetail;