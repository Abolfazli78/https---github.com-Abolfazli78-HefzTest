import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

export default async function LeaderboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Get top users by total score
  const topUsers = await db.leaderboard.findMany({
    where: {
      period: "all",
      examId: null,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      totalScore: "desc",
    },
    take: 100,
  });

  // Get top users by exam
  const examLeaderboards = await db.exam.findMany({
    where: { isActive: true },
    take: 5,
    include: {
      leaderboards: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          totalScore: "desc",
        },
        take: 10,
      },
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">جدول رده‌بندی</h1>
        <p className="text-muted-foreground">برترین کاربران و رتبه‌بندی</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              رده‌بندی کلی
            </CardTitle>
            <CardDescription>برترین کاربران بر اساس امتیاز کل</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topUsers.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500"
                      : index === 1
                      ? "bg-gray-50 dark:bg-gray-800 border-2 border-gray-400"
                      : index === 2
                      ? "bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5" />
                      ) : index === 1 ? (
                        <Medal className="h-5 w-5" />
                      ) : index === 2 ? (
                        <Award className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{entry.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.totalExams} آزمون انجام شده
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{entry.totalScore}</p>
                    <p className="text-sm text-muted-foreground">امتیاز کل</p>
                  </div>
                </div>
              ))}
              {topUsers.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">
                  هنوز هیچ رده‌بندی وجود ندارد
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {examLeaderboards.map((exam) => (
          exam.leaderboards.length > 0 && (
            <Card key={exam.id}>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>رده‌بندی بر اساس این آزمون</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exam.leaderboards.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-6">{index + 1}</span>
                        <p className="font-semibold">{entry.user.name}</p>
                      </div>
                      <Badge variant="default">{entry.totalScore} امتیاز</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
}

