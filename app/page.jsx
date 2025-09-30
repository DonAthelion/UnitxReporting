// app/login/page.jsx
"use client";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    setLoading(false);
    if (res.ok) window.location.href = "/";
    else {
      const j = await res.json().catch(()=>({message:"Error"}));
      setError(j.message || "Credenciales inválidas");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <div className="brand-badge mx-auto mb-3" />
          <h1 className="text-2xl font-bold">UnitX RP • Panel</h1>
          <p className="text-white/60 text-sm">Acceso restringido</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className="label">Usuario</div>
            <input className="input" value={user} onChange={e=>setUser(e.target.value)} placeholder="admin" />
          </div>
          <div>
            <div className="label">Contraseña</div>
            <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div className="badge-red">{error}</div>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

