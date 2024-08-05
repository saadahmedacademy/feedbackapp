import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isAcceptingMessage?: boolean;
    isVerified?: boolean;
  }

  interface Session {
    user: {
        _id?: string;
        username?: string;
        isAcceptingMessage?: boolean;
        isVerified?: boolean;
    }
    // Extending the DefaultSession's user property
    & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isAcceptingMessage?: boolean;
    isVerified?: boolean;
  }
}