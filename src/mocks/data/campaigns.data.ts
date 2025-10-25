// src/mocks/data/campaigns.data.ts

import { Campaign, UpdateCampaignDTO } from '../../types/campaign.types';
import { CampaignFactory } from '../factories/campaign.factory';


// Generar data inicial
export let mockCampaigns: Campaign[] = CampaignFactory.createActive(12);

// Funciones para manipular data
export const getCampaigns = () => mockCampaigns;

export const getCampaignById = (id: string) => 
  mockCampaigns.find(c => c.id === id);

export const addCampaign = (campaign: Campaign) => {
  mockCampaigns = [campaign, ...mockCampaigns];
  return campaign;
};

export const updateCampaign = (id: string, updates: Partial<UpdateCampaignDTO>) => {
  mockCampaigns = mockCampaigns.map(c => 
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  return getCampaignById(id);
};

export const resetCampaigns = () => {
  mockCampaigns = CampaignFactory.createActive(12);
};
