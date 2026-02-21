"use client";

import { OfficialSimulatorLanding } from "@/components/simulator/OfficialSimulator";
import { useSubscription } from "@/hooks/use-subscription";

export default function SimulatorPage() {
  const { subscriptionInfo, loading } = useSubscription();

  return (
    <OfficialSimulatorLanding
      basePath="/simulator"
      subscriptionInfo={subscriptionInfo}
      loadingSubscription={loading}
    />
  );
}
