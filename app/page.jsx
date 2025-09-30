// app/page.jsx
"use client";
import { useEffect, useMemo, useState } from "react";

function Navbar() {
  return (
    <div className="navbar">
      <div className="container py-3 flex items-center justify-between">
        <div className="brand">
          <img src="/unitx-logo.png" alt="UnitX" className="w-8 h-8 rounded-lg" />
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

// Utils
const toNumber = (v) => Number(v || 0);
const numberFmt = (v) => toNumber(v).toLocaleString();
const slicePage = (arr, page, per) => arr.slice((page-1)*per, (page)*per);
const toCSV = (rows, header) => {
  const head = header.join(",");
  const lines = rows.map(r => header.map(h => String(r[h] ?? "").replaceAll(",", " ")).join(","));
  return [head, ...lines].join("\n");
};
const downloadCSV = (rows, header, filename) => {
  const csv = toCSV(rows, header);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  URL.revokeObjectURL(url); a.remove();
};

export default function Dashboard() {
  // ----- Tabs -----
  const tabs = ["Conexión","Casas","Top Dinero","UX Coins","Vehículos","VIP"];
  const [tab, setTab] = useState("Conexión");

  // ----- Conexión -----
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

  // ----- Casas -----
  const [homesRows, setHomesRows] = useState([]);
  const [loadingHomes, setLoadingHomes] = useState(false);
  const [homesQ, setHomesQ] = useState(""); // búsqueda
  const [homesPer, setHomesPer] = useState(10);
  const [homesPage, setHomesPage] = useState(1);
  const homesFiltered = useMemo(() => {
    const q = homesQ.trim().toLowerCase();
    const base = q ? homesRows.filter(r =>
      (r.house || "").toLowerCase().includes(q) ||
      (r.owner || "").toLowerCase().includes(q) ||
      (r.firstname || "").toLowerCase().includes(q) ||
      (r.lastname || "").toLowerCase().includes(q)
    ) : homesRows;
    return base;
  }, [homesRows, homesQ]);
  const homesPageRows = useMemo(() => slicePage(homesFiltered, homesPage, homesPer), [homesFiltered, homesPage, homesPer]);

  async function fetchHomes() {
    setLoadingHomes(true);
    const res = await fetch(`/api/homes-lastseen`);
    const data = await res.json().catch(()=>[]);
    setHomesRows(Array.isArray(data) ? data : []);
    setHomesPage(1);
    setLoadingHomes(false);
  }

  // ----- Top dinero -----
  const [moneyRows, setMoneyRows] = useState([]);
  const [loadingMoney, setLoadingMoney] = useState(false);
  const [moneyQ, setMoneyQ] = useState("");
  const [moneyPer, setMoneyPer] = useState(10);
  const [moneyPage, setMoneyPage] = useState(1);
  const moneyFiltered = useMemo(() => {
    const q = moneyQ.trim().toLowerCase();
    const base = q ? moneyRows.filter(r =>
      (r.name || "").toLowerCase().includes(q) ||
      (r.citizenid || "").toLowerCase().includes(q)
    ) : moneyRows;
    return base;
  }, [moneyRows, moneyQ]);
  const moneyPageRows = useMemo(() => slicePage(moneyFiltered, moneyPage, moneyPer), [moneyFiltered, moneyPage, moneyPer]);

  async function fetchMoney() {
    setLoadingMoney(true);
    const res = await fetch(`/api/money-top`);
    const data = await res.json().catch(()=>[]);
    setMoneyRows(Array.isArray(data) ? data : []);
    setMoneyPage(1);
    setLoadingMoney(false);
  }

  // ----- UX Coins -----
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

  // ----- Vehículos -----
  const [vehOwner, setVehOwner] = useState("");
  const [vehRows, setVehRows] = useState([]);
  const [loadingVeh, setLoadingVeh] = useState(false);
  const [vehQ, setVehQ] = useState("");
  const [vehPer, setVehPer] = useState(10);
  const [vehPage, setVehPage] = useState(1);
  const vehFiltered = useMemo(() => {
    const q = (vehQ || "").trim().toLowerCase();
    const base = q ? vehRows.filter(v =>
      (v.plate || "").toLowerCase().includes(q) ||
      (v.model || "").toLowerCase().includes(q) ||
      (v.owner_name || "").toLowerCase().includes(q) ||
      (v.citizenid || "").toLowerCase().includes(q)
    ) : vehRows;
    return base;
  }, [vehRows, vehQ]);
  const vehPageRows = useMemo(() => slicePage(vehFiltered, vehPage, vehPer), [vehFiltered, vehPage, vehPer]);
  async function fetchVeh() {
    setLoadingVeh(true);
    const url = vehOwner ? `/api/vehicles?owner=${encodeURIComponent(vehOwner)}` : "/api/vehicles";
    const res = await fetch(url);
    const data = await res.json().catch(()=>[]);
    setVehRows(Array.isArray(data) ? data : []);
    setVehPage(1);
    setLoadingVeh(false);
  }

  // ----- VIP -----
  const [vipRows, setVipRows] = useState([]);
  const [loadingVip, setLoadingVip] = useState(false);
  const [vipQ, setVipQ] = useState("");
  const [vipPer, setVipPer] = useState(10);
  const [vipPage, setVipPage] = useState(1);
  const vipFiltered = useMemo(() => {
    const q = vipQ.trim().toLowerCase();
    const base = q ? vipRows.filter(r =>
      (r.name || "").toLowerCase().includes(q) ||
      (r.citizenid || "").toLowerCase().includes(q)
    ) : vipRows;
    return base;
  }, [vipRows, vipQ]);
  const vipPageRows = useMemo(() => slicePage(vipFiltered, vipPage, vipPer), [vipFiltered, vipPage, vipPer]);

  async function fetchVip() {
    setLoadingVip(true);
    const res = await fetch(`/api/vip`);
    const data = await res.json().catch(()=>[]);
    setVipRows(Array.isArray(data) ? data : []);
    setVipPage(1);
    setLoadingVip(false);
  }

  // carga inicial de 2 reportes pesados
  useEffect(() => { fetchHomes(); fetchMoney(); }, []);

  return (
    <>
      <Navbar />
      <main className="container py-8 space-y-6">
        {/* Tabs */}
        <div className="tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`tab ${tab===t ? "tab-active" : ""}`}
              onClick={()=>setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Contenido por tab */}
        {tab === "Conexión" && (
          <Card title="Última Conexión" subtitle="Busca por nombre o CitizenID"
            action={<button className="btn-ghost" onClick={fetchLastSeen} disabled={loadingLast}>
              {loadingLast ? "Buscando…" : "Buscar"}
            </button>}>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3">
              <input className="input" placeholder="Ej: Gilberto o ABC12345" value={term} onChange={e=>setTerm(e.target.value)} />
              <button className="btn-primary" onClick={fetchLastSeen} disabled={loadingLast}>
                {loadingLast ? "Buscando…" : "Buscar"}
              </button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>CitizenID</th><th>Nombre</th><th>Última vez</th></tr></thead>
                <tbody>
                  {lastSeenRows.map((r,i)=>(
                    <tr key={i}><td className="pr-4">{r.citizenid}</td><td className="pr-4">{r.name}</td><td>{r.last_seen}</td></tr>
                  ))}
                  {!loadingLast && lastSeenRows.length===0 && <tr><td colSpan={3} className="py-6 text-white/50">Sin resultados…</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "Casas" && (
          <Card title="Casas & Últimas Conexiones" subtitle="Verde ≤15, Amarillo 16–30, Rojo >30"
            action={<div className="flex gap-2">
              <button className="btn-ghost" onClick={()=>downloadCSV(homesFiltered, ["house","owner","firstname","lastname","last_seen","days_since"], "homes_lastseen.csv")}>CSV</button>
              <button className="btn-primary" onClick={fetchHomes} disabled={loadingHomes}>{loadingHomes ? "Actualizando…" : "Actualizar"}</button>
            </div>}>
            <div className="toolbar">
              <input className="input" placeholder="Buscar (casa, owner, nombre IC)" value={homesQ} onChange={e=>{setHomesQ(e.target.value); setHomesPage(1);}}/>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Por página</span>
                <select className="select" value={homesPer} onChange={e=>{setHomesPer(Number(e.target.value)); setHomesPage(1);}}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Casa</th><th>Owner</th><th>Nombre IC</th><th>Última vez</th><th>Inactividad</th></tr></thead>
                <tbody>
                  {homesPageRows.map((r,i)=>(
                    <tr key={i}>
                      <td className="pr-4">{r.house}</td>
                      <td className="pr-4">{r.owner}</td>
                      <td className="pr-4">{[r.firstname, r.lastname].filter(Boolean).join(" ")}</td>
                      <td className="pr-4">{r.last_seen}</td>
                      <td><BadgeDays days={r.days_since} /></td>
                    </tr>
                  ))}
                  {!loadingHomes && homesFiltered.length===0 && <tr><td colSpan={5} className="py-6 text-white/50">Sin datos…</td></tr>}
                </tbody>
              </table>
            </div>
            {homesFiltered.length>homesPer && (
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-ghost" onClick={()=>setHomesPage(p=>Math.max(1,p-1))}>◀</button>
                <span className="text-white/60 text-sm">Página {homesPage} / {Math.ceil(homesFiltered.length/homesPer)}</span>
                <button className="btn-ghost" onClick={()=>setHomesPage(p=>Math.min(Math.ceil(homesFiltered.length/homesPer),p+1))}>▶</button>
              </div>
            )}
          </Card>
        )}

        {tab === "Top Dinero" && (
          <Card title="Top Dinero" subtitle="Suma de cash + bank"
            action={<div className="flex gap-2">
              <a className="btn-ghost" href="/api/money-top.csv" target="_blank" rel="noreferrer">CSV (servidor)</a>
              <button className="btn-primary" onClick={fetchMoney} disabled={loadingMoney}>{loadingMoney ? "Actualizando…" : "Actualizar"}</button>
            </div>}>
            <div className="toolbar">
              <input className="input" placeholder="Buscar (nombre o citizenid)" value={moneyQ} onChange={e=>{setMoneyQ(e.target.value); setMoneyPage(1);}}/>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Por página</span>
                <select className="select" value={moneyPer} onChange={e=>{setMoneyPer(Number(e.target.value)); setMoneyPage(1);}}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
                <button className="btn-ghost" onClick={()=>downloadCSV(moneyFiltered, ["citizenid","name","cash","bank","total"], "money_top.csv")}>CSV (cliente)</button>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>#</th><th>CitizenID</th><th>Nombre</th><th className="text-right">Cash</th><th className="text-right">Bank</th><th className="text-right">Total</th></tr></thead>
                <tbody>
                  {moneyPageRows.map((r,i)=>(
                    <tr key={i}>
                      <td className="pr-2">{(moneyPage-1)*moneyPer + i + 1}</td>
                      <td className="pr-4">{r.citizenid}</td>
                      <td className="pr-4">{r.name}</td>
                      <td className="text-right pr-4">{numberFmt(r.cash)}</td>
                      <td className="text-right pr-4">{numberFmt(r.bank)}</td>
                      <td className="text-right">{numberFmt(r.total)}</td>
                    </tr>
                  ))}
                  {!loadingMoney && moneyFiltered.length===0 && <tr><td colSpan={6} className="py-6 text-white/50">Sin datos…</td></tr>}
                </tbody>
              </table>
            </div>
            {moneyFiltered.length>moneyPer && (
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-ghost" onClick={()=>setMoneyPage(p=>Math.max(1,p-1))}>◀</button>
                <span className="text-white/60 text-sm">Página {moneyPage} / {Math.ceil(moneyFiltered.length/moneyPer)}</span>
                <button className="btn-ghost" onClick={()=>setMoneyPage(p=>Math.min(Math.ceil(moneyFiltered.length/moneyPer),p+1))}>▶</button>
              </div>
            )}
          </Card>
        )}

        {tab === "UX Coins" && (
          <Card title="UX Coins" subtitle="Consulta por CitizenID (UXCOINS_JSON_PATH en env)">
            <div className="grid sm:grid-cols-[1fr_auto] gap-3">
              <input className="input" placeholder="CitizenID" value={uxCid} onChange={e=>setUxCid(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={fetchUx} disabled={loadingUx}>{loadingUx ? "Consultando…" : "Consultar"}</button>
                {uxRow && <button className="btn-ghost" onClick={()=>downloadCSV([uxRow], ["citizenid","name","uxcoins"], "uxcoins.csv")}>CSV</button>}
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>CitizenID</th><th>Nombre</th><th className="text-right">UX Coins</th></tr></thead>
                <tbody>
                  {uxRow ? (
                    <tr>
                      <td className="pr-4">{uxRow.citizenid}</td>
                      <td className="pr-4">{uxRow.name}</td>
                      <td className="text-right">{numberFmt(uxRow.uxcoins)}</td>
                    </tr>
                  ) : <tr><td colSpan={3} className="py-6 text-white/50">Sin datos…</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "Vehículos" && (
          <Card title="Vehículos" subtitle="Listado general o filtro por dueño (nombre)"
            action={<button className="btn-primary" onClick={fetchVeh} disabled={loadingVeh}>{loadingVeh ? "Buscando…" : "Buscar"}</button>}>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3">
              <input className="input" placeholder="Dueño (opcional)" value={vehOwner} onChange={e=>setVehOwner(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={fetchVeh} disabled={loadingVeh}>{loadingVeh ? "Buscando…" : "Buscar"}</button>
                <button className="btn-ghost" onClick={()=>downloadCSV(vehFiltered, ["plate","model","state","garage","type","citizenid","owner_name"], "vehicles.csv")}>CSV</button>
              </div>
            </div>
            <div className="toolbar mt-2">
              <input className="input" placeholder="Buscar (placa, modelo, owner, citizenid)" value={vehQ} onChange={e=>{setVehQ(e.target.value); setVehPage(1);}}/>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Por página</span>
                <select className="select" value={vehPer} onChange={e=>{setVehPer(Number(e.target.value)); setVehPage(1);}}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Placa</th><th>Modelo</th><th>Estado</th><th>Garage</th><th>Tipo</th><th>CitizenID</th><th>Dueño</th></tr></thead>
                <tbody>
                  {vehPageRows.map((v,i)=>(
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
                  {!loadingVeh && vehFiltered.length===0 && <tr><td colSpan={7} className="py-6 text-white/50">Sin resultados…</td></tr>}
                </tbody>
              </table>
            </div>
            {vehFiltered.length>vehPer && (
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-ghost" onClick={()=>setVehPage(p=>Math.max(1,p-1))}>◀</button>
                <span className="text-white/60 text-sm">Página {vehPage} / {Math.ceil(vehFiltered.length/vehPer)}</span>
                <button className="btn-ghost" onClick={()=>setVehPage(p=>Math.min(Math.ceil(vehFiltered.length/vehPer),p+1))}>▶</button>
              </div>
            )}
          </Card>
        )}

        {tab === "VIP" && (
          <Card title="VIP" subtitle="Quién tiene VIP y días restantes"
            action={<div className="flex gap-2">
              <button className="btn-ghost" onClick={()=>downloadCSV(vipFiltered, ["citizenid","name","vip","vip_start","vip_end","days_left"], "vip.csv")}>CSV</button>
              <button className="btn-primary" onClick={fetchVip} disabled={loadingVip}>{loadingVip ? "Actualizando…" : "Actualizar"}</button>
            </div>}>
            <div className="toolbar">
              <input className="input" placeholder="Buscar (nombre o citizenid)" value={vipQ} onChange={e=>{setVipQ(e.target.value); setVipPage(1);}}/>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Por página</span>
                <select className="select" value={vipPer} onChange={e=>{setVipPer(Number(e.target.value)); setVipPage(1);}}>
                  <option>10</option><option>25</option><option>50</option>
                </select>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>CitizenID</th><th>Nombre</th><th>VIP</th><th>Inicio</th><th>Fin</th><th>Restante</th></tr></thead>
                <tbody>
                  {vipPageRows.map((r,i)=>(
                    <tr key={i}>
                      <td className="pr-4">{r.citizenid}</td>
                      <td className="pr-4">{r.name}</td>
                      <td className="pr-4">{r.vip}</td>
                      <td className="pr-4">{r.vip_start ?? "-"}</td>
                      <td className="pr-4">{r.vip_end ?? "-"}</td>
                      <td>{r.days_left==null ? "-" : <BadgeDays days={r.days_left} />}</td>
                    </tr>
                  ))}
                  {!loadingVip && vipFiltered.length===0 && <tr><td colSpan={6} className="py-6 text-white/50">Sin datos…</td></tr>}
                </tbody>
              </table>
            </div>
            {vipFiltered.length>vipPer && (
              <div className="flex justify-end gap-2 mt-3">
                <button className="btn-ghost" onClick={()=>setVipPage(p=>Math.max(1,p-1))}>◀</button>
                <span className="text-white/60 text-sm">Página {vipPage} / {Math.ceil(vipFiltered.length/vipPer)}</span>
                <button className="btn-ghost" onClick={()=>setVipPage(p=>Math.min(Math.ceil(vipFiltered.length/vipPer),p+1))}>▶</button>
              </div>
            )}
          </Card>
        )}
      </main>
    </>
  );
}
