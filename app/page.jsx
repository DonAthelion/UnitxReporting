// app/page.jsx
"use client";
import { useEffect, useState } from "react";

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
  // -------- Última conexión ----------
  const [term, setTerm] = useState("");
  const [lastSeenRows, setLastSeenRows] = useState([]);
  const [loadingLast, setLoadingLast] = useState(false);

  async function fetchLastSeen() {
    setLoadingLast(true);
    const res = await fetch(`/api/lastseen?term=${encodeURIComponent(term)}`);
    const data = await res.json().catch(()=>[]);
    setLastSeenRows(Array.isArray(data) ? data : []);
    setLoadingLast(false);
  }

  // -------- Casas & últimas conexiones ----------
  const [homesRows, setHomesRows] = useState([]);
  const [loadingHomes, setLoadingHomes] = useState(false);

  async function fetchHomes() {
    setLoadingHomes(true);
    const res = await fetch(`/api/homes-lastseen`);
    const data = await res.json().catch(()=>[]);
    setHomesRows(Array.isArray(data) ? data : []);
    setLoadingHomes(false);
  }

  // -------- Top dinero ----------
  const [moneyRows, setMoneyRows] = useState([]);
  const [loadingMoney, setLoadingMoney] = useState(false);

  async function fetchMoney() {
    setLoadingMoney(true);
    const res = await fetch(`/api/money-top`);
    const data = await res.json().catch(()=>[]);
    setMoneyRows(Array.isArray(data) ? data : []);
    setLoadingMoney(false);
  }

  // -------- UX Coins ----------
  const [uxCid, setUxCid] = useState("");
  const [uxRow, setUxRow] = useState(null);
  const [loadingUx, setLoadingUx] = useState(false);
  async function fetchUx() {
    if (!uxCid) return;
    setLoadingUx(true);
    const res = await fetch(`/api/uxcoins?citizenid=${encodeURIComponent(uxCid)}`);
    const data = await res.json().catch(()=>[]);
    setUxRow(Array.isArray(data) ? data[0] : data);
    setLoadingUx(false);
  }

  // -------- Vehículos ----------
  const [vehOwner, setVehOwner] = useState("");
  const [vehRows, setVehRows] = useState([]);
  const [loadingVeh, setLoadingVeh] = useState(false);
  async function fetchVeh() {
    setLoadingVeh(true);
    const url = vehOwner ? `/api/vehicles?owner=${encodeURIComponent(vehOwner)}` : "/api/vehicles";
    const res = await fetch(url);
    const data = await res.json().catch(()=>[]);
    setVehRows(Array.isArray(data) ? data : []);
    setLoadingVeh(false);
  }

  // -------- VIP ----------
  const [vipRows, setVipRows] = useState([]);
  const [loadingVip, setLoadingVip] = useState(false);
  async function fetchVip() {
    setLoadingVip(true);
    const res = await fetch(`/api/vip`);
    const data = await res.json().catch(()=>[]);
    setVipRows(Array.isArray(data) ? data : []);
    setLoadingVip(false);
  }

  useEffect(() => {
    fetchHomes();
    fetchMoney();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container py-8 space-y-8">
        {/* Última Conexión */}
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

        {/* UX Coins */}
        <Card
          title="UX Coins"
          subtitle="Consulta por CitizenID (ruta JSON configurable en UXCOINS_JSON_PATH)"
          action={
            <button className="btn-primary" onClick={fetchUx} disabled={loadingUx}>
              {loadingUx ? "Consultando…" : "Consultar"}
            </button>
          }
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <input className="input" placeholder="CitizenID" value={uxCid} onChange={e=>setUxCid(e.target.value)} />
            <button className="btn-ghost" onClick={fetchUx} disabled={loadingUx}>
              {loadingUx ? "Consultando…" : "Consultar"}
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="table">
              <thead>
                <tr><th>CitizenID</th><th>Nombre</th><th className="text-right">UX Coins</th></tr>
              </thead>
              <tbody>
                {uxRow ? (
                  <tr>
                    <td className="pr-4">{uxRow.citizenid}</td>
                    <td className="pr-4">{uxRow.name}</td>
                    <td className="text-right">{Number(uxRow.uxcoins || 0).toLocaleString()}</td>
                  </tr>
                ) : (
                  <tr><td colSpan={3} className="py-6 text-white/50">Sin datos…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Vehículos */}
        <Card
          title="Vehículos"
          subtitle="Listado general o filtro por dueño (nombre)"
          action={
            <button className="btn-primary" onClick={fetchVeh} disabled={loadingVeh}>
              {loadingVeh ? "Buscando…" : "Buscar"}
            </button>
          }
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <input className="input" placeholder="Dueño (opcional)" value={vehOwner} onChange={e=>setVehOwner(e.target.value)} />
            <button className="btn-ghost" onClick={fetchVeh} disabled={loadingVeh}>
              {loadingVeh ? "Buscando…" : "Buscar"}
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Estado</th>
                  <th>Garage</th>
                  <th>Tipo</th>
                  <th>CitizenID</th>
                  <th>Dueño</th>
                </tr>
              </thead>
              <tbody>
                {vehRows.map((v, i)=>(
                  <tr key={i}>
                    <td className="pr-4">{v.plate}</td>
                    <td className="pr-4">{v.model}</td>
                    <td className="pr-4">{v.state}</td>
                    <td className="pr-4">{v.garage}</td>
                    <td className="pr-4">{v.type}</td>
                    <td className="pr-4">{v.citizenid}</td>
                    <td>{v.owner_name}</td>
                  </tr>
                ))}
                {!loadingVeh && vehRows.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-white/50">Sin resultados…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
