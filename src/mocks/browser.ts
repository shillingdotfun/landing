// src/mocks/browser.ts

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Función para simular real-time updates
export const simulateRealtime = async () => {
  const { addActivity } = await import('./data');
  const { ActivityFactory } = await import('./factories/activity.factory');
  
  setInterval(() => {
    const newActivity = ActivityFactory.create({
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    
    addActivity(newActivity);
    
    // Broadcast event (puedes usar custom events)
    window.dispatchEvent(
      new CustomEvent('mock:new-activity', { detail: newActivity })
    );
  }, 10000); // Nueva actividad cada 10 segundos
};
