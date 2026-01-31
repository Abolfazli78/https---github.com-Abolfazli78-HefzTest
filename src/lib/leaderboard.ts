import { db } from "./db";

export async function updateLeaderboard(userId: string, examId: string | null, score: number) {
  try {
    // Update overall leaderboard
    const existingOverall = await db.leaderboard.findFirst({
      where: {
        userId,
        examId: null,
        period: "all",
      },
    });

    let overall;
    if (existingOverall) {
      overall = await db.leaderboard.update({
        where: { id: existingOverall.id },
        data: {
          totalScore: existingOverall.totalScore + score,
          totalExams: existingOverall.totalExams + 1,
        },
      });
    } else {
      overall = await db.leaderboard.create({
        data: {
          userId,
          examId: null,
          period: "all",
          totalScore: score,
          totalExams: 1,
          averageScore: score,
        },
      });
    }

    // Calculate new average
    const newAverage = overall.totalScore / overall.totalExams;
    await db.leaderboard.update({
      where: { id: overall.id },
      data: { averageScore: newAverage },
    });

    // Update exam-specific leaderboard if examId provided
    if (examId) {
      const existingExam = await db.leaderboard.findFirst({
        where: {
          userId,
          examId,
          period: "all",
        },
      });

      let examLeaderboard;
      if (existingExam) {
        examLeaderboard = await db.leaderboard.update({
          where: { id: existingExam.id },
          data: {
            totalScore: existingExam.totalScore + score,
            totalExams: existingExam.totalExams + 1,
          },
        });
      } else {
        examLeaderboard = await db.leaderboard.create({
          data: {
            userId,
            examId,
            period: "all",
            totalScore: score,
            totalExams: 1,
            averageScore: score,
          },
        });
      }

      const examAverage = examLeaderboard.totalScore / examLeaderboard.totalExams;
      await db.leaderboard.update({
        where: { id: examLeaderboard.id },
        data: { averageScore: examAverage },
      });
    }

    // Update ranks
    await updateRanks();
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
}

async function updateRanks() {
  // Update overall ranks
  const overallLeaderboards = await db.leaderboard.findMany({
    where: {
      examId: null,
      period: "all",
    },
    orderBy: {
      totalScore: "desc",
    },
  });

  for (let i = 0; i < overallLeaderboards.length; i++) {
    await db.leaderboard.update({
      where: { id: overallLeaderboards[i].id },
      data: { rank: i + 1 },
    });
  }

  // Update exam-specific ranks
  const exams = await db.exam.findMany({
    where: { isActive: true },
  });

  for (const exam of exams) {
    const examLeaderboards = await db.leaderboard.findMany({
      where: {
        examId: exam.id,
        period: "all",
      },
      orderBy: {
        totalScore: "desc",
      },
    });

    for (let i = 0; i < examLeaderboards.length; i++) {
      await db.leaderboard.update({
        where: { id: examLeaderboards[i].id },
        data: { rank: i + 1 },
      });
    }
  }
}
