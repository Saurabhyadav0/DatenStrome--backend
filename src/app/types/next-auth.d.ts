import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export interface JwtUserPayload {
  id: string; // MongoDB _id as string
  email: string;
}
