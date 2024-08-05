import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // If the user is authenticated
    if (token) {
        // Redirect authenticated users from auth pages to the dashboard
        if (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    } else {
        // Redirect unauthenticated users trying to access the dashboard to the sign-in page
        if (url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
    }

    // Allow the request to proceed if none of the above conditions match
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:path*',
        '/dashboard/:path*'
    ]
}
