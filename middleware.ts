import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Add custom authorization logic here if needed
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/student/:path*',
    '/instructor/:path*',
    '/api/:path*',
  ],
}
