import { Role } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
      companyName?: string | null;
    };
  }

  interface User {
    role: Role;
    companyName?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    companyName?: string | null;
  }
}





