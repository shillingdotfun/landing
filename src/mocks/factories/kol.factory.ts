// src/mocks/factories/kol.factory.ts

import { faker } from '@faker-js/faker';
import { KOL } from '../../types/kol.types';

export class KOLFactory {
  static create(overrides?: Partial<KOL>): KOL {
    const totalCampaigns = faker.number.int({ min: 10, max: 100 });
    const successfulCampaigns = faker.number.int({ min: Math.floor(totalCampaigns * 0.7), max: totalCampaigns });
    const followersCount = faker.number.int({ min: 10000, max: 5000000 });
    
    const kol: KOL = {
      id: faker.string.uuid(),
      twitterId: faker.string.numeric(10),
      username: faker.internet.displayName().toLowerCase(),
      displayName: faker.person.fullName(),
      
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      followersCount,
      followingCount: faker.number.int({ min: 100, max: 5000 }),
      
      karmaPoints: faker.number.int({ min: 1000, max: 50000 }),
      level: faker.number.int({ min: 10, max: 50 }),
      totalCampaigns,
      successfulCampaigns,
      totalReach: faker.number.int({ min: 500000, max: 10000000 }),
      totalEarnings: faker.number.int({ min: 10000, max: 500000 }),
      
      successRate: Math.round((successfulCampaigns / totalCampaigns) * 100),
      averageEngagement: faker.number.float({ min: 2.0, max: 12.0, fractionDigits: 2 }),
      currentStreak: faker.number.int({ min: 0, max: 20 }),
      bestStreak: faker.number.int({ min: 5, max: 30 }),
      
      verified: faker.datatype.boolean(0.3),
      verifiedAt: faker.datatype.boolean(0.3) ? faker.date.past().toISOString() : undefined,
      
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      
      ...overrides,
    };
    
    return kol;
  }
  
  static createMany(count: number): KOL[] {
    return Array.from({ length: count }, (_, index) => 
      this.create({ rank: index + 1 })
    );
  }
  
  static createTopKOLs(count: number = 10): KOL[] {
    return Array.from({ length: count }, (_, index) => {
      const isTopThree = index < 3;
      
      return this.create({
        rank: index + 1,
        verified: isTopThree,
        karmaPoints: faker.number.int({ min: 50000 - (index * 5000), max: 50000 - (index * 4000) }),
        level: faker.number.int({ min: 50 - index, max: 50 }),
        successRate: faker.number.int({ min: 90 - index, max: 95 - index }),
        totalEarnings: faker.number.int({ min: 200000 - (index * 10000), max: 250000 - (index * 10000) }),
      });
    });
  }
}