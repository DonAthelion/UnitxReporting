import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/login", "http://localhost"));
  res.cookies.set(process.env.SESSION_COOKIE || "unitx_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
