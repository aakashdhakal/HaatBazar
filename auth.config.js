import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import User from "@/modals/userModal";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";

async function checkEmailExists(email) {
	await dbConnect();
	const user = await User.findOne({ email: email });
	return user ? user : null;
}

const authConfig = {
	providers: [
		Google({
			allowDangerousEmailAccountLinking: true,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,

			async profile(profile) {
				if (profile.email === "anamoldhakal22@gmail.com") {
					profile.role = "admin";
				}

				return {
					id: profile.id,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
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
						throw new Error("User not found");
					} else if (userFound.password === null) {
						throw new Error("Please use the correct method to login");
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
								profilePic: userFound.profilePic,
								role: userFound.role,
							};
						} else {
							throw new Error("Invalid credentials");
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
};

export default authConfig;
