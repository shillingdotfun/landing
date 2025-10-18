// src/types/kol.types.ts

export interface KOL {
  id: string;
  twitterId: string;
  username: string;
  displayName: string;
  
  // Profile
  bio?: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
  
  // Metrics
  karmaPoints: number;
  level: number;
  totalCampaigns: number;
  successfulCampaigns: number;
  totalReach: number;
  totalEarnings: number;
  
  // Performance
  successRate: number;
  averageEngagement: number;
  currentStreak: number;
  bestStreak: number;
  
  // Status
  verified: boolean;
  verifiedAt?: string;
  
  // Dates
  createdAt: string;
  updatedAt: string;
  
  // Computed
  rank?: number;
}

export interface KOLStats {
  karmaGained: number;
  earningsToday: number;
  activeCampaigns: number;
  recentActivity: number;
}
