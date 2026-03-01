import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log(
        `[NEXTAUTH] JWT Callback: Initial Token.id=${token.id}, Email=${token.email}`,
      );

      // First sign-in
      if (user) {
        console.log(`[NEXTAUTH] First sign-in. Setting token.id to ${user.id}`);
        token.id = user.id;
      }

      const tokenId = String(token.id || "");
      if (token.email && (!tokenId || tokenId.length !== 24)) {
        console.log(
          `[NEXTAUTH] Auto-healing token for ${token.email}. Current ID=${tokenId}`,
        );
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email });
          console.log(`[NEXTAUTH] DB Lookup Result found=${!!dbUser}`);

          if (!dbUser && (account?.provider === "google" || !tokenId)) {
            console.log(`[NEXTAUTH] Creating user for ${token.email}`);
            dbUser = await User.create({
              name: token.name || "User",
              email: token.email,
            });
            console.log(`[NEXTAUTH] Created user ID=${dbUser._id}`);
          }

          if (dbUser) {
            token.id = dbUser._id.toString();
            console.log(`[NEXTAUTH] Token.id healed to ${token.id}`);
          }
        } catch (error) {
          console.error("[NEXTAUTH] Auto-heal CRITICAL ERROR:", error);
        }
      }

      console.log(
        `[NEXTAUTH] Leaving JWT callback. Final Token.id=${token.id}`,
      );
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
