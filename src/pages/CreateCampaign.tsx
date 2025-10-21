// src/pages/CreateCampaign.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLightbulb, FaTrash } from 'react-icons/fa6';

import solanaLogo from '../assets/images/solana-logo.svg'

import { CampaignType, CreateCampaignDTO } from '../types/campaign.types';

import { useCreateCampaign } from '../hooks/campaign/useCreateCampaign';
import { useToasts } from '../hooks/useToast';

import Button from '../components/Common/Button';
import GenericTextInput from '../components/Common/inputs/GenericTextInput';
import GenericNumberInput from '../components/Common/inputs/GenericNumberInput';
import ContentBlock from '../components/Common/layouts/ContentBlock';
import GenericTextArea from '../components/Common/inputs/GenericTextArea';
import GenericDateInput from '../components/Common/inputs/GenericDateInput';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useToasts();
  const { createCampaign, loading, response } = useCreateCampaign();

  const [formData, setFormData] = useState<CreateCampaignDTO>({
    campaignName: '',
    campaignDescription: '',
    tokenSymbol: '',
    tokenContractAddress: '',
    type: CampaignType.COMMUNITY,
    budget: undefined,
    maxParticipants: undefined,
    keywords: [''],
    mentionAccount: '',
    startsAt: new Date().toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (field: keyof CreateCampaignDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [''] }));
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newkeywords = [...formData.keywords];
    newkeywords[index] = value;
    setFormData(prev => ({ ...prev, keywords: newkeywords }));
  };

  const addKeyword = () => {
    if (formData.keywords.length < 5) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, ''] }));
    }
  };

  const removeKeyword = (index: number) => {
    if (formData.keywords.length > 1) {
      const newkeywords = formData.keywords.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, keywords: newkeywords }));
    }
  };

  const handleSubmit = async () => {
    // Clean up keywords
    const cleanedData = {
      ...formData,
      keywords: formData.keywords.filter(h => h.trim()).map(h => {
        return h.trim();
      }),
      mentionAccount: formData.mentionAccount && formData.mentionAccount.trim() 
        ? (formData.mentionAccount.startsWith('@') ? formData.mentionAccount : `@${formData.mentionAccount}`)
        : undefined,
    };

    await createCampaign(cleanedData);
  };

  useEffect(() => {
    if (!response) {
      return;
    }
    addNotification(response?.message, response.success ? 'success' : 'error');

    if (response.errors) {
      setErrors(response.errors)
      console.log(response.errors);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto p-10">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          label="← BACK"
          className='mb-6'
        />
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-afacad font-bold uppercase mb-3" >
            Create community campaign
          </h1>
          <p className="leading-relaxed">
            Launch a community-driven campaign where anyone can participate and earn rewards based on their performance
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <div className='grid grid-cols-1 gap-4'>
            {/* Campaign Info Section */}
            <ContentBlock title='Campaign info'>
              <div className='grid grid-cols-2 gap-4'>
                {/* Name */}
                <GenericTextInput
                  value={formData.campaignName}
                  onChange={(e) => handleChange('campaignName', e.target.value)}
                  placeholder="DegenDAO token launch campaign"
                  required={true}
                  label='Campaign name'
                  hasError={errors.campaignName ? true : false}
                  errorMessages={errors.campaignName}
                />
                {/* Budget */}
                <GenericNumberInput
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', parseFloat(e.target.value))}
                  placeholder="0.00"
                  min={0.00}
                  step={0.01}
                  required={true}
                  label='Campaign budget (SOL)'
                  hasError={errors.budget ? true : false}
                  errorMessages={errors.budget}
                  iconSource={<img className='h-4 w-4' src={solanaLogo} />}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                {/* CA */}
                <GenericTextInput
                  value={formData.tokenContractAddress}
                  onChange={(e) => handleChange('tokenContractAddress', e.target.value)}
                  placeholder="So11111111111111111111111111111111111111111"
                  required={true}
                  label='Token contract address'
                  hasError={errors.tokenContractAddress ? true : false}
                  errorMessages={errors.tokenContractAddress}
                />
                {/* Symbol */}
                <GenericTextInput
                  value={formData.tokenSymbol}
                  onChange={(e) => handleChange('tokenSymbol', e.target.value)}
                  placeholder="DEGEN"
                  required={true}
                  label='Token symbol'
                  hasError={errors.tokenSymbol ? true : false}
                  errorMessages={errors.tokenSymbol}
                />
              </div>
              <div className='grid grid-cols-1 gap-4'>
                {/* Description */}
                <GenericTextArea
                  value={formData.campaignDescription}
                  onChange={(e) => handleChange('campaignDescription', e.target.value)}
                  label={'Campaign description'}
                  placeholder='Campaign designed to generate volume on token TGE'
                  rows={5}
                  maxLength={500}
                  showCharCount={true}
                />
              </div>
            </ContentBlock>

            {/* Tracking Section */}
            <ContentBlock title='Tracking'>
              {/* Keywords */}
              <div className='mb-8'>
                <div className='block mb-2'>
                  Keywords <span className='text-red-400'>*</span>
                </div>
                {formData.keywords.map((keyword, index) => (
                    <div key={index} className="flex flex-row gap-2">
                      <GenericTextInput
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        placeholder="DegenDAO"
                      />
                      {formData.keywords.length > 1 && (
                        <Button
                          icon={<FaTrash/>}
                          onClick={() => removeKeyword(index)}
                          className='mb-4'
                        />
                      )}
                    </div>
                ))}
                {formData.keywords.length < 5 && (
                    <Button
                      label='+ Add Keyword'
                      onClick={addKeyword}
                    />
                )}
                {errors.keywords && (
                    <p className="mt-2 text-[7px] text-red-400" >
                      {errors.keywords}
                    </p>
                )}
              </div>

              {/* Mention Account */}
              <GenericTextInput
                value={formData.mentionAccount}
                onChange={(e) => handleChange('mentionAccount', e.target.value)}
                placeholder="@DegenDAO"
                required={false}
                label='Mention account'
                hasError={errors.mentionAccount ? true : false}
                errorMessages={errors.mentionAccount}
              />
            </ContentBlock>

            {/* Duration Section */}
            <ContentBlock title='Duration'>
              <div className='grid grid-cols-2 gap-4'>
                <GenericNumberInput
                  label='Max number of participans'
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', parseFloat(e.target.value))}
                  placeholder='10'
                  hasError={errors.maxParticipants ? true : false}
                  errorMessages={errors.maxParticipants}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <GenericDateInput
                  label='Start date'
                  value={formData.startsAt}
                  required={true}
                  hasError={errors.startsAt ? true : false}
                  errorMessages={errors.startsAt}
                />
                {/* End Date */}
                <GenericDateInput
                  label='End date'
                  value={formData.endsAt}
                  required={true}
                  hasError={errors.endsAt ? true : false}
                  errorMessages={errors.endsAt}
                />
              </div>
            </ContentBlock>

            {/* Submit Button */}
            <div className='flex flex-row justify-end'>
              <Button
                disabled={loading}
                label={loading ? 'Creating...' : 'Create campaign'}
                onClick={handleSubmit}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="sticky top-24 h-fit flex flex-col gap-4">
            {/* Tips */}
            <ContentBlock title='Tips' className="!bg-purple-100 text-[#3e2b56]">
              <ul>
                <li className='flex flex-row gap-2 items-center'><FaLightbulb/>Higher budgets attract more participants</li>
                <li className='flex flex-row gap-2 items-center'><FaLightbulb/>Use unique keywords for better tracking</li>
                <li className='flex flex-row gap-2 items-center'><FaLightbulb/>7-14 days is optimal duration</li>
                <li className='flex flex-row gap-2 items-center'><FaLightbulb/>Clear token symbols work best</li>
              </ul>
            </ContentBlock>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;