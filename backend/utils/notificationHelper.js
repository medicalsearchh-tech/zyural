const { Notification } = require('../models');

/**
 * Helper functions to create notifications for various events
 */

const createNotification = async (userId, type, title, message, link = null, metadata = {}, priority = 'normal') => {
  try {
    return await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      metadata,
      priority
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Course-related notifications
const notifyCourseApproved = async (instructorId, courseTitle, courseId) => {
  return createNotification(
    instructorId,
    'course_approved',
    'Course Approved! 🎉',
    `Your course "${courseTitle}" has been approved and is now live.`,
    `/instructor/courses/${courseId}`,
    { courseId, courseTitle },
    'high'
  );
};

const notifyCourseRejected = async (instructorId, courseTitle, courseId, reason) => {
  return createNotification(
    instructorId,
    'course_rejected',
    'Course Rejected',
    `Your course "${courseTitle}" was not approved. Reason: ${reason}`,
    `/instructor/courses/${courseId}`,
    { courseId, courseTitle, reason },
    'high'
  );
};

const notifyCourseChangesRequested = async (instructorId, courseTitle, courseId, feedback) => {
  return createNotification(
    instructorId,
    'course_changes_requested',
    'Changes Requested for Your Course',
    `Reviewer has requested changes for "${courseTitle}". Please review the feedback.`,
    `/instructor/courses/${courseId}`,
    { courseId, courseTitle, feedback },
    'high'
  );
};

// Enrollment notifications
const notifyNewEnrollment = async (instructorId, studentName, courseTitle, courseId) => {
  return createNotification(
    instructorId,
    'new_enrollment',
    'New Student Enrollment',
    `${studentName} has enrolled in your course "${courseTitle}".`,
    `/instructor/courses/${courseId}/students`,
    { courseId, courseTitle, studentName },
    'normal'
  );
};

// Payment notifications
const notifyPaymentReceived = async (userId, amount, courseName, paymentId) => {
  return createNotification(
    userId,
    'payment_received',
    'Payment Received',
    `You earned $${amount.toFixed(2)} from "${courseName}".`,
    `/instructor/earnings`,
    { paymentId, amount, courseName },
    'normal'
  );
};

// Review notifications
const notifyNewReview = async (instructorId, studentName, courseTitle, courseId, rating) => {
  return createNotification(
    instructorId,
    'review_posted',
    'New Course Review',
    `${studentName} left a ${rating}-star review on "${courseTitle}".`,
    `/instructor/courses/${courseId}/reviews`,
    { courseId, courseTitle, studentName, rating },
    'normal'
  );
};

// Announcement notifications
const notifyAnnouncement = async (userId, title, message, link = null) => {
  return createNotification(
    userId,
    'announcement',
    title,
    message,
    link,
    {},
    'normal'
  );
};

// System notifications
const notifySystem = async (userId, title, message, link = null, priority = 'normal') => {
  return createNotification(
    userId,
    'system',
    title,
    message,
    link,
    {},
    priority
  );
};

// Bulk notifications
const bulkNotify = async (userIds, type, title, message, link = null, metadata = {}, priority = 'normal') => {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      link,
      metadata,
      priority
    }));
    
    return await Notification.bulkCreate(notifications);
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  notifyCourseApproved,
  notifyCourseRejected,
  notifyCourseChangesRequested,
  notifyNewEnrollment,
  notifyPaymentReceived,
  notifyNewReview,
  notifyAnnouncement,
  notifySystem,
  bulkNotify
};