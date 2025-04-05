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
	pages: {
		signIn: "/login",
		signUp: "/signup",
		newUser: "/newUser",
	},
});
