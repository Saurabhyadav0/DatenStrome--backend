// File: /app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID as string,
      clientSecret: process.env.LINKEDIN_SECRET as string,
    }),
  ],
  callbacks: {
    // 🔑 Sign in: ensure user exists in DB
    async signIn({ user, profile }) {
      await connectDB();

      const existing = await User.findOne({ email: user.email });
      if (!existing && profile) {
        let firstName = "NA";
        let lastName = "NA";

        if ("given_name" in profile && "family_name" in profile) {
          firstName = (profile as GoogleProfile).given_name ?? "NA";
          lastName = (profile as GoogleProfile).family_name ?? "NA";
        } else if (
          "localizedFirstName" in profile &&
          "localizedLastName" in profile
        ) {
          firstName = (profile as LinkedInProfile).localizedFirstName ?? "NA";
          lastName = (profile as LinkedInProfile).localizedLastName ?? "NA";
        }

        await User.create({
          firstName,
          lastName,
          email: user.email,
          password: "oauth", // placeholder since OAuth
        });
      }

      return true;
    },

    // 🔑 Attach MongoDB user id to token
    async jwt({ token, user }) {
      await connectDB();

      if (user?.email) {
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser.id.toString(); // ✅ Always Mongo ObjectId
        }
      }

      return token;
    },

    // 🔑 Expose id inside session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
