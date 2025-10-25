// src/pages/CampaignDetail.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { CampaignStatus, Participant } from '../types/campaign.types';

import { useToasts } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useJoinCampaign } from '../hooks/campaign/useJoinCampaign';
import { useCampaignDetail } from '../hooks/campaign/useCampaignDetail';
import { useModal } from '../hooks/useModal';

import { formatTimeRemaining, formatNumber, formatCurrency } from '../utils/formatters';
import { calculateCampaignFunding } from '../utils/helpers';

import { ErrorMessage } from '../components/Common/ErrorMessage';
import { Spinner } from '../components/Common/Spinner';
import Modal from '../components/Common/Modal';
import Button from '../components/Common/Button';
import PublicLayout from '../components/Common/layouts/PublicLayout';
import ContentBlock from '../components/Common/layouts/ContentBlock';
import { SolanaPaymentWall } from '../components/Campaign/SolanaPaymentWall';
import { ParticipantsTable } from '../components/Campaign/ParticipantsTable';
import { ActivityFeed } from '../components/Campaign/ActivityFeed';
import { FundingSummary } from '../components/Campaign/FundingSummary';

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
  const [isOwned, setIsOwned] = useState(false);
  const [fundingInfo, setFundingInfo] = useState({
    alreadyFunded: 0,
    hasPendingFunding: false,
    pendingFunds: 0,
  })

  useEffect(() => {
    if (!response) {
      return;
    }
    setIsJoined(response.success);
    addNotification(response.message, response.success ? 'success' : 'error');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    if (!campaign || !userProfile) return;

    setIsJoined(
      campaign.participants.some(
        (participant: Participant) => participant.id === userProfile.id
      )
    );
    setIsOwned(campaign.campaignCreatorUser.id === userProfile.id);

    const funding = calculateCampaignFunding(
      campaign.funding,
      campaign.budget
    );
    setFundingInfo(funding);
  }, [campaign, userProfile]);

  const handleJoin = useCallback(async () => {
    await joinCampaign(id!);
  }, [id, joinCampaign]);

  const handleFundClick = useCallback(() => {
    fundCampaignModal.close();
    paymentWallModal.open();
  }, [fundCampaignModal, paymentWallModal]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen">
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
        <div className="min-h-screen">
          <div className="max-w-[1200px] mx-auto p-10">
            <ErrorMessage message={error || 'Campaign not found'} />
            <Button
              onClick={() => navigate(-1)}
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
          {/* Header and stats */}
          <div className='grid grid-cols-2 gap-8'>
            {/* Campaign Header */}
            <ContentBlock className="mb-8">
              <div className="flex flex-row items-start gap-8 mb-8">
                <div className="flex-1">
                  {/* Creator */}
                  <div className='flex flex-row gap-2 items-center'>
                    <span>Creator:</span> 
                    <span className='flex items-center gap-1'>
                      {campaign.campaignCreatorUser.anon ? campaign.campaignCreatorUser.walletAddress : campaign.campaignCreatorUser.name}
                      <RiVerifiedBadgeFill/>
                    </span>
                  </div>
                  {/* Name, status & type */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 ${campaign.status === CampaignStatus.DRAFT ? 'bg-orange-400 text-white' : campaign.status === CampaignStatus.ACTIVE ? 'bg-green-400' : 'bg-red-400'} text-purple-400 text-xs rounded-full uppercase`}>
                      {campaign.status.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-400 text-xs rounded-full uppercase">
                      {isCommunity ? 'Community' : 'KOL Exclusice'}
                    </span>
                    <h1 className="text-2xl" >
                      {campaign.campaignName}
                    </h1>
                  </div>
                  {/* Description */}
                  <div className="flex flex-row mb-4">
                    <p className="">
                      {campaign.campaignDescription}
                    </p>
                  </div>
                  {/* Creator & keywords */}
                  <div className='grid gird-cols-2 mb-8 gap-4'>
                    <div className="flex flex-row gap-2">
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
                </div>
                <div className='flex flex-row gap-2'>
                  {isOwned && 
                    <Button
                      onClick={() => navigate(`/campaigns/${campaign.id}/edit`) }
                      disabled={isJoining || campaign.status === CampaignStatus.ACTIVE}
                      label={'Edit'}
                    />
                  }
                  <Button
                    onClick={handleJoin}
                    disabled={isJoining || isJoined}
                    label={isJoined ? 'Joined' : isJoining ? 'JOINING...' : isCommunity ? 'Join now' : 'Apply'}
                  />
                </div>
              </div>
              {/* Campaign data */}
              <div className="grid grid-cols-4 gap-6 w-full mb-4">
                <div>
                  <div className="text-xs  mb-2">
                    {isCommunity ? 'POOL' : 'BUDGET'}
                  </div>
                  <div className="text-xl text-indigo-400">
                    {fundingInfo.alreadyFunded.toFixed(2)}/
                    {formatCurrency(campaign.budget /*campaign.funding.reduce((sum: number, funding: CampaignFunding) => sum + funding.amountPaid, 0)*/, 'SOL')}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs uppercase mb-2">
                    Participants
                  </div>
                  <div className="text-xl text-gray-200" >
                    {campaign.participantsCount}{campaign.maxParticipants && campaign.maxParticipants > 0 ? `/${campaign.maxParticipants}` : '' }
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
              <div>
                {isOwned && fundingInfo.hasPendingFunding &&
                  <Button
                    onClick={() => fundCampaignModal.open()}
                    disabled={isJoining || campaign.status === CampaignStatus.ACTIVE}
                    label={`Add pending ${fundingInfo.pendingFunds} SOL`}
                  />
                }
              </div>
            </ContentBlock>

            {/* Stats Grid & Progress */}
            <ContentBlock className="mb-8 flex flex-col justify-center gap-8">
              <div className="grid grid-cols-3 gap-6 text-[#3e2b56] -mt-6">
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
              {/* Progress Bar */}
              <div className="flex flex-col">
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
          </div>

          {/* Participants and activity feed */}
          <div className="grid grid-cols-[1fr_400px] gap-8">
            {/* Participants List */}
            <div className='flex flex-col gap-6'>
              <h2 className="text-lg uppercase font-bold">
                Participants ({campaign.participantsCount})
              </h2>
              
              <ParticipantsTable participants={campaign.participants}/>
            </div>

            {/* Recent Activity */}
            <div className='flex flex-col gap-6'>
              <h2 className="text-lg uppercase font-bold">
                Recent activity
              </h2>
              
              <ActivityFeed activities={activities}/>
            </div>
          </div>
        </div>

        {/* Fund campaign modal */}
        <Modal
          ref={fundCampaignModal.modalRef}
          title="Time to load the bag!"
          animation='slide'
          animationDuration={300}
          maxWidth={'xl'}
          closeOnOverlayClick={false}
          bgColor='bg-slate-200'
          bgHeaderColor='slate-200'
        >
          <FundingSummary
            budget={campaign.budget}
            alreadyFunded={fundingInfo.alreadyFunded}
            pendingFunds={fundingInfo.pendingFunds}
            hasPendingFunding={fundingInfo.hasPendingFunding}
            onFundClick={handleFundClick}
          />
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
            amount={(fundingInfo.pendingFunds).toFixed(6)}
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