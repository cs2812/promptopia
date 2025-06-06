import User from "@models/user";
import { connectTodDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks use to run session and signIn function
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = `${sessionUser._id}`;
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectTodDB();
        // if user already present
        const userExists = await User.findOne({ email: profile.email });
        // if not, create new one
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return true;
      }
    },
  },
});

export { handler as GET, handler as POST };
