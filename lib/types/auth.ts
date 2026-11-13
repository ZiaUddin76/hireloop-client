// Shared auth-related types and constants.
// Pure types/constants only — no "use client" directive and no server-only
// imports, so both client components and server modules (lib/auth.ts) can
// safely import from here.

import type { useSession } from "@/lib/auth-client"

export const ROLES = ["seeker", "recruiter", "admin"] as [
  "seeker",
  "recruiter",
  "admin",
]

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

// Shape of the signed-in user, as returned by better-auth's useSession().
export type SessionUser = NonNullable<
  ReturnType<typeof useSession>["data"]
>["user"]
