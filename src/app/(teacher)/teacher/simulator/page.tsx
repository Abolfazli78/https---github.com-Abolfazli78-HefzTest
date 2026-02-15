"use client";

import { useState, useEffect } from "react";
import { UserSimulatorList } from "@/components/simulator/UserSimulatorList";

export default function TeacherSimulatorPage() {
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
      basePath="/teacher/simulator"
      subscriptionsPath="/teacher/subscriptions"
      officialSimulatorPath="/teacher/simulator/official"
      subscriptionInfo={subscriptionInfo}
      loadingSubscription={loading}
    />
  );
}
