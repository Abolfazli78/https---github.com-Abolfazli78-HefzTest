import { db } from "./db";

export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
}: {
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DISCOUNT";
}) {
  return await db.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}

export async function createDiscountNotification(discountCode: string, percent: number) {
  // Get all active users (students, teachers, institutes)
  const users = await db.user.findMany({
    where: {
      isActive: true,
      role: {
        in: ["STUDENT", "TEACHER", "INSTITUTE"],
      },
    },
    select: { id: true },
  });

  const notifications = users.map((user) =>
    db.notification.create({
      data: {
        userId: user.id,
        title: "🎉 کد تخفیف جدید",
        message: `کد تخفیف ${discountCode} با ${percent}% تخفیف فعال شد!`,
        type: "DISCOUNT",
      },
    })
  );

  // Create notifications in parallel
  await Promise.all(notifications);
}

export async function getUserNotifications(userId: string, limit = 20) {
  return await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  return await db.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: { isRead: true },
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return await db.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}
