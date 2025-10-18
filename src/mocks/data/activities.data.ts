// src/mocks/data/activities.data.ts

import { Activity } from '../../types/activity.types';
import { ActivityFactory } from '../factories/activity.factory';

export let mockActivities: Activity[] = ActivityFactory.createMany(50);

export const getActivities = () => mockActivities;

export const getActivityById = (id: string) =>
  mockActivities.find(a => a.id === id);

export const addActivity = (activity: Activity) => {
  mockActivities = [activity, ...mockActivities].slice(0, 100); // Keep last 100
  return activity;
};

export const resetActivities = () => {
  mockActivities = ActivityFactory.createMany(50);
};
