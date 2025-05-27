import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // 「_next」や「静的ファイル」に加えて、「sign-in」「sign-up」も除外する
    "/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// export const config = {
//   matcher: [
//     // Match all request paths except for the ones starting with _next
//     // and the ones starting with /api/auth
