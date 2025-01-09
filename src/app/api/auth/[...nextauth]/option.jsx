import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/modals/userModal";
import bcrypt from "bcryptjs";

export const options = {
	providers: [
		GoogleProvider({
			profile(profile) {
				let userRole = "user";

				return {
					...profile,
					role: userRole,
					id: profile.sub,
					profilePic: profile.picture,
				};
			},
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		GithubProvider({
			profile(profile) {
				let userRole = "user";
				if (profile?.email === "anamoldhakal22@gmail.com") {
					userRole = "admin";
				}

				return {
					...profile,
					role: userRole,
					profilePic: profile.avatar_url,
				};
			},
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const userFound = await User.findOne({ email: credentials.username });
					if (userFound) {
						console.log("User found:", userFound);
						const matchPassword = await bcrypt.compare(
							credentials.password,
							userFound.password,
						);
						if (matchPassword) {
							delete userFound.password;
							return {
								...userFound,
								role: userFound.role,
								profilePic: userFound.profilePic,
								name: userFound.name,
								email: userFound.email,
							};
						}
					}
				} catch (error) {
					console.error("Error logging in:", error);
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.profilePic = user.profilePic;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.role = token.role;
				session.user.profilePic = token.profilePic;
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
};

export default options;
