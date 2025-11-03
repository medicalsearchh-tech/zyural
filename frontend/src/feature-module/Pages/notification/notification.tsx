import { useState, useEffect } from 'react';
import { notifyApi } from '../../../core/utils/api';
import { useUser } from '../../../core/context/UserContext';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notifyApi.getNotifications({ limit: 50 });
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notifyApi.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notifyApi.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notifyApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Close notification panel
    onClose();

    if (notification.link) {
      window.location.href = notification.link;
    }
    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/admin-message');
          break;
        case 'instructor':
          navigate('/instructor/instructor-message');
          break;
        case 'student':
          navigate('/student/student-message');
          break;
        default:
          // If no specific role, use the notification link or default to home
          if (notification.link) {
            window.location.href = notification.link;
          } else {
            navigate('/');
          }
      }
    } else {
      // If user is not logged in, redirect to login
      navigate('/login');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'isax isax-message-text';
      case 'course_approved':
        return 'isax isax-tick-circle';
      case 'course_rejected':
        return 'isax isax-close-circle';
      case 'course_changes_requested':
        return 'isax isax-edit-2';
      case 'new_enrollment':
        return 'isax isax-user-add';
      case 'payment_received':
        return 'isax isax-wallet-money';
      case 'review_posted':
        return 'isax isax-star-1';
      case 'announcement':
        return 'isax isax-notification';
      default:
        return 'isax isax-notification';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-primary';
      case 'course_approved':
        return 'bg-success';
      case 'course_rejected':
        return 'bg-danger';
      case 'course_changes_requested':
        return 'bg-warning';
      case 'new_enrollment':
        return 'bg-info';
      case 'payment_received':
        return 'bg-success';
      case 'review_posted':
        return 'bg-warning';
      case 'announcement':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const older: Notification[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    notifs.forEach(notif => {
      const notifDate = new Date(notif.createdAt);
      if (notifDate >= todayStart) {
        today.push(notif);
      } else if (notifDate >= yesterdayStart) {
        yesterday.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = groupNotificationsByDate(filteredNotifications);

  return (
    <>
      {/* Overlay */}
      <div
        className={`notification-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1049,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
      />

      {/* Notification Panel */}
      <div
        className={`notification-panel ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-400px',
          width: '400px',
          maxWidth: '100%',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1050,
          transition: 'right 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold">Notifications</h5>
            <button
              onClick={onClose}
              className="btn btn-link p-0 text-dark"
              style={{ fontSize: '24px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex gap-2 mb-3">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>

          {/* Actions */}
          {filteredNotifications.length > 0 && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary flex-fill"
                onClick={markAllAsRead}
              >
                <i className="isax isax-tick-circle me-1" />
                Mark all read
              </button>
            </div>
          )}
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-5 px-3">
              <i className="isax isax-notification-bing d-block mb-3" style={{ fontSize: '48px', color: '#d1d5db' }} />
              <h6 className="text-muted">No notifications</h6>
              <p className="text-muted small mb-0">You're all caught up!</p>
            </div>
          ) : (
            <>
              {/* Today */}
              {today.length > 0 && (
                <div className="px-3 py-2">
                  <h6 className="text-muted small fw-semibold mb-2">TODAY</h6>
                  {today.map(notif => (
                    <div
                      key={notif.id}
                      className={`notification-item p-3 mb-2 rounded ${!notif.isRead ? 'bg-soft-primary' : ''}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        position: 'relative'
                      }}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`${getNotificationColor(notif.type)} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            color: '#fff'
                          }}
                        >
                          <i className={getNotificationIcon(notif.type)} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fs-14 fw-semibold mb-1">{notif.title}</h6>
                          <p className="fs-13 text-muted mb-1">{notif.message}</p>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="fs-12 text-muted">{formatTime(notif.createdAt)}</span>
                            {!notif.isRead && (
                              <span
                                className="badge bg-primary"
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  padding: 0,
                                  borderRadius: '50%'
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                        >
                          <i className="isax isax-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Yesterday */}
              {yesterday.length > 0 && (
                <div className="px-3 py-2">
                  <h6 className="text-muted small fw-semibold mb-2">YESTERDAY</h6>
                  {yesterday.map(notif => (
                    <div
                      key={notif.id}
                      className={`notification-item p-3 mb-2 rounded ${!notif.isRead ? 'bg-light' : ''}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`${getNotificationColor(notif.type)} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            color: '#fff'
                          }}
                        >
                          <i className={getNotificationIcon(notif.type)} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fs-14 fw-semibold mb-1">{notif.title}</h6>
                          <p className="fs-13 text-muted mb-1">{notif.message}</p>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="fs-12 text-muted">{formatTime(notif.createdAt)}</span>
                            {!notif.isRead && (
                              <span
                                className="badge bg-primary"
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  padding: 0,
                                  borderRadius: '50%'
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                        >
                          <i className="isax isax-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Older */}
              {older.length > 0 && (
                <div className="px-3 py-2">
                  <h6 className="text-muted small fw-semibold mb-2">OLDER</h6>
                  {older.map(notif => (
                    <div
                      key={notif.id}
                      className={`notification-item p-3 mb-2 rounded ${!notif.isRead ? 'bg-light' : ''}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className={`${getNotificationColor(notif.type)} rounded-circle d-flex align-items-center justify-content-center`}
                          style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            color: '#fff'
                          }}
                        >
                          <i className={getNotificationIcon(notif.type)} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fs-14 fw-semibold mb-1">{notif.title}</h6>
                          <p className="fs-13 text-muted mb-1">{notif.message}</p>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="fs-12 text-muted">{formatTime(notif.createdAt)}</span>
                            {!notif.isRead && (
                              <span
                                className="badge bg-primary"
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  padding: 0,
                                  borderRadius: '50%'
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                        >
                          <i className="isax isax-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;