import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isAuth = !!req.auth;
  const protectedRoutes = [
    "/admin/dashboard",
  ];

  if(req.nextUrl.pathname === "/admin") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.href));
    } else {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl.href));
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  if (isProtectedRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl.href));
    }
  }

  if (req.nextUrl.pathname === "/admin/login" && isAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.href));
  }

  return NextResponse.next();
});


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};