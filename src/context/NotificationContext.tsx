import { createContext } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
