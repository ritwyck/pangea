import React, { useEffect } from 'react';
import type { NotificationData } from '../../types';

interface NotificationsProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    // Auto-remove notifications after their duration
    notifications.forEach((notification) => {
      if (notification.duration > 0) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type} ${notification.timestamp <= Date.now() ? 'show' : ''}`}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getNotificationIcon = (type: NotificationData['type']): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✗';
    case 'warning':
      return '!';
    case 'info':
      return 'i';
    case 'achievement':
      return '★';
    default:
      return '•';
  }
};
