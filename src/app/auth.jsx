import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./modals/userModal";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { client } from "mongodb";

async function checkEmailExists(email) {
	const user = await User.findOne({ email: email });
	if (user !== null) {
		return user;
	} else {
		return false;
	}
}

class InvalidCredentials extends CredentialsSignin {
	code = "The provided credentials are invalid";
	ok = false;
	status = 400;
}

class UserNotFound extends CredentialsSignin {
	code = "No user found with this email";
	ok = false;
	status = 404;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	// adapters: MongoDBAdapter(client),
	providers: [
		GoogleProvider({
			async profile(profile) {
				console.log("profile = ", profile);
				let userRole = "user";
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					role: userRole,
					profilePic: profile.picture,
				};
			},
		}),

		GithubProvider({
			profile(profile) {
				let userRole = "user";
				if (profile?.email === "anamoldhakal22@gmail.com") {
					userRole = "admin";
				}
				return {
					id: profile.id,
					name: profile.name,
					email: profile.email,
					role: userRole,
					profilePic: profile.avatar_url,
				};
			},
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const userFound = await checkEmailExists(credentials.email);
					if (!userFound) {
						throw new UserNotFound();
					} else {
						const matchPassword = await bcrypt.compare(
							credentials.password,
							userFound.password,
						);
						if (matchPassword) {
							return {
								id: userFound._id,
								name: userFound.name,
								email: userFound.email,
								role: userFound.role,
								profilePic: userFound.profilePic,
							};
						} else {
							throw new InvalidCredentials();
						}
					}
				} catch (error) {
					//return error;
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
				token.profilePic = user.profilePic;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.profilePic = token.profilePic;
			}
			return session;
		},
		async signIn(user) {
			const userEmail = user.user.email;
			const userFound = await checkEmailExists(userEmail);
			if (!userFound) {
				return "/login?error=No user found with this email";
			} else {
				return {
					id: userFound._id,
					name: userFound.name,
					email: userFound.email,
					role: userFound.role,
					profilePic: userFound.profilePic,
				};
			}
		},
	},

	pages: {
		signIn: "/login",
		signUp: "/signup",
	},
	secret: process.env.NEXTAUTH_SECRET,
});
