import connectMongoDB from "../../../lib/dbConnect";
import User from "../../../models/user";
import nextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
                    console.log("user", user);

                    if (!user) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!passwordMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
        }),
    ],
    session: {
        async getSession(session, user) {
            if (user) {
                session.user = user;
            }
            return session;
        },
    },
    callbacks: {
        async jwt({ token, user, session }) {
            console.log("jwt callback", { token, user, session });

            if (user) {
                return {
                    ...token,
                    id: user.id,
                    fullName: user.fullName,
                };
            }
            return token;
        },
        async session({ session, token, user }) {
            console.log("session callback", { session, token, user });
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    fullName: token.fullName,
                },
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
};

const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
