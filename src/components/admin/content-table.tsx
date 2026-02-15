"use client";

import { useState } from "react";
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
import { ContentType } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface HomepageContent {
  id: string;
  type: ContentType;
  title?: string;
  content?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

interface ContentTableProps {
  content: HomepageContent[];
}

export function ContentTable({ content }: ContentTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محتوا مطمئن هستید؟")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("خطا در حذف محتوا");
      }
    } catch (error) {
      alert("خطا در حذف محتوا");
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeLabel = (type: ContentType) => {
    const labels = {
      SLIDER: "اسلایدر",
      BANNER: "بنر",
      TEXT: "متن",
      ANNOUNCEMENT: "اعلان",
    };
    return labels[type];
  };

  if (content.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هنوز محتوایی وجود ندارد. یک محتوای جدید اضافه کنید.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>عنوان</TableHead>
          <TableHead>نوع</TableHead>
          <TableHead>ترتیب</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>تاریخ ایجاد</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {content.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title || "-"}</TableCell>
            <TableCell>
              <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
            </TableCell>
            <TableCell>{item.order}</TableCell>
            <TableCell>
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString("fa-IR")}
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
                    <Link href={`/admin/content/${item.id}`} className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      مشاهده
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/content/${item.id}/edit`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
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

