import { db } from "./db";

export async function hasActiveSubscription(userId: string) {
    const subscription = await db.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            OR: [
                { endDate: null },
                { endDate: { gte: new Date() } }
            ]
        }
    });

    return !!subscription;
}
