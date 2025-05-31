import React from 'react';
import { NotificationManager } from './AdminNotification';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <NotificationManager>
      {children}
    </NotificationManager>
  );
}