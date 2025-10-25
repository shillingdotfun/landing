// src/pages/EditCampaign.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { UpdateCampaignDTO } from '../types/campaign.types';

import { useToasts } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useCampaignDetail } from '../hooks/campaign/useCampaignDetail';
import { useUpdateCampaign } from '../hooks/campaign/useUpdateCampaign';

import solanaLogo from '../assets/images/solana-logo.svg';

import { ErrorMessage } from '../components/Common/ErrorMessage';
import { Spinner } from '../components/Common/Spinner';
import Button from '../components/Common/Button';
import GenericDateInput from '../components/Common/inputs/GenericDateInput';
import GenericNumberInput from '../components/Common/inputs/GenericNumberInput';
import GenericTextArea from '../components/Common/inputs/GenericTextArea';
import GenericTextInput from '../components/Common/inputs/GenericTextInput';
import ContentBlock from '../components/Common/layouts/ContentBlock';
import { KeywordsInput } from '../components/Campaign/KeywordsInput';
import { CampaignTips } from '../components/Campaign/CampaignTips';
import { CAMPAIGN_CONSTANTS } from '../utils/constants';

const cleanFormData = (data: UpdateCampaignDTO): UpdateCampaignDTO => ({
  ...data,
  keywords: data.keywords
    .filter(k => k.trim())
    .map(k => k.trim()),
  mentionAccount: data.mentionAccount?.trim()
    ? (data.mentionAccount.startsWith('@') 
        ? data.mentionAccount 
        : `@${data.mentionAccount}`)
    : undefined,
});

export const EditCampaign: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addNotification } = useToasts();
  const { userProfile } = useAuth();
  const { campaign, loading, error } = useCampaignDetail(id!);
  const { handler: updateHandler, error: updateError, response: updateResponse, initialFormDataHandler } = useUpdateCampaign();

  const [formData, setFormData] = useState<UpdateCampaignDTO>(initialFormDataHandler());
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!campaign) return;

    if (userProfile && userProfile.id !== campaign.campaignCreatorUser.id) {
      addNotification('You are not authorized to edit this campaign', 'error');
      navigate(-1);
      return;
    }

    setFormData({
      id: campaign.id,
      campaignName: campaign.campaignName,
      campaignDescription: campaign.campaignDescription,
      tokenSymbol: campaign.tokenSymbol,
      tokenContractAddress: campaign.tokenContractAddress,
      campaignType: 'community',
      budget: campaign.budget,
      maxParticipants: campaign.maxParticipants,
      keywords: campaign.keywords,
      mentionAccount: campaign.mentionAccount,
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
    });
  }, [campaign, userProfile, navigate, addNotification]);

  // Generic stuff
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleChange = useCallback(<K extends keyof UpdateCampaignDTO>(
    field: K,
    value: UpdateCampaignDTO[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field as string);
  }, [clearFieldError]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const cleanedData = cleanFormData(formData);
      await updateHandler(campaign!.id, cleanedData);
    } catch (error) {
      console.error('Error updating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, campaign]);

  useEffect(() => {
    if (!updateResponse) return;

    addNotification(updateResponse.message, updateResponse.success ? 'success' : 'error');

    if (updateResponse.success && updateResponse.data) {
      navigate(`/campaigns/${updateResponse.data.id}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateResponse, updateError]);

  // Keywords
  const handleKeywordChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newKeywords = [...prev.keywords];
      newKeywords[index] = value;
      return { ...prev, keywords: newKeywords };
    });
    clearFieldError('keywords');
  }, [clearFieldError]);

  const addKeyword = useCallback(() => {
    setFormData(prev => {
      if (prev.keywords.length >= CAMPAIGN_CONSTANTS.MAX_KEYWORDS) return prev;
      return { ...prev, keywords: [...prev.keywords, ''] };
    });
    clearFieldError('keywords');
  }, [clearFieldError]);

  const removeKeyword = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.keywords.length <= CAMPAIGN_CONSTANTS.MIN_KEYWORDS) return prev;
      return {
        ...prev,
        keywords: prev.keywords.filter((_, i) => i !== index),
      };
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1200px] mx-auto p-10">
          <ErrorMessage message={error || 'Campaign not found'} />
          <Button onClick={() => navigate('/')} label="← BACK" className="mb-6" />
        </div>
      </div>
    );
  }

  const isBudgetDisabled = campaign?.funding?.length > 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto p-10">
        <Button onClick={() => navigate('/')} label="← BACK" className="mb-6" />

        <header className="mb-8">
          <h1 className="text-4xl font-afacad font-bold uppercase mb-3">
            Edit community campaign
          </h1>
          <p className="leading-relaxed">
            Update your community-driven campaign settings and parameters
          </p>
        </header>

        <div className="grid grid-cols-[1fr_400px] gap-8">
          <div className="grid grid-cols-1 gap-4">
            <ContentBlock title="Campaign info">
              <div className="grid grid-cols-2 gap-4">
                <GenericTextInput
                  value={formData.campaignName ?? undefined}
                  onChange={(e) => handleChange('campaignName', e.target.value)}
                  placeholder="DegenDAO token launch campaign"
                  required
                  label="Campaign name"
                  hasError={!!errors.campaignName}
                  errorMessages={errors.campaignName}
                />
                <GenericNumberInput
                  value={formData.budget ?? undefined}
                  onChange={(e) => handleChange('budget', parseFloat(e.target.value))}
                  placeholder="0.00"
                  min={0.0}
                  step={0.01}
                  required
                  disabled={isBudgetDisabled}
                  label="Campaign budget (SOL)"
                  hasError={!!errors.budget}
                  errorMessages={errors.budget}
                  iconSource={<img className="h-4 w-4" src={solanaLogo} alt="Solana" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GenericTextInput
                  value={formData.tokenContractAddress ?? undefined}
                  onChange={(e) => handleChange('tokenContractAddress', e.target.value)}
                  placeholder="So11111111111111111111111111111111111111111"
                  label="Token contract address"
                  hasError={!!errors.tokenContractAddress}
                  errorMessages={errors.tokenContractAddress}
                />
                <GenericTextInput
                  value={formData.tokenSymbol ?? undefined}
                  onChange={(e) => handleChange('tokenSymbol', e.target.value)}
                  placeholder="DEGEN"
                  required
                  label="Token symbol"
                  hasError={!!errors.tokenSymbol}
                  errorMessages={errors.tokenSymbol}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <GenericTextArea
                  value={formData.campaignDescription ?? undefined}
                  onChange={(e) => handleChange('campaignDescription', e.target.value)}
                  label="Campaign description"
                  placeholder="Campaign designed to generate volume on token TGE"
                  rows={5}
                  maxLength={CAMPAIGN_CONSTANTS.MAX_DESCRIPTION_LENGTH}
                  showCharCount
                />
              </div>
            </ContentBlock>

            <ContentBlock title="Tracking">
              <KeywordsInput
                keywords={formData.keywords}
                onKeywordChange={handleKeywordChange}
                onAddKeyword={addKeyword}
                onRemoveKeyword={removeKeyword}
                errors={errors.keywords}
              />

              <GenericTextInput
                value={formData.mentionAccount ?? undefined}
                onChange={(e) => handleChange('mentionAccount', e.target.value)}
                placeholder="@DegenDAO"
                label="Mention account"
                hasError={!!errors.mentionAccount}
                errorMessages={errors.mentionAccount}
              />
            </ContentBlock>

            <ContentBlock title="Duration">
              <div className="grid grid-cols-2 gap-4">
                <GenericNumberInput
                  label="Max number of participants"
                  value={formData.maxParticipants ?? undefined}
                  onChange={(e) => handleChange('maxParticipants', parseFloat(e.target.value))}
                  placeholder="10"
                  min={0}
                  hasError={!!errors.maxParticipants}
                  errorMessages={errors.maxParticipants}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GenericDateInput
                  label="Start date"
                  onChange={(isoString) => handleChange('startsAt', isoString)}
                  value={formData.startsAt ?? undefined}
                  required
                  hasError={!!errors.startsAt}
                  errorMessages={errors.startsAt}
                />
                <GenericDateInput
                  label="End date"
                  onChange={(isoString) => handleChange('endsAt', isoString)}
                  value={formData.endsAt ?? undefined}
                  required
                  hasError={!!errors.endsAt}
                  errorMessages={errors.endsAt}
                />
              </div>
            </ContentBlock>

            <div className="flex flex-row justify-end">
              <Button
                disabled={isSubmitting || loading}
                label={isSubmitting ? 'Updating...' : 'Update campaign'}
                onClick={handleSubmit}
              />
            </div>
          </div>

          <aside className="sticky top-24 h-fit flex flex-col gap-4">
            <CampaignTips />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EditCampaign;