import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("token")?.value
  // const path = request.nextUrl.pathname

  // // Public routes - allow access
  // if (path === "/login" || path === "/register" || path === "/") {
  //   if (token) {
  //     // If already authenticated, redirect to dashboard
  //     return NextResponse.redirect(new URL("/dashboard", request.url))
  //   }
  //   return NextResponse.next()
  // }

  // // Protected routes - check authentication
  // if (path.startsWith("/dashboard")) {
 
  //   if (!token) {
  //     // If not authenticated, redirect to login
  //     return NextResponse.redirect(new URL("/login", request.url))
  //   }

  //   // Optionally check user type for specific dashboard routes
  //   // This would require parsing the JWT token

  //   return NextResponse.next()
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
