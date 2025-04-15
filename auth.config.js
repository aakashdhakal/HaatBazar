import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/modals/userModal";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";

class InvalidCredentials extends Error {
	constructor() {
		super("Invalid credentials");
		this.code = "Invalid Credentials";
	}
}

class OAuthAccountNotLinked extends Error {
	constructor() {
		super("Account not linked");
		this.code = "Use correct method to log in";
	}
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
					const user = await checkEmailExists(credentials.email);

					if (!user) throw new InvalidCredentials();
					if (!user.password) throw new OAuthAccountNotLinked();

					const isValid = await bcrypt.compare(
						credentials.password,
						user.password,
					);
					if (!isValid) throw new InvalidCredentials();

					return {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						image: user.profilePic,
						role:
							user.email === "anamoldhakal22@gmail.com"
								? "admin"
								: user.role || "user",
					};
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
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.role = token.role;
				session.user.id = token.id;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
	},
};
export default authConfig;
