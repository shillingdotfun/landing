// src/components/NotificationLayout.tsx
import React from 'react';
import { NotificationProvider } from '../../context/NotificationProvider';
import NotificationToast from './NotificationToast';

interface NotificationLayoutProps {
  children: React.ReactNode;
}

const NotificationLayout: React.FC<NotificationLayoutProps> = ({ children }) => {
  return (
    <NotificationProvider>
      <NotificationToast />
      {children}
    </NotificationProvider>
  );
};

export default NotificationLayout;
