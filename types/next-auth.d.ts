import 'next-auth'
import { Student, Instructor } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    id: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      instructor?: Instructor | null
      student?: Student | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string
  }
}
