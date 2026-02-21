import { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import { prisma } from '@/lib/db/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch user with instructor and student roles
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            instructor: true,
            student: true,
          },
        })
        
        if (dbUser) {
          session.user.id = dbUser.id
          ;(session.user as any).instructor = dbUser.instructor
          ;(session.user as any).student = dbUser.student
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
