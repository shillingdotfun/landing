// src/types/websocket.types.ts

import { Activity } from "./activity.types";

export type ClientEvents = {
  activity: Activity
  'campaign-update': unknown
  'kol-update': unknown
}

export type ServerToClientEvents = {
  'activity.new': (activity: Activity) => void
  'campaign.updated': (campaign: unknown) => void
  'kol.metrics-updated': (kol: unknown) => void
}

export type ClientToServerEvents = {
  'join-campaign': (payload: { campaignId: string }) => void
  'leave-campaign': (payload: { campaignId: string }) => void
}
