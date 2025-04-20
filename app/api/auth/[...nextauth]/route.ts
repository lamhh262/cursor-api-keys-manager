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
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!user?.email) {
        console.error("No email provided by Google");
        return false;
      }

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
                name: user.name || user.email.split('@')[0],
                image: user.image,
                type: 'development'
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
    async redirect({ url, baseUrl }) {
      // Handle case where callback URL is not properly passed
      if (url === baseUrl && url.includes('callback')) {
        try {
          const urlObj = new URL(url);
          const callbackUrl = urlObj.searchParams.get('callbackUrl');
          if (callbackUrl) {
            console.log('Extracted callbackUrl:', callbackUrl);
            return callbackUrl.startsWith('/') ? `${baseUrl}${callbackUrl}` : callbackUrl;
          }
        } catch (error) {
          console.error('Error parsing URL:', error);
        }
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
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
