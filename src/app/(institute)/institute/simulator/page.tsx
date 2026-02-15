"use client";

import { useState, useEffect } from "react";
import { UserSimulatorList } from "@/components/simulator/UserSimulatorList";

export default function InstituteSimulatorPage() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<{ examSimulatorEnabled?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions/info")
      .then((res) => (res.ok ? res.json() : null))
      .then(setSubscriptionInfo)
      .catch(() => setSubscriptionInfo(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserSimulatorList
      basePath="/institute/simulator"
      subscriptionsPath="/institute/subscriptions"
      officialSimulatorPath="/institute/simulator/official"
      subscriptionInfo={subscriptionInfo}
      loadingSubscription={loading}
    />
  );
}
