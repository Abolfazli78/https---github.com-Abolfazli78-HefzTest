import { handlers } from "@/lib/auth";

// Ensure NextAuth runs on the Node.js runtime (Edge not supported)
export const runtime = "nodejs";

export const { GET, POST } = handlers;

