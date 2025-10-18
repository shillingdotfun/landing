// src/services/websocket.service.ts

import { io, Socket } from 'socket.io-client';
import { Activity } from '../types/activity.types';
import { ClientEvents, ClientToServerEvents, ServerToClientEvents } from '../types/websocket.types';

class WebSocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private listeners = new Map<
    keyof ClientEvents,
    // Callbacks set with the propper payload depending the event
    Set<(data: ClientEvents[keyof ClientEvents]) => void>
  >()

  connect() {
    // No conectar si estamos usando mocks
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('🎭 WebSocket disabled (using mocks)');
      return;
    }

    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
    });

    this.socket.on('activity.new', (activity: Activity) => {
      this.emit('activity', activity);
    });

    this.socket.on('campaign.updated', (campaign: any) => {
      this.emit('campaign-update', campaign);
    });

    this.socket.on('kol.metrics-updated', (kol: any) => {
      this.emit('kol-update', kol);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe<K extends keyof ClientEvents>(
    event: K,
    callback: (data: ClientEvents[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event) as Set<(d: ClientEvents[K]) => void>
    set.add(callback)

    return () => {
      set.delete(callback)
      if (set.size === 0) this.listeners.delete(event)
    }
  }

  private emit<K extends keyof ClientEvents>(event: K, data: ClientEvents[K]) {
    const set = this.listeners.get(event) as Set<(d: ClientEvents[K]) => void> | undefined
    set?.forEach((cb) => cb(data))
  }

  joinCampaign(campaignId: string) {
    this.socket?.emit('join-campaign', { campaignId });
  }

  leaveCampaign(campaignId: string) {
    this.socket?.emit('leave-campaign', { campaignId });
  }
}

export const wsService = new WebSocketService();
