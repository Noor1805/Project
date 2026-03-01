import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // First sign-in: store the Google user id
      if (user) {
        token.id = user.id;
      }

      // Try to resolve to MongoDB ID, but don't crash if DB is down
      const tokenId = String(token.id || "");
      if (token.email && (!tokenId || tokenId.length !== 24)) {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email });

          if (!dbUser && (account?.provider === "google" || !tokenId)) {
            dbUser = await User.create({
              name: token.name || "User",
              email: token.email,
            });
          }

          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          // DB is unreachable — auth still works, just without MongoDB ID
          console.error("[NEXTAUTH] DB lookup failed (non-fatal):", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
