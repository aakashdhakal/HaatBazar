// auth.jsx
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import authConfig from "../../auth.config";
import { client } from "@/lib/mongoClient";
import NextAuth from "next-auth";
import { redirect } from "next/navigation";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(client),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	...authConfig,
	events: {
		signIn: async ({ isNewUser, user }) => {
			//empty signin event to prevent default error handling.
		},
		signOut: async ({ session }) => {
			//empty signout event to prevent default error handling.
		},
		createUser: async ({ user }) => {
			//empty createUser event to prevent default error handling.
		},
		linkAccount: async ({ user, account, profile }) => {
			//empty linkAccount event to prevent default error handling.
		},
		session: async ({ session, token }) => {
			//empty session event to prevent default error handling.
		},
	},
	pages: {
		signIn: "/login",
		signUp: "/signup",
		linkAccount: "/linkAccount", // Add this line
	},
});
