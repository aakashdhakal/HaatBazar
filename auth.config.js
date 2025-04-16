import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/modals/userModal";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { CredentialsSignin } from "next-auth";

class InvalidCredentials extends CredentialsSignin {
	code = "Invalid Credentials";
}

class OAuthAccountNotLinked extends CredentialsSignin {
	code = "Use correct method to log in";
}

async function checkEmailExists(email) {
	await dbConnect();
	const user = await User.findOne({ email });
	return user || null;
}

export const authConfig = {
	providers: [
		Google({
			allowDangerousEmailAccountLinking: true,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					role: profile.email === "anamoldhakal22@gmail.com" ? "admin" : "user",
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
						throw new InvalidCredentials();
					} else if (userFound.password === null) {
						throw new OAuthAccountNotLinked();
					} else {
						const matchPassword = await bcrypt.compare(
							credentials.password,
							userFound.password,
						);
						if (matchPassword) {
							if (userFound.email === "anamoldhakal22@gmail.com") {
								userFound.role = "admin";
							}
							return {
								id: userFound._id,
								name: userFound.name,
								email: userFound.email,
								profilePic: userFound.image,
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
				token.role = user.role;
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.profilePic = user.image;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.email = token.email;
				session.user.name = token.name;
				session.user.profilePic = token.image;
				session.user.role = token.role;
				session.user.id = token.id;
			}
			return session;
		},
	},
};
export default authConfig;
