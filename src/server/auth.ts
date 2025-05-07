
import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { login } from "./_actions/auth";
import { User, UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { Pages, Routes } from "@/constants";
import { Locale } from "@/i18n.config";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {
    id: string;
    email: string;
    role: UserRole;
    username :string
    image : string
    gender : string
    age : number
    phone : string
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.age = token.age;
        session.user.gender = token.gender;
        session.user.image = token.image;
        session.user.address_ar = token.address_ar as string;
        session.user.address_en = token.address_en as string ;
        session.user.bio_ar = token.bio_ar as string;
        session.user.bio_en = token.bio_en as string;
        session.user.experience = token.experience as number ;
      

      }
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          role: token.role,
          image : token.image,
          age : token.age,
          gender : token.gender,
          phone : token.phone,
          bio_ar : token.bio_ar,
          bio_en : token.bio_en,
          address_ar : token.address_ar,
          address_en : token.address_en,
          experience : token.experience,
        },
      };
    },
    jwt: async ({ token }): Promise<JWT> => {
      const dbUser = await db.user.findUnique({
        where: {
          email: token?.email,
        },
      });
      if (!dbUser) {
        return token;
      }
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        image : dbUser.image as string,
        age : dbUser.age as number,
        gender : dbUser.gender as string,
        phone : dbUser.phone as string,
        bio_ar : dbUser.bio_ar as string,
        bio_en : dbUser.bio_en as string,
        address_ar : dbUser.address_ar as string,
        address_en : dbUser.address_en as string,
        experience : dbUser.experience 
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials,req) => {
        const currentUrl = req?.headers?.referer;
        const locale = currentUrl?.split("/")[3] as Locale;
        const res = await login(credentials , locale);
        if (res.status === 200 && res.user) {
          return res.user;
        } else {
          throw new Error(
            JSON.stringify({
              validationError: res.error,
              responseError: res.message,
            })
          );
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
};