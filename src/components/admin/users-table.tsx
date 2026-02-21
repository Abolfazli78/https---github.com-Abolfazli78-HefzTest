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
import { Input } from "@/components/ui/input";
import { UserRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Eye, UserCheck, UserX, Trash2, UserCog, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  _count: {
    examAttempts: number;
    supportTickets: number;
  };
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | "">("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === id ? { ...u, isActive: updatedUser.isActive } : u));
        toast.success(!currentStatus ? "کاربر فعال شد" : "کاربر غیرفعال شد");
      } else {
        toast.error("خطا در به‌روزرسانی وضعیت کاربر");
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async () => {
    if (!editingUser || !newRole) return;

    setUpdatingId(editingUser.id);
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: updatedUser.role } : u));
        toast.success("نقش کاربر با موفقیت تغییر کرد");
        setEditingUser(null);
        setNewRole("");
      } else {
        toast.error("خطا در تغییر نقش کاربر");
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    setUpdatingId(deletingUser.id);
    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== deletingUser.id));
        toast.success("کاربر با موفقیت حذف شد");
        setDeletingUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "خطا در حذف کاربر");
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      ADMIN: { label: "مدیر", variant: "default" as const, color: "bg-red-100 text-red-700 border-red-200" },
      INSTITUTE: { label: "موسسه", variant: "secondary" as const, color: "bg-purple-100 text-purple-700 border-purple-200" },
      TEACHER: { label: "معلم", variant: "secondary" as const, color: "bg-blue-100 text-blue-700 border-blue-200" },
      STUDENT: { label: "دانش‌آموز", variant: "secondary" as const, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    };
    const config = roleConfig[role];
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هنوز کاربری وجود ندارد.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو بر اساس نام یا ایمیل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableHead className="text-right">نام</TableHead>
              <TableHead className="text-right">ایمیل</TableHead>
              <TableHead className="text-center">نقش</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">آزمون‌ها</TableHead>
              <TableHead className="text-center">تیکت‌ها</TableHead>
              <TableHead className="text-center">تاریخ ثبت‌نام</TableHead>
              <TableHead className="text-left pl-6">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell dir="ltr" className="text-left text-slate-600">{user.email}</TableCell>
                <TableCell className="text-center">
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-emerald-500" : ""}>
                    {user.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold">{user._count.examAttempts}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold">{user._count.supportTickets}</span>
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </TableCell>
                <TableCell className="pl-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={updatingId === user.id}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`} className="flex items-center">
                          <Eye className="ml-2 h-4 w-4" />
                          مشاهده جزئیات
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingUser(user);
                          setNewRole(user.role);
                        }}
                      >
                        <UserCog className="ml-2 h-4 w-4" />
                        تغییر نقش
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        disabled={updatingId === user.id}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="ml-2 h-4 w-4" />
                            غیرفعال کردن
                          </>
                        ) : (
                          <>
                            <UserCheck className="ml-2 h-4 w-4" />
                            فعال کردن
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف کاربر
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغییر نقش کاربر</DialogTitle>
            <DialogDescription>
              تغییر نقش برای: {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب نقش جدید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">مدیر</SelectItem>
                <SelectItem value="INSTITUTE">موسسه</SelectItem>
                <SelectItem value="TEACHER">معلم</SelectItem>
                <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              انصراف
            </Button>
            <Button onClick={handleRoleChange} disabled={!newRole || updatingId === editingUser?.id}>
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأیید حذف کاربر</DialogTitle>
            <DialogDescription>
              آیا از حذف کاربر <strong>{deletingUser?.name}</strong> اطمینان دارید؟
              این عملیات غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={updatingId === deletingUser?.id}
            >
              حذف کاربر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
