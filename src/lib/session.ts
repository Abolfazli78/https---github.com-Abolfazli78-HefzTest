import { auth } from "@/lib/auth";

// Helper function to get session in server components and API routes
// For NextAuth v5, we use the auth() function
export async function getServerSession() {
  try {
    const session = await auth();
    if (!session) return null;

    // Transform to match expected format
    return {
      user: {
        id: session.user?.id || "",
        email: session.user?.email || "",
        name: session.user?.name || "",
        phone: session.user?.phone || "",
        role: session.user?.role || "USER",
      },
    };
  } catch (_error) {
    return null;
  }
}

