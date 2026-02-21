"use client";

import { UserSimulatorList } from "@/components/simulator/UserSimulatorList";
import { useSubscription } from "@/hooks/use-subscription";

export default function DashboardSimulatorPage() {
  const { subscriptionInfo, loading } = useSubscription();

  return (
    <UserSimulatorList
      basePath="/dashboard/simulator"
      subscriptionsPath="/subscriptions"
      officialSimulatorPath="/simulator"
      subscriptionInfo={subscriptionInfo}
      loadingSubscription={loading}
    />
  );
}
