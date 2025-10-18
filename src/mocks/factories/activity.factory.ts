// src/mocks/factories/activity.factory.ts

import { faker } from '@faker-js/faker';
import { ActivityType, Activity } from '../../types/activity.types';


const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.TWEET,
  ActivityType.RETWEET,
  ActivityType.LIKE,
  ActivityType.MILESTONE,
  ActivityType.NEW_CAMPAIGN,
];

const CAMPAIGN_NAMES = [
  '$WAGMI TOKEN', '$MOON LAUNCH', '$DEGEN PUMP', '$ALPHA DAO', '$PIXEL LAUNCH'
];

export class ActivityFactory {
  static create(overrides?: Partial<Activity>): Activity {
    const type = faker.helpers.arrayElement(ACTIVITY_TYPES);
    const hasSocialStats = ['tweet', 'retweet', 'like'].includes(type);
    
    const activity: Activity = {
      id: faker.string.uuid(),
      type,
      campaignId: faker.string.uuid(),
      campaignName: faker.helpers.arrayElement(CAMPAIGN_NAMES),
      kolId: hasSocialStats ? faker.string.uuid() : undefined,
      kolUsername: hasSocialStats ? faker.internet.displayName().toLowerCase() : undefined,
      
      description: this.generateDescription(type),
      tweetId: hasSocialStats ? faker.string.numeric(19) : undefined,
      content: hasSocialStats ? faker.lorem.sentence() : undefined,
      
      stats: hasSocialStats ? {
        likes: faker.number.int({ min: 10, max: 2000 }),
        retweets: faker.number.int({ min: 5, max: 500 }),
        replies: faker.number.int({ min: 0, max: 100 }),
        impressions: faker.number.int({ min: 1000, max: 50000 }),
        earned: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
      } : undefined,
      
      timestamp: faker.date.recent({ days: 1 }).toISOString(),
      createdAt: faker.date.recent({ days: 1 }).toISOString(),
      
      ...overrides,
    };
    
    return activity;
  }
  
  static createMany(count: number): Activity[] {
    return Array.from({ length: count }, () => this.create())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  private static generateDescription(type: ActivityType): string {
    const username = `@${faker.internet.displayName().toLowerCase()}`;
    
    switch (type) {
      case 'tweet':
        return `${username} shared campaign thread`;
      case 'retweet':
        return `${username} retweeted announcement`;
      case 'like':
        return `${username} liked campaign post`;
      case 'milestone':
        return `Reached ${faker.number.int({ min: 100, max: 1000 })}K total engagement`;
      case 'new_campaign':
        return `New community campaign launched with $${faker.number.int({ min: 10, max: 50 })}K pool`;
      default:
        return faker.lorem.sentence();
    }
  }
}