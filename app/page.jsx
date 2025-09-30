// app/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";

function Navbar() {
  return (
    <div className="navbar">
      <div className="container py-3 flex items-center justify-between">
        <div className="brand">
          <div className="brand-badge" />
          <span>UnitX RP • Reportes</span>
        </div>
        <a className="btn-ghost" href="/api/logout">Salir</a>
      </div>
    </div>
  );
}

function Card({ title, subtitle, action, children }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function BadgeDays({ days }) {
  if (days > 30) return <span className="badge-red">{days} días</span>;
  if (days > 15) return <span className="badge-yellow">{days} días</span>;
  return <span className="badge-green">{days} días</span>;
}

export default function Dashboard() {
  // Estados de búsqueda y resultados
  const [term, setTerm] = useState("");
  const [lastSeenRows, setLastSeenRows] = useState([]);
  const [loadingLast, setLoadingLast] = useState(false);

  const [homesRows, setHomesRows] = useState([]);
  const [loadingHomes, setLoadingHomes] = useState(false);

  const [moneyRows, setMoneyRows] = useState([]);
  const [loadingMoney, setLoadingMoney] = useState(false);

  async function fetchLastSeen() {
    setLoadingLast(true);
    const res = await fetch(`/api/lastseen?term=${encodeURIComponent(term)}`);
    const data = await res.json().catch(()=>[]);
    setLastSeenRows(Array.isArray(data) ? data : []);
    setLoadingLast(false);
  }

  async function fetchHomes() {
    setLoadingHomes(true);
    const res = await fetch(`/api/homes-lastseen`);
    const data = await res.json().catch(()=>[]);
    setHomesRows(Array.isArray(data) ? data : []);
    setLoadingHomes(false);
  }

  async function fetchMoney() {
    setLoadingMoney(true);
    const res = await fetch(`/api/money-top`);
    const data = await res.json().catch(()=>[]);
    setMoneyRows(Array.isArray(data) ? data : []);
    setLoadingMoney(false);
  }

  useEffect(() => {
    // carga inicial de dos reportes
    fetchHomes();
    fetchMoney();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container py-8 space-y-8">
        {/* Búsqueda rápida Última Conexión */}
        <Card
          title="Última Conexión"
          subtitle="Busca por nombre o CitizenID"
          action={
            <button className="btn-ghost" onClick={fetchLastSeen} disabled={loadingLast}>
              {loadingLast ? "Buscando…" : "Buscar"}
            </button>
          }
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <input className="input" placeholder="Ej: Gilberto o ABC12345" value={term} onChange={e=>setTerm(e.target.value)} />
            <button className="btn-primary" onClick={fetchLastSeen} disabled={loadingLast}>
              {loadingLast ? "Buscando…" : "Buscar"}
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>CitizenID</th>
                  <th>Nombre</th>
                  <th>Última vez</th>
                </tr>
              </thead>
              <tbody>
                {lastSeenRows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-4">{r.citizenid}</td>
                    <td className="pr-4">{r.name}</td>
                    <td>{r.last_seen}</td>
                  </tr>
                ))}
                {!loadingLast && lastSeenRows.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-white/50">Sin resultados…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Casas & Últimas Conexiones */}
        <Card
          title="Casas & Últimas Conexiones"
          subtitle="Coloreado por inactividad (verde ≤15, amarillo 16–30, rojo >30)"
          action={
            <div className="flex gap-2">
              <a className="btn-ghost" href="/api/homes-lastseen" target="_blank" rel="noreferrer">JSON</a>
              <button className="btn-primary" onClick={fetchHomes} disabled={loadingHomes}>
                {loadingHomes ? "Actualizando…" : "Actualizar"}
              </button>
            </div>
          }
        >
          <div className="mt-2 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Casa</th>
                  <th>Owner</th>
                  <th>Nombre IC</th>
                  <th>Última vez</th>
                  <th>Inactividad</th>
                </tr>
              </thead>
              <tbody>
                {homesRows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-4">{r.house}</td>
                    <td className="pr-4">{r.owner}</td>
                    <td className="pr-4">{[r.firstname, r.lastname].filter(Boolean).join(" ")}</td>
                    <td className="pr-4">{r.last_seen}</td>
                    <td><BadgeDays days={r.days_since} /></td>
                  </tr>
                ))}
                {!loadingHomes && homesRows.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-white/50">No hay casas registradas…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Dinero */}
        <Card
          title="Top Dinero"
          subtitle="Suma de cash + bank"
          action={
            <div className="flex gap-2">
              <a className="btn-ghost" href="/api/money-top" target="_blank" rel="noreferrer">JSON</a>
              <a className="btn-ghost" href="/api/money-top.csv" target="_blank" rel="noreferrer">CSV</a>
              <button className="btn-primary" onClick={fetchMoney} disabled={loadingMoney}>
                {loadingMoney ? "Actualizando…" : "Actualizar"}
              </button>
            </div>
          }
        >
          <div className="mt-2 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>CitizenID</th>
                  <th>Nombre</th>
                  <th className="text-right">Cash</th>
                  <th className="text-right">Bank</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {moneyRows.map((r, i) => (
                  <tr key={i}>
                    <td className="pr-2">{i + 1}</td>
                    <td className="pr-4">{r.citizenid}</td>
                    <td className="pr-4">{r.name}</td>
                    <td className="text-right pr-4">{Number(r.cash || 0).toLocaleString()}</td>
                    <td className="text-right pr-4">{Number(r.bank || 0).toLocaleString()}</td>
                    <td className="text-right">{Number(r.total || 0).toLocaleString()}</td>
                  </tr>
                ))}
                {!loadingMoney && moneyRows.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-white/50">Sin datos…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Links rápidos al resto de reportes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="card hover:opacity-95" href="/api/vehicles" target="_blank" rel="noreferrer">
            <div className="text-lg font-semibold">Vehículos</div>
            <p className="text-white/60 text-sm mt-1">Listado y búsqueda por dueño</p>
          </a>
          <a className="card hover:opacity-95" href="/api/vip" target="_blank" rel="noreferrer">
            <div className="text-lg font-semibold">VIP</div>
            <p className="text-white/60 text-sm mt-1">Quién tiene y días restantes</p>
          </a>
          <a className="card hover:opacity-95" href="/api/uxcoins?citizenid=TU_CID" target="_blank" rel="noreferrer">
            <div className="text-lg font-semibold">UX Coins</div>
            <p className="text-white/60 text-sm mt-1">Consulta por citizenid</p>
          </a>
        </div>
      </main>
    </>
  );
}

