import NextAuth from "next-auth";
import { config } from "./auth.config";
export const { handlers, auth, signIn, signOut } = NextAuth({...config});