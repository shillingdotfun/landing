// src/mocks/handlers/campaigns.handlers.ts

import { http, HttpResponse, delay } from 'msw';
import { 
  getCampaigns, 
  getCampaignById, 
  addCampaign,
  updateCampaign 
} from '../data';
import { CampaignFactory } from '../factories/campaign.factory';
import { CampaignStatus, CreateCampaignDTO } from '../../types/campaign.types';

const API_BASE = import.meta.env.VITE_API_URL;

export const campaignsHandlers = [
  // GET /api/campaigns
  http.get(`${API_BASE}/campaigns`, async ({ request }) => {
    await delay(300);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '10');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    
    let campaigns = getCampaigns();
    
    if (status) {
      campaigns = campaigns.filter(c => c.status === status);
    }
    if (type) {
      campaigns = campaigns.filter(c => c.type.name === type);
    }
    
    const total = campaigns.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = campaigns.slice(start, end);
    
    return HttpResponse.json({
      data,
      meta: {
        currentPage: page,
        lastPage: Math.ceil(total / perPage),
        perPage,
        total,
      },
      links: {
        first: `/api/campaigns?page=1`,
        last: `/api/campaigns?page=${Math.ceil(total / perPage)}`,
        prev: page > 1 ? `/api/campaigns?page=${page - 1}` : null,
        next: page < Math.ceil(total / perPage) ? `/api/campaigns?page=${page + 1}` : null,
      },
    });
  }),

  // GET /api/campaigns/active
  http.get(`${API_BASE}/campaigns/active`, async () => {
    await delay(200);
    
    const campaigns = getCampaigns().filter(c => c.status === 'active');
    
    return HttpResponse.json({
      data: campaigns,
      message: 'Active campaigns retrieved successfully',
      success: true,
    });
  }),

  // GET /api/campaigns/:id
  http.get(`${API_BASE}/campaigns/:id`, async ({ params }) => {
    await delay(200);
    
    const { id } = params;
    const campaign = getCampaignById(id as string);
    
    if (!campaign) {
      return HttpResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      message: 'OK',
      data: campaign,
      success: true,
    });
  }),

  // POST /api/campaigns
  http.post(`${API_BASE}/campaigns`, async ({ request }) => {
    await delay(500);
    
    const body = await request.json() as CreateCampaignDTO;
    
    if (!body.campaignName || !body.budget) {
      return HttpResponse.json(
        { 
          message: 'Validation error',
          errors: {
            campaignName: body.campaignName ? [] : ['Campaign name is required'],
            budget: body.budget ? [] : ['Budget is required'],
          },
          success: false
        },
        { status: 422 }
      );
    }
    
    const newCampaign = CampaignFactory.create({
      campaignName: body.campaignName,
      tokenSymbol: body.tokenSymbol,
      budget: body.budget,
      keywords: body.keywords,
      mentionAccount: body.mentionAccount,
      minKarma: body.minKarma,
      maxParticipants: body.maxParticipants,
      startsAt: body.startsAt,
      endsAt: body.endsAt,
      status: CampaignStatus.ACTIVE,
    });
    
    addCampaign(newCampaign);
    
    return HttpResponse.json({
      data: newCampaign,
      message: 'Campaign created successfully',
    }, { status: 201 });
  }),

  // POST /api/campaigns/:id/join
  http.post(`${API_BASE}/campaigns/:id/join`, async ({ params }) => {
    await delay(400);
    
    const { id } = params;
    const campaign = getCampaignById(id as string);
    
    if (!campaign) {
      return HttpResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    const updatedCampaign = updateCampaign(id as string, {
      budget: campaign.budget,
    });
    
    return HttpResponse.json({
      data: {
        campaign: updatedCampaign,
        message: 'Successfully joined campaign',
      },
    });
  }),

  // GET /api/campaigns/:id/participants
  http.get(`${API_BASE}/campaigns/:id/participants`, async ({ params }) => {
    await delay(300);
    
    const { id } = params;
    const campaign = getCampaignById(id as string);
    
    if (!campaign) {
      return HttpResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    const participants = Array.from({ length: campaign.participantsCount }, (_, i) => ({
      id: `participant-${i}`,
      kolId: `kol-${i}`,
      username: `kol_${i}`,
      joinedAt: new Date().toISOString(),
      totalTweets: Math.floor(Math.random() * 20),
      engagementScore: Math.floor(Math.random() * 1000),
      earnedAmount: Math.floor(Math.random() * 500),
    }));
    
    return HttpResponse.json({
      data: participants,
    });
  }),

  // GET /api/public/campaigns/active
  http.get(`${API_BASE}/public/campaigns/active`, async () => {
    await delay(200);
    
    const campaigns = getCampaigns().filter(c => c.status === 'active');
    
    return HttpResponse.json({
      data: campaigns,
      message: 'Active campaigns retrieved successfully',
      success: true,
    });
  }),

  // GET /api/public/campaigns/:id
  http.get(`${API_BASE}/public/campaigns/:id`, async ({ params }) => {
    await delay(200);
    
    const { id } = params;
    const campaign = getCampaignById(id as string);
    
    if (!campaign) {
      return HttpResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      message: 'OK',
      data: campaign,
      success: true,
    });
  }),
];
