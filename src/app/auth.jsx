import { MongoDBAdapter } from "@auth/mongodb-adapter";
import authConfig from "../../auth.config";
import { client } from "./lib/db";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: MongoDBAdapter(client),
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	...authConfig,
});
