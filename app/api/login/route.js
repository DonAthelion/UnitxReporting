import { NextResponse } from "next/server";

export async function POST(req) {
  const { user, pass } = await req.json().catch(() => ({ user: "", pass: "" }));
  if (user === process.env.PANEL_USER && pass === process.env.PANEL_PASS) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(process.env.SESSION_COOKIE || "unitx_session", process.env.SESSION_COOKIE_VALUE || "ok", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true
    });
    return res;
  }
  return NextResponse.json({ message: "Usuario/Contraseña inválidos" }, { status: 401 });
}
