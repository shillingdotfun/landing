// src/mocks/handlers/index.ts

import { activityHandlers } from "./activity.handlers";
import { campaignsHandlers } from "./campaigns.handlers";
import { kolsHandlers } from "./kols.handlers";

export const handlers = [
  ...campaignsHandlers,
  ...kolsHandlers,
  ...activityHandlers,
];