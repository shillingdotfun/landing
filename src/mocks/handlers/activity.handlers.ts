// src/mocks/handlers/activity.handlers.ts

import { http, HttpResponse, delay } from 'msw';
import { getActivities } from '../data';

const API_BASE = import.meta.env.VITE_API_URL;

export const activityHandlers = [
  // GET /api/activities/latest
  http.get(`${API_BASE}/activities/latest`, async ({ request }) => {
    await delay(200);
    
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    const activities = getActivities().slice(0, limit);
    
    return HttpResponse.json({
      data: activities,
    });
  }),

  // GET /api/activities
  http.get(`${API_BASE}/activities`, async ({ request }) => {
    await delay(250);
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '20');
    const type = url.searchParams.get('type');
    const campaignId = url.searchParams.get('campaignId');
    
    let activities = getActivities();
    
    if (type) {
      activities = activities.filter(a => a.type === type);
    }
    if (campaignId) {
      activities = activities.filter(a => a.campaignId === campaignId);
    }
    
    const total = activities.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = activities.slice(start, end);
    
    return HttpResponse.json({
      data,
      meta: {
        currentPage: page,
        lastPage: Math.ceil(total / perPage),
        perPage,
        total,
      },
      links: {
        first: `/api/activities?page=1`,
        last: `/api/activities?page=${Math.ceil(total / perPage)}`,
        prev: page > 1 ? `/api/activities?page=${page - 1}` : null,
        next: page < Math.ceil(total / perPage) ? `/api/activities?page=${page + 1}` : null,
      },
    });
  }),
];
