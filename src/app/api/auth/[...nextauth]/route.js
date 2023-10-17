/*import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email", type: "text", placeholder: "kkoch"}
      },
      async authorize(credentials) {
        const user = {id}
      }
      }
    })
  ]
})

export {handler as GET, handler as POST}*/

import connectMongoDB from "../../../lib/dbConnect";
import User from "../../../models/user";
import nextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'

const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          const fullUser = {
            ...user.toObject(),
            fullName: user.fullName,
          };

          return fullUser;
        } catch (error) {
          console.log("Error:", error)
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  }, secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/"
  },
};

const handler = nextAuth(authOptions);
export {handler as GET, handler as POST}