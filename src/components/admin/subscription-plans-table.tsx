"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  targetRole?: string;
  isActive: boolean;
  createdAt: Date;
}

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
}

export function SubscriptionPlansTable({ plans }: SubscriptionPlansTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این پلن مطمئن هستید؟")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/subscriptions/plans/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("خطا در حذف پلن");
      }
    } catch (error) {
      alert("خطا در حذف پلن");
    } finally {
      setDeletingId(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هیچ پلنی تاکنون ایجاد نشده است. با ایجاد یک پلن جدید شروع کنید.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>نام</TableHead>
          <TableHead>نقش هدف</TableHead>
          <TableHead>قیمت</TableHead>
          <TableHead>مدت زمان</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>تاریخ ایجاد</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell className="font-medium">{plan.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{plan.targetRole || "-"}</Badge>
            </TableCell>
            <TableCell>{plan.price.toLocaleString("fa-IR")} تومان</TableCell>
            <TableCell>{plan.duration} روز</TableCell>
            <TableCell>
              <Badge variant={plan.isActive ? "default" : "secondary"}>
                {plan.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(plan.createdAt).toLocaleDateString("fa-IR")}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/subscriptions/${plan.id}`} className="flex items-center">
                      <Eye className="ml-2 h-4 w-4" />
                      مشاهده
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/subscriptions/${plan.id}`} className="flex items-center">
                      <Edit className="ml-2 h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(plan.id)}
                    disabled={deletingId === plan.id}
                    className="text-red-600"
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

