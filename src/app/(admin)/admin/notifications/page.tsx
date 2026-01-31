"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Bell, Send, Trash2, Eye, Users, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DISCOUNT";
  isRead: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [recipientType, setRecipientType] = useState<string>("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userSearch, setUserSearch] = useState<string>("");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error("عنوان و متن اعلان الزامی است");
      return;
    }

    if (recipientType === "USER" && !selectedUserId) {
      toast.error("انتخاب کاربر الزامی است");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          type: "INFO",
          recipientType,
          userId: recipientType === "USER" ? selectedUserId : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`اعلان برای ${data.userCount} کاربر ارسال شد`);
        setBroadcastTitle("");
        setBroadcastMessage("");
        setRecipientType("ALL");
        setSelectedUserId("");
        setUserSearch("");
        fetchNotifications();
      } else {
        const data = await res.json();
        toast.error(data.error || "خطا در ارسال اعلان");
      }
    } catch (error) {
      toast.error("خطا در ارسال اعلان");
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "DISCOUNT":
        return "🎉";
      case "SUCCESS":
        return "✅";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "DISCOUNT":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "SUCCESS":
        return "bg-green-50 border-green-200 text-green-800";
      case "WARNING":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "ERROR":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: "مدیر",
      TEACHER: "معلم",
      STUDENT: "دانش‌آموز",
      INSTITUTE: "موسسه",
    };
    return labels[role as keyof typeof labels] || role;
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">مدیریت اعلانات</h1>
        <p className="text-muted-foreground mt-1">ارسال و مدیریت اعلانات سیستم</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">کل اعلانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">خوانده نشده</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">اعلانات تخفیف</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.byType.DISCOUNT || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">کاربران فعال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(stats.byType).reduce((a, b) => a + b, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Broadcast Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            ارسال اعلان
          </CardTitle>
          <CardDescription>ارسال اعلان به کاربران انتخاب شده</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">گیرندگان اعلان</label>
              <Select value={recipientType} onValueChange={setRecipientType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب گیرندگان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">همه کاربران فعال</SelectItem>
                  <SelectItem value="TEACHER">همه معلمان</SelectItem>
                  <SelectItem value="STUDENT">همه دانش‌آموزان</SelectItem>
                  <SelectItem value="INSTITUTE">همه مدیران موسسه</SelectItem>
                  <SelectItem value="USER">کاربر خاص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recipientType === "USER" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">انتخاب کاربر</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجوی نام کاربر..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                {userSearch.trim() && (
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {filteredUsers.length === 0 ? (
                      <div className="p-3 text-center text-muted-foreground text-sm">
                        کاربری با این مشخصات یافت نشد
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 ${
                            selectedUserId === user.id ? "bg-muted" : ""
                          }`}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setUserSearch(user.name);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {selectedUserId && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>کاربر انتخاب شده: {users.find(u => u.id === selectedUserId)?.name}</span>
                    <button
                      onClick={() => {
                        setSelectedUserId("");
                        setUserSearch("");
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Input
                placeholder="عنوان اعلان"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="متن اعلان"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
            </div>
            <Button
              onClick={handleBroadcast}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "در حال ارسال..." : "ارسال اعلان"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            لیست اعلانات
          </CardTitle>
          <CardDescription>آخرین اعلانات ارسال شده به کاربران</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>گیرنده</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    اعلانی وجود ندارد
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getNotificationIcon(notification.type)}</span>
                        <Badge className={getNotificationColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{notification.user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {getRoleLabel(notification.user.role)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.isRead ? "secondary" : "default"}>
                        {notification.isRead ? "خوانده شده" : "خوانده نشده"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
