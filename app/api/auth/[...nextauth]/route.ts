import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/app/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // First check if user exists
          const { data: existingUser, error: selectError } = await supabase
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

          if (selectError) {
            console.error("Error checking for existing user:", selectError);
            return false;
          }

          // If user doesn't exist, insert new user
          if (!existingUser) {
            const { error: insertError } = await supabase
              .from("users")
              .insert({
                email: user.email,
                name: user.name,
                image: user.image,
              });

            if (insertError) {
              console.error("Error inserting user:", insertError);
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST };
