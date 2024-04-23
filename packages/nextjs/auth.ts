import { cookies } from "next/headers";
import Credentials from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      name: "Ethereum",

      credentials: {
        message: {
          label: "Message",
          placeholder: "0x0",
          type: "text",
        },
        signature: {
          label: "Signature",
          placeholder: "0x0",
          type: "text",
        },
      },

      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));

          const nextAuthUrl =
            process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          const csrfToken = cookies().get("next-auth.csrf-token")?.value.split("|")[0];

          if (siwe.nonce !== csrfToken) {
            return null;
          }

          await siwe.verify({ signature: credentials?.signature || "" });
          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (!session.sub) {
        session.sub = token.sub;
      }
      return session;
    },
  },
};
