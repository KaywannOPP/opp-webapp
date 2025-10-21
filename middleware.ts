import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 👇 This line triggers a check/refresh of the user's session
  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// import { NextRequest, NextResponse } from "next/server";

// /**
//  * Simple Next.js middleware:
//  * - Protects routes (redirects to /login if no token cookie/header)
//  * - Allows public paths (login, static, assets, api/public)
//  * - Adds basic security headers to responses
//  */

// const PUBLIC_PATHS = [
//     "/login",
//     "/api/public",
//     "/favicon.ico",
//     "/robots.txt",
// ];

// function isPublicPath(pathname: string) {
//     if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return true;
//     // allow Next.js assets and static files
//     if (pathname.startsWith("/_next/") || pathname.startsWith("/static/")) return true;
//     return false;
// }

// export function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl;

//     // Allow public paths without checks
//     if (isPublicPath(pathname)) {
//         const res = NextResponse.next();
//         setSecurityHeaders(res);
//         return res;
//     }

//     // Try to find token in cookie or Authorization header
//     const token = req.cookies.get("token")?.value ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

//     if (!token) {
//         // API requests get a JSON 401, pages are redirected to login
//         if (pathname.startsWith("/api")) {
//             const res = new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
//                 status: 401,
//                 headers: { "Content-Type": "application/json" },
//             });
//             setSecurityHeaders(res);
//             return res;
//         }

//         const loginUrl = req.nextUrl.clone();
//         loginUrl.pathname = "/login";
//         // preserve original path in query so app can redirect back after login
//         loginUrl.searchParams.set("next", pathname);
//         const res = NextResponse.redirect(loginUrl);
//         setSecurityHeaders(res);
//         return res;
//     }

//     // For authenticated requests, allow and add headers
//     const res = NextResponse.next();
//     setSecurityHeaders(res);
//     return res;
// }

// function setSecurityHeaders(res: NextResponse) {
//     const h = res.headers;
//     h.set("X-Frame-Options", "DENY");
//     h.set("X-Content-Type-Options", "nosniff");
//     h.set("Referrer-Policy", "no-referrer-when-downgrade");
//     h.set("Permissions-Policy", "geolocation=()");
//     h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
//     return res;
// }

// // Apply middleware to all routes except Next.js internals and static files
// export const config = {
//     matcher: [
//         /*
//         Apply to everything except:
//             - _next static files
//             - API route(s) you wish to exempt can be added to PUBLIC_PATHS above
//         */
//         "/((?!_next/static|_next/image|favicon.ico).*)",
//     ],
// };
