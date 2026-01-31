"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SubscriptionStatus } from "@/generated";

interface Subscription {
  id: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  user: {
    name: string;
    email: string;
  };
  plan: {
    name: string;
    price: number;
  };
  createdAt: Date;
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const getStatusLabel = (status: SubscriptionStatus) => {
    const labels = {
      ACTIVE: "فعال",
      EXPIRED: "منقضی شده",
      CANCELLED: "لغو شده",
      PENDING: "در انتظار",
    };
    return labels[status];
  };

  const getStatusVariant = (status: SubscriptionStatus) => {
    const variants: Record<SubscriptionStatus, "default" | "secondary" | "outline"> = {
      ACTIVE: "default",
      EXPIRED: "secondary",
      CANCELLED: "outline",
      PENDING: "secondary",
    };
    return variants[status];
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هیچ اشتراکی وجود ندارد.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>کاربر</TableHead>
          <TableHead>پلن</TableHead>
          <TableHead>قیمت</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>شروع</TableHead>
          <TableHead>پایان</TableHead>
          <TableHead>تجدید خودکار</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell>
              <div>
                <p className="font-medium">{subscription.user.name}</p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {subscription.user.email}
                </p>
              </div>
            </TableCell>
            <TableCell>{subscription.plan.name}</TableCell>
            <TableCell>{subscription.plan.price.toLocaleString("fa-IR")} تومان</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(subscription.status)}>
                {getStatusLabel(subscription.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(subscription.startDate).toLocaleDateString("fa-IR")}
            </TableCell>
            <TableCell>
              {subscription.endDate
                ? new Date(subscription.endDate).toLocaleDateString("fa-IR")
                : "-"}
            </TableCell>
            <TableCell>
              <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                {subscription.autoRenew ? "بله" : "خیر"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

