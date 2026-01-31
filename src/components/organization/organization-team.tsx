"use client";

import { useState, useEffect } from "react";
import {
    Users,
    UserPlus,
    Clock,
    MoreVertical,
    Trash2,
    GraduationCap,
    Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PhoneInputSimple } from "@/components/ui/phone-input-simple";
import { toast } from "sonner";

interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

interface Invite {
    id: string;
    phone: string;
    role: string;
    status: string;
    createdAt: string;
}

export function OrganizationTeam({ role }: { role: "INSTITUTE" | "TEACHER" }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [phone, setPhone] = useState("");
    const [isSending, setIsSending] = useState(false);

    const fetchData = async () => {
        try {
            const [membersRes, invitesRes] = await Promise.all([
                fetch("/api/organization/members"),
                fetch("/api/invitations")
            ]);

            if (membersRes.ok) setMembers(await membersRes.json());
            if (invitesRes.ok) setInvites(await invitesRes.json());
        } catch (error) {
            console.error("Error fetching team data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        setIsSending(true);
        try {
            const inviteRole = role === "INSTITUTE" ? "TEACHER" : "STUDENT";
            const res = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, role: inviteRole }),
            });

            if (res.ok) {
                toast.success("دعوت‌نامه با موفقیت ارسال شد");
                setPhone("");
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.error || "خطا در ارسال دعوت‌نامه");
            }
        } catch (_error) {
            toast.error("خطا در برقراری ارتباط");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {role === "INSTITUTE" ? "مدیریت دبیران و کادر" : "مدیریت کلاس"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {role === "INSTITUTE"
                            ? "مدیریت معلمان و کادر آموزشی موسسه"
                            : "مدیریت دانش‌آموزان و اعضای کلاس"}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                            دعوت عضو جدید
                        </CardTitle>
                        <CardDescription>
                            {role === "INSTITUTE"
                                ? "شماره موبایل معلم مورد نظر را وارد کنید"
                                : "شماره موبایل دانش‌آموز مورد نظر را وارد کنید"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <PhoneInputSimple
                                    value={phone}
                                    onChange={setPhone}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                disabled={isSending}
                            >
                                {isSending ? "در حال ارسال..." : "ارسال دعوت‌نامه"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            دعوت‌نامه‌های ارسالی
                        </CardTitle>
                        <CardDescription>وضعیت دعوت‌نامه‌هایی که هنوز پذیرفته نشده‌اند</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">شماره موبایل</TableHead>
                                    <TableHead className="text-center">نقش</TableHead>
                                    <TableHead className="text-center">وضعیت</TableHead>
                                    <TableHead className="text-left">تاریخ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invites.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            دعوت‌نامه فعالی وجود ندارد
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invites.map((invite) => (
                                        <TableRow key={invite.id}>
                                            <TableCell className="font-medium" dir="ltr">{invite.phone}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">
                                                    {invite.role === "TEACHER" ? "معلم" : "دانش‌آموز"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={
                                                    invite.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                                        invite.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" :
                                                            "bg-red-100 text-red-700"
                                                }>
                                                    {invite.status === "PENDING" ? "در انتظار" :
                                                        invite.status === "ACCEPTED" ? "پذیرفته شده" : "رد شده"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-left text-xs text-muted-foreground">
                                                {new Date(invite.createdAt).toLocaleDateString("fa-IR")}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-500" />
                                {role === "INSTITUTE" ? "لیست دبیران" : "لیست دانش‌آموزان"}
                            </CardTitle>
                            <CardDescription>
                                {role === "INSTITUTE"
                                    ? "لیست تمامی دبیران و کادر آموزشی موسسه"
                                    : "لیست تمامی دانش‌آموزان کلاس"}
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="جستجوی اعضا..." className="pr-10 h-10" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right pr-6">نام و نشان</TableHead>
                                <TableHead className="text-right">شماره موبایل</TableHead>
                                <TableHead className="text-center">نقش</TableHead>
                                <TableHead className="text-center">وضعیت</TableHead>
                                <TableHead className="text-left pl-6">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        هنوز عضوی در تیم شما وجود ندارد
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <TableCell className="pr-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell dir="ltr" className="text-slate-500 text-sm">{member.phone}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-sm">
                                                {member.role === "TEACHER" ? (
                                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                                ) : (
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                )}
                                                {member.role === "TEACHER" ? "معلم" : "دانش‌آموز"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50">
                                                فعال
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pl-6 text-left">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="ml-2 h-4 w-4" />
                                                        حذف از تیم
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
