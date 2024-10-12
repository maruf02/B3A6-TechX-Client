import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
  role: string;
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedToken = jwtDecode<TokenPayload>(accessToken.value);

    const { role } = decodedToken;

    const urlPath = request.nextUrl.pathname;

    if (urlPath.startsWith("/profile/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (urlPath.startsWith("/profile/user") && role !== "user") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/postDetails/:path*", "/profileView/:path*"],
};
