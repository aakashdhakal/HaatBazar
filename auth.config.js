import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/modals/userModal";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { CredentialsSignin } from "next-auth";

async function checkEmailExists(email) {
    await dbConnect();
    const user = await User.findOne({ email: email });
    return user ? user : null;
}

class InvalidCredentials extends CredentialsSignin {
    code = "Invalid credentials";

}

class UserNotFound extends CredentialsSignin {
    code = "The user is not found";

}

class InvalidMethod extends CredentialsSignin {
    code = "Please use the correct method to login";
}

// Notice this is only an object, not a full Auth.js instance
const authConfig = {
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
                let userRole = "user";
                if (profile.email === "anamoldhakal22@gmail.com") {
                    userRole = "admin";
                }
                let user = await checkEmailExists(profile.email);
                return {
                    ...profile,
                    role: userRole,
                    id: profile.id,
                    profilePic: profile.image || profile.picture,
                };
            },
        }),
        Credentials({
            allowDangerousEmailAccountLinking: true,
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                try {
                    const userFound = await checkEmailExists(credentials.email);
                    if (!userFound) {
                        throw new UserNotFound();
                    } else if (userFound.password === null) {
                        throw new InvalidMethod();
                    } else {
                        const matchPassword = bcrypt.compare(
                            credentials.password,
                            userFound.password,
                        );
                        if (matchPassword) {
                            return {
                                id: userFound._id,
                                name: userFound.name,
                                email: userFound.email,
                                profilePic: userFound.profilePic,
                                role: userFound.role,
                            };
                        } else {
                            throw new InvalidCredentials();
                        }
                    }
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.profilePic = user.profilePic || user.image;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.profilePic = token.profilePic || token.image;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signUp: "/signup",
    },
};

export default authConfig;

