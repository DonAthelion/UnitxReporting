"use client";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      const j = await res.json().catch(()=>({message:"Error"}));
      setError(j.message || "Credenciales inválidas");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-2xl mb-4"
               style={{
                 background: "linear-gradient(135deg, #48c9b0, #ff4fbf)"
               }} />
          <h1 className="text-2xl font-bold">UnitX RP • Login</h1>
          <p className="text-white/60 text-sm">Panel interno de reportes</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Usuario" value={user} onChange={e=>setUser(e.target.value)} />
          <input className="input" placeholder="Contraseña" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          {error && <div className="badge badge-red">{error}</div>}
          <button className="btn-primary w-full" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
