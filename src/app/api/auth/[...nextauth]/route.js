import clientPromise from "@/src/app/lib/mongoClient";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db();

      // Check if the user already exists
      const existingUser = await db.collection("users").findOne({ email: user.email });

      if (existingUser) {
        // Check if the user signed up with a different provider
        if (existingUser.provider && existingUser.provider !== account.provider) {
          throw new Error("Try signing in with a different account.");
        }
      }

      // Allow sign-in
      return true;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const client = await clientPromise;
      const db = client.db();

      try {
        // Add additional properties to the user document
        await db.collection("users").updateOne(
          { email: user.email },
          {
            $set: {
              role: "user", // Default role
              createdAt: new Date(),
              provider: "google",
            },
          }
        );
      } catch (error) {
        console.error("Error updating user document:", error);
        throw new Error("Failed to create user.");
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };