// src/mocks/handlers/kols.handlers.ts

import { http, HttpResponse, delay } from 'msw';
import { getKOLs, getKOLById, getKOLByUsername } from '../data';

const API_BASE = import.meta.env.VITE_API_URL;


export const kolsHandlers = [
  // GET /api/kols/leaderboard
  http.get(`${API_BASE}/kols/leaderboard`, async ({ request }) => {
    await delay(300);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'karma';
    
    let kols = [...getKOLs()];
    
    switch (sortBy) {
      case 'earnings':
        kols.sort((a, b) => b.totalEarnings - a.totalEarnings);
        break;
      case 'successRate':
        kols.sort((a, b) => b.successRate - a.successRate);
        break;
      case 'reach':
        kols.sort((a, b) => b.totalReach - a.totalReach);
        break;
      default:
        kols.sort((a, b) => b.karmaPoints - a.karmaPoints);
    }
    
    kols = kols.map((kol, index) => ({ ...kol, rank: index + 1 }));
    
    const total = kols.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = kols.slice(start, end);
    
    return HttpResponse.json({
      data,
      meta: {
        currentPage: page,
        lastPage: Math.ceil(total / perPage),
        perPage,
        total,
      },
      links: {
        first: `/api/kols/leaderboard?page=1`,
        last: `/api/kols/leaderboard?page=${Math.ceil(total / perPage)}`,
        prev: page > 1 ? `/api/kols/leaderboard?page=${page - 1}` : null,
        next: page < Math.ceil(total / perPage) ? `/api/kols/leaderboard?page=${page + 1}` : null,
      },
    });
  }),

  // GET /api/kols/:id
  http.get(`${API_BASE}/kols/:id`, async ({ params }) => {
    await delay(200);
    
    const { id } = params;
    const kol = getKOLById(id as string);
    
    if (!kol) {
      return HttpResponse.json(
        { message: 'KOL not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: kol,
    });
  }),

  // GET /api/kols/username/:username
  http.get(`${API_BASE}/kols/username/:username`, async ({ params }) => {
    await delay(200);
    
    const { username } = params;
    const kol = getKOLByUsername(username as string);
    
    if (!kol) {
      return HttpResponse.json(
        { message: 'KOL not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: kol,
    });
  }),

  // GET /api/kols/:id/stats
  http.get(`${API_BASE}/kols/:id/stats`, async ({ params }) => {
    await delay(200);
    
    const { id } = params;
    const kol = getKOLById(id as string);
    
    if (!kol) {
      return HttpResponse.json(
        { message: 'KOL not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: {
        karmaGained: Math.floor(Math.random() * 500),
        earningsToday: Math.floor(Math.random() * 100),
        activeCampaigns: Math.floor(Math.random() * 5),
        recentActivity: Math.floor(Math.random() * 20),
      },
    });
  }),

  // GET /api/kols/:id/campaigns
  http.get(`${API_BASE}/kols/:id/campaigns`, async ({ params }) => {
    await delay(300);
    
    const { id } = params;
    const kol = getKOLById(id as string);
    
    if (!kol) {
      return HttpResponse.json(
        { message: 'KOL not found' },
        { status: 404 }
      );
    }
    
    const campaigns = Array.from({ length: 5 }, (_, i) => ({
      id: `campaign-${i}`,
      campaignName: `$TOKEN_${i}`,
      status: i === 0 ? 'active' : 'ended',
      earnedAmount: Math.floor(Math.random() * 1000),
      engagementScore: Math.floor(Math.random() * 5000),
      success: Math.random() > 0.2,
    }));
    
    return HttpResponse.json({
      data: campaigns,
    });
  }),
];
