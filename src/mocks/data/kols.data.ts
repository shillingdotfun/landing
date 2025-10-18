// src/mocks/data/kols.data.ts

import { KOL } from '../../types/kol.types';
import { KOLFactory } from '../factories/kol.factory';

export let mockKOLs: KOL[] = KOLFactory.createTopKOLs(50);

export const getKOLs = () => mockKOLs;

export const getKOLById = (id: string) => 
  mockKOLs.find(k => k.id === id);

export const getKOLByUsername = (username: string) =>
  mockKOLs.find(k => k.username.toLowerCase() === username.toLowerCase());

export const updateKOL = (id: string, updates: Partial<KOL>) => {
  mockKOLs = mockKOLs.map(k =>
    k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k
  );
  return getKOLById(id);
};

export const resetKOLs = () => {
  mockKOLs = KOLFactory.createTopKOLs(50);
};