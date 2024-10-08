// import { jwtDecode } from "jwt-decode";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// interface TokenPayload {
//   role: string;
// }

// export function middleware(request: NextRequest) {
//   // Check if accessToken exists in cookies
//   const accessToken = request.cookies.get("accessToken");

//   // If the accessToken does not exist, redirect to the login page
//   if (!accessToken) {
//     const loginUrl = new URL("/login", request.url);

//     // Optionally, append the current path as a query parameter to redirect back after login
//     loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   try {
//     // Decode the accessToken to get the user's role
//     const decodedToken = jwtDecode<TokenPayload>(accessToken.value);

//     const { role } = decodedToken;

//     // Check role and restrict access to routes based on the role
//     const urlPath = request.nextUrl.pathname;

//     if (urlPath.startsWith("/profile/admin") && role !== "admin") {
//       // If user is not an admin, block access to the admin page
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     if (urlPath.startsWith("/profile/user") && role !== "user") {
//       // If user is not a normal user, block access to the user page
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     // If role matches, continue with the request
//     return NextResponse.next();
//   } catch {
//     // If there's an error in decoding the token, redirect to login
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

//     return NextResponse.redirect(loginUrl);
//   }
// }

// // Apply the middleware to both postDetails and profileView routes
// export const config = {
//   matcher: [
//     "/profile/:path*", // Matches dynamic segments in profile
//     "/postDetails/:path*", // Matches dynamic segments in postDetails
//     "/profileView/:path*", // Matches dynamic segments in profileView
//   ],
// };
