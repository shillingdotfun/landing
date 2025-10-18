// src/pages/CreateCampaign.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../components/Common/Spinner';
import { CampaignType, CreateCampaignDTO } from '../types/campaign.types';
import { getRandomGradient } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { useCreateCampaign } from '../hooks/campaign/useCreateCampaign';
import { Header } from '../components/Common/Header';
import Button from '../components/Common/Button';
import { useToasts } from '../hooks/useToast';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useToasts();
  const { createCampaign, loading, error } = useCreateCampaign();

  const [formData, setFormData] = useState<CreateCampaignDTO>({
    projectName: '',
    tokenSymbol: '',
    type: CampaignType.COMMUNITY,
    budget: 0,
    hashtags: [''],
    mentionAccount: '',
    startsAt: new Date().toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field: keyof CreateCampaignDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHashtagChange = (index: number, value: string) => {
    const newHashtags = [...formData.hashtags];
    newHashtags[index] = value;
    setFormData(prev => ({ ...prev, hashtags: newHashtags }));
  };

  const addHashtag = () => {
    if (formData.hashtags.length < 5) {
      setFormData(prev => ({ ...prev, hashtags: [...prev.hashtags, ''] }));
    }
  };

  const removeHashtag = (index: number) => {
    if (formData.hashtags.length > 1) {
      const newHashtags = formData.hashtags.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, hashtags: newHashtags }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Token symbol is required';
    } else if (formData.tokenSymbol.length > 10) {
      newErrors.tokenSymbol = 'Token symbol too long (max 10 chars)';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    } else if (formData.budget < 1000) {
      newErrors.budget = 'Minimum budget is $1,000';
    }

    const validHashtags = formData.hashtags.filter(h => h.trim());
    if (validHashtags.length === 0) {
      newErrors.hashtags = 'At least one hashtag is required';
    }

    const startDate = new Date(formData.startsAt);
    const endDate = new Date(formData.endsAt);
    const now = new Date();

    if (startDate < now) {
      newErrors.startsAt = 'Start date must be in the future';
    }

    if (endDate <= startDate) {
      newErrors.endsAt = 'End date must be after start date';
    }

    const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (durationDays < 1) {
      newErrors.endsAt = 'Campaign must last at least 1 day';
    } else if (durationDays > 90) {
      newErrors.endsAt = 'Campaign cannot last more than 90 days';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Clean up hashtags
    const cleanedData = {
      ...formData,
      hashtags: formData.hashtags.filter(h => h.trim()).map(h => {
        const trimmed = h.trim();
        return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
      }),
      mentionAccount: formData.mentionAccount && formData.mentionAccount.trim() 
        ? (formData.mentionAccount.startsWith('@') ? formData.mentionAccount : `@${formData.mentionAccount}`)
        : undefined,
    };

    const result = await createCampaign(cleanedData);
    
    if (result.success && result.campaign) {
      addNotification('Campaign created successfully!', 'success');
      navigate(`/campaigns/${result.campaign.id}`);
    } else {
      addNotification(result.error || 'Failed to create campaign', 'error');
    }
  };

  const estimatedParticipants = Math.floor(formData.budget / 100);
  const averageReward = estimatedParticipants > 0 ? formData.budget / estimatedParticipants : 0;

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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-gray-200 mb-3" >
            CREATE COMMUNITY CAMPAIGN
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed" >
            Launch a community-driven campaign where anyone can participate and earn rewards based on their performance
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <div className="bg-[#14141f] border border-[#2a2a35] p-8">
            <form onSubmit={handleSubmit}>
              {/* Project Info Section */}
              <div className="mb-8">
                <h2 className="text-sm text-indigo-400 mb-6 pb-3 border-b border-[#2a2a35]" >
                  PROJECT INFO
                </h2>

                {/* Project Name */}
                <div className="mb-6">
                  <label className="block text-[9px] text-gray-400 mb-2" >
                    PROJECT NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                    placeholder="e.g. DegenDAO"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                    
                  />
                  {errors.projectName && (
                    <p className="mt-2 text-[7px] text-red-400" >
                      {errors.projectName}
                    </p>
                  )}
                </div>

                {/* Token Symbol */}
                <div className="mb-6">
                  <label className="block text-[9px] text-gray-400 mb-2" >
                    TOKEN SYMBOL *
                  </label>
                  <input
                    type="text"
                    value={formData.tokenSymbol}
                    onChange={(e) => handleChange('tokenSymbol', e.target.value.toUpperCase())}
                    placeholder="e.g. DEGEN"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                    
                  />
                  {errors.tokenSymbol && (
                    <p className="mt-2 text-[7px] text-red-400" >
                      {errors.tokenSymbol}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div className="mb-6">
                  <label className="block text-[9px] text-gray-400 mb-2" >
                    CAMPAIGN POOL (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.budget || ''}
                    onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
                    placeholder="25000"
                    min="1000"
                    step="100"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                    
                  />
                  {errors.budget && (
                    <p className="mt-2 text-[7px] text-red-400" >
                      {errors.budget}
                    </p>
                  )}
                  <p className="mt-2 text-[7px] text-gray-500" >
                    Minimum: $1,000 • Recommended: $10,000+
                  </p>
                </div>
              </div>

              {/* Tracking Section */}
              <div className="mb-8">
                <h2 className="text-sm text-indigo-400 mb-6 pb-3 border-b border-[#2a2a35]" >
                  TRACKING
                </h2>

                {/* Hashtags */}
                <div className="mb-6">
                  <label className="block text-[9px] text-gray-400 mb-2" >
                    HASHTAGS * (MAX 5)
                  </label>
                  {formData.hashtags.map((hashtag, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={hashtag}
                        onChange={(e) => handleHashtagChange(index, e.target.value)}
                        placeholder="#DegenDAO"
                        className="flex-1 px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                        
                      />
                      {formData.hashtags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHashtag(index)}
                          className="px-4 py-3 bg-red-500/20 border border-red-500 text-red-400 text-[10px] hover:bg-red-500/30 transition-colors"
                          
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.hashtags.length < 5 && (
                    <button
                      type="button"
                      onClick={addHashtag}
                      className="mt-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500 text-indigo-400 text-[8px] hover:bg-indigo-500/30 transition-colors"
                      
                    >
                      + ADD HASHTAG
                    </button>
                  )}
                  {errors.hashtags && (
                    <p className="mt-2 text-[7px] text-red-400" >
                      {errors.hashtags}
                    </p>
                  )}
                </div>

                {/* Mention Account */}
                <div className="mb-6">
                  <label className="block text-[9px] text-gray-400 mb-2" >
                    MENTION ACCOUNT (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={formData.mentionAccount}
                    onChange={(e) => handleChange('mentionAccount', e.target.value)}
                    placeholder="@DegenDAO"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                    
                  />
                  <p className="mt-2 text-[7px] text-gray-500" >
                    Twitter account that participants should mention
                  </p>
                </div>
              </div>

              {/* Duration Section */}
              <div className="mb-8">
                <h2 className="text-sm text-indigo-400 mb-6 pb-3 border-b border-[#2a2a35]" >
                  DURATION
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-2" >
                      START DATE *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startsAt}
                      onChange={(e) => handleChange('startsAt', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                      
                    />
                    {errors.startsAt && (
                      <p className="mt-2 text-[7px] text-red-400" >
                        {errors.startsAt}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-2" >
                      END DATE *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endsAt}
                      onChange={(e) => handleChange('endsAt', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#2a2a35] text-gray-200 text-[10px] focus:border-indigo-500 focus:outline-none transition-colors"
                      
                    />
                    {errors.endsAt && (
                      <p className="mt-2 text-[7px] text-red-400" >
                        {errors.endsAt}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 text-[8px]" >
                  {error}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1 px-6 py-4 bg-purple-500/20 border border-purple-500 text-purple-400 text-[10px] hover:bg-purple-500/30 transition-colors"
                  
                >
                  {showPreview ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-4 text-[10px] transition-all ${
                    loading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-purple-600 hover:scale-105'
                  }`}
                  
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      CREATING...
                    </span>
                  ) : (
                    'CREATE CAMPAIGN'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="sticky top-24 h-fit">
            <div className="bg-[#14141f] border border-[#2a2a35] p-6">
              <h3 className="text-sm text-gray-200 mb-6 pb-3 border-b border-[#2a2a35]" >
                PREVIEW
              </h3>

              {showPreview ? (
                <div className="space-y-4">
                  {/* Campaign Card Preview */}
                  <div className="border border-indigo-500/50 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 ${getRandomGradient()}`} style={{ imageRendering: 'pixelated' }} />
                      <div>
                        <div className="text-[11px] text-gray-200" >
                          {formData.projectName || 'PROJECT NAME'}
                        </div>
                        <div className="text-[7px] text-gray-500" >
                          COMMUNITY
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[8px]" >
                      <div>
                        <div className="text-gray-500">POOL</div>
                        <div className="text-indigo-400">{formatCurrency(formData.budget)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">AVG REWARD</div>
                        <div className="text-emerald-400">{formatCurrency(averageReward)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[8px]" >
                      <span className="text-gray-500">EST. PARTICIPANTS</span>
                      <span className="text-gray-200">{estimatedParticipants}</span>
                    </div>

                    <div className="flex justify-between text-[8px]" >
                      <span className="text-gray-500">DURATION</span>
                      <span className="text-gray-200">
                        {Math.ceil((new Date(formData.endsAt).getTime() - new Date(formData.startsAt).getTime()) / (1000 * 60 * 60 * 24))} DAYS
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#2a2a35]">
                      <div className="text-[7px] text-gray-500 mb-2" >
                        HASHTAGS
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.hashtags.filter(h => h.trim()).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-indigo-500/20 border border-indigo-500 text-indigo-400 text-[7px]"
                            
                          >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    {formData.mentionAccount && (
                      <div className="pt-3 border-t border-[#2a2a35]">
                        <div className="text-[7px] text-gray-500 mb-2" >
                          MENTION
                        </div>
                        <div className="text-[8px] text-purple-400" >
                          {formData.mentionAccount.startsWith('@') ? formData.mentionAccount : `@${formData.mentionAccount}`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-[9px] text-gray-500 leading-relaxed" >
                    Fill the form to see a preview of your campaign
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-indigo-500/10 border border-indigo-500 p-4">
              <div className="text-[8px] text-indigo-400 mb-3" >
                💡 TIPS
              </div>
              <ul className="space-y-2 text-[7px] text-gray-400 leading-relaxed" >
                <li>• Higher budgets attract more participants</li>
                <li>• Use unique hashtags for better tracking</li>
                <li>• 7-14 days is optimal duration</li>
                <li>• Clear token symbols work best</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;