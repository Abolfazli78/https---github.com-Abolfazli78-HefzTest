"use client";

import { useState, useEffect } from "react";
import { OfficialSimulatorLanding } from "@/components/simulator/OfficialSimulator";

export default function InstituteOfficialSimulatorPage() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<{ examSimulatorEnabled?: boolean; hasActiveSubscription?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions/info")
      .then((res) => (res.ok ? res.json() : null))
      .then(setSubscriptionInfo)
      .catch(() => setSubscriptionInfo(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <OfficialSimulatorLanding
      basePath="/institute/simulator/official"
      subscriptionInfo={subscriptionInfo}
      loadingSubscription={loading}
    />
  );
}
