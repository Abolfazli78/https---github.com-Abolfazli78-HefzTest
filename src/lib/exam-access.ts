import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function getAccessibleExams(userId: string, userRole: UserRole) {
  // Get user with hierarchy information
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      parent: true,
      teacher: true,
      institute: true,
      children: true,
      students: true,
      teachers: true,
    },
  });

  if (!user) {
    return [];
  }

  // Base condition: always include user's own exams
  const whereConditions: any[] = [
    { createdById: userId } // User's own exams
  ];

  // Add conditions based on user role
  switch (userRole) {
    case UserRole.STUDENT:
      // Student can see:
      // 1. Their own exams (already added)
      // 2. Exams created by their teacher
      // 3. Exams created by their institute admin
      
      if (user.teacher) {
        whereConditions.push({ createdById: user.teacher.id });
      }
      
      if (user.institute) {
        whereConditions.push({ createdById: user.institute.id });
      }
      break;

    case UserRole.TEACHER:
      // Teacher can see:
      // 1. Their own exams (already added)
      // 2. Exams created by their institute admin
      // 3. Exams created by their students
      
      if (user.institute) {
        whereConditions.push({ createdById: user.institute.id });
      }
      
      if (user.students && user.students.length > 0) {
        const studentIds = user.students.map(student => student.id);
        whereConditions.push({ createdById: { in: studentIds } });
      }
      break;

    case UserRole.INSTITUTE:
      // Institute admin can see:
      // 1. Their own exams (already added)
      // 2. Exams created by their teachers
      // 3. Exams created by their students (through teachers)
      
      if (user.teachers && user.teachers.length > 0) {
        const teacherIds = user.teachers.map(teacher => teacher.id);
        whereConditions.push({ createdById: { in: teacherIds } });
        
        // Also get students of these teachers
        const studentsOfTeachers = await db.user.findMany({
          where: {
            teacherId: { in: teacherIds }
          },
          select: { id: true }
        });
        
        if (studentsOfTeachers.length > 0) {
          const studentIds = studentsOfTeachers.map(student => student.id);
          whereConditions.push({ createdById: { in: studentIds } });
        }
      }
      break;

    case UserRole.ADMIN:
      // Admin can see all exams
      return await db.exam.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { questions: true, examAttempts: true },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });
  }

  // For non-admin roles, apply the filtered conditions
  const exams = await db.exam.findMany({
    where: {
      isActive: true,
      OR: whereConditions,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { questions: true, examAttempts: true },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return exams;
}

export async function canUserAccessExam(userId: string, examId: string): Promise<boolean> {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    select: { createdById: true },
  });

  if (!exam) {
    return false;
  }

  // If user created the exam, they can access it
  if (exam.createdById === userId) {
    return true;
  }

  // Get user with hierarchy information
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      teacher: true,
      institute: true,
      students: true,
      teachers: true,
    },
  });

  if (!user) {
    return false;
  }

  // Check if exam creator is in user's hierarchy
  const examCreator = await db.user.findUnique({
    where: { id: exam.createdById! },
    select: { role: true, teacherId: true, instituteId: true },
  });

  if (!examCreator) {
    return false;
  }

  switch (user.role) {
    case UserRole.STUDENT:
      // Student can access exams from their teacher or institute
      return Boolean(
        (user.teacher && exam.createdById === user.teacher.id) ||
        (user.institute && exam.createdById === user.institute.id)
      );

    case UserRole.TEACHER:
      // Teacher can access exams from their institute or their students
      return Boolean(
        (user.institute && exam.createdById === user.institute.id) ||
        (user.students && user.students.some(student => student.id === exam.createdById))
      );

    case UserRole.INSTITUTE:
      // Institute can access exams from their teachers or students
      return Boolean(
        (user.teachers && user.teachers.some(teacher => teacher.id === exam.createdById)) ||
        // Check if exam creator is a student of any of this institute's teachers
        (await db.user.findFirst({
          where: {
            id: exam.createdById!,
            teacher: {
              instituteId: user.id,
            },
          },
        })) !== null
      );

    case UserRole.ADMIN:
      return true;

    default:
      return false;
  }
}
