import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { APIError, createAuthMiddleware } from "better-auth/api"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("hireloopdb")

export const ROLES = ["seeker", "recruiter", "admin"] as [
  "seeker",
  "recruiter",
  "admin",
]
export type Role = (typeof ROLES)[number]

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ROLES,
        defaultValue: "seeker",
        input: true,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const role = ctx.body?.role as string | undefined
        if (role && !(ROLES as readonly string[]).includes(role)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid role. Expected one of: seeker, recruiter, admin.",
          })
        }
      }
    }),
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
