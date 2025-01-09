import NextAuth from "next-auth";
import options from "./option";

const handlers = NextAuth(options);
export { handlers as GET, handlers as POST };
