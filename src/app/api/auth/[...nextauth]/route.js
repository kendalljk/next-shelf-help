import connectMongoDB from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import nextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials;

                if (!email || !password) {
                    return null;
                }

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
            },
        }),
    ],
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
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
};

const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
