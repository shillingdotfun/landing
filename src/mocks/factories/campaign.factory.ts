// src/mocks/factories/campaign.factory.ts

import { faker } from '@faker-js/faker';
import { Campaign, CampaignType, CampaignStatus } from '../../types/campaign.types';

export class CampaignFactory {
  static create(overrides?: Partial<Campaign>): Campaign {
    const type = faker.helpers.arrayElement(['community', 'kol_exclusive']) as CampaignType;
    const budget = faker.number.int({ min: 5000, max: 100000 });
    const participantsCount = faker.number.int({ min: 10, max: 300 });
    
    const campaign: Campaign = {
      id: faker.string.uuid(),
      tokenContractAddress: `$${faker.number.hex({min: 10, max: 10})}`,
      campaignName: `$${faker.word.noun().toUpperCase()}`,
      tokenSymbol: faker.word.noun().substring(0, 4).toUpperCase(),
      type,
      status: 'active' as CampaignStatus,
      
      budget,
      distributedAmount: faker.number.int({ min: 0, max: budget * 0.5 }),
      
      minKarma: type === 'kol_exclusive' ? faker.number.int({ min: 1000, max: 10000 }) : undefined,
      maxParticipants: type === 'kol_exclusive' ? faker.number.int({ min: 5, max: 20 }) : undefined,
      
      keywords: [
        `#${faker.word.noun()}`,
        `$${faker.word.noun().toUpperCase()}`,
      ],
      mentionAccount: `@${faker.internet.displayName()}`,
      
      totalTweets: faker.number.int({ min: 50, max: 500 }),
      totalEngagement: faker.number.int({ min: 100000, max: 2000000 }),
      totalImpressions: faker.number.int({ min: 500000, max: 5000000 }),
      participantsCount,
      
      startsAt: faker.date.past().toISOString(),
      endsAt: faker.date.future().toISOString(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      
      ...overrides,
    };
    
    return campaign;
  }
  
  static createMany(count: number): Campaign[] {
    return Array.from({ length: count }, () => this.create());
  }
  
  static createActive(count: number): Campaign[] {
    return Array.from({ length: count }, () => 
      this.create({ 
        status: CampaignStatus.ACTIVE,
        endsAt: faker.date.soon({ days: 7 }).toISOString()
      })
    );
  }
}
