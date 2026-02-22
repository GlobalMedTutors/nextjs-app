import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'

async function generateUniqueUsername(email: string, name?: string | null): Promise<string> {
  const baseUsername = name
    ? `${name.split(' ')[0]}_${name.split(' ').slice(1).join('_')}`.toLowerCase().replace(/[^a-z0-9_]/g, '')
    : email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')

  // Check if username exists
  const existing = await prisma.user.findUnique({
    where: { username: baseUsername },
  })

  if (!existing) {
    return baseUsername
  }

  // Generate unique username with random suffix
  let username = baseUsername
  let attempts = 0
  while (attempts < 100) {
    const randomSuffix = crypto.randomBytes(2).toString('hex')
    username = `${baseUsername}_${randomSuffix}`
    
    const exists = await prisma.user.findUnique({
      where: { username },
    })
    
    if (!exists) {
      return username
    }
    attempts++
  }

  // Fallback: use timestamp
  return `${baseUsername}_${Date.now()}`
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?.trim() || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && user.email) {
        try {
          // Create or update user in database
          const nameParts = user.name?.split(' ') || []
          const firstName = nameParts[0] || 'User'
          const lastName = nameParts.slice(1).join(' ') || ''
          
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              // Update last login
              lastActiveAt: new Date(),
            },
            create: {
              email: user.email,
              firstName,
              lastName,
              username: await generateUniqueUsername(user.email, user.name),
            },
          })
          
          // Store user ID in user object for JWT callback
          user.id = dbUser.id
        } catch (error) {
          console.error('Error creating/updating user:', error)
          // Log the full error for debugging
          if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
          }
          // Don't block sign-in if it's just a database issue - allow the user to sign in
          // The error will be visible in logs for debugging
          return true // Allow sign-in even if DB update fails
        }
      }
      return true
    },
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
          session.user.instructor = dbUser.instructor
          session.user.student = dbUser.student
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Use the user ID from signIn callback
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
