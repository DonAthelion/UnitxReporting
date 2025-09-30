"use client";
import { useEffect, useState } from "react";

function Card({ title, children }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ days }) {
  if (days > 30) return <span className="badge badge-red">{days} días</span>;
  if (days > 15) return <span className="badge badge-yellow">{days} días</span>;
  return <span className="badge badge-green">{days} días</span>;
}

export default function Dashboard() {
  // simple examples to fetch after mount can be added as needed
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">UnitX RP • Reportes</h1>
          <p className="text-white/60 text-sm">Panel interno</p>
        </div>
        <a className="btn" href="/api/logout">Salir</a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card title="1) Última Conexión">
          <form onSubmit={async(e)=>{
            e.preventDefault();
            const term = e.currentTarget.term.value;
            const res = await fetch(`/api/lastseen?term=${encodeURIComponent(term)}`);
            const data = await res.json();
            const el = document.getElementById("lastseen-results");
            el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          }} className="space-y-2">
            <input name="term" className="input" placeholder="Nombre o CitizenID" />
            <button className="btn-primary">Buscar</button>
          </form>
          <div id="lastseen-results" className="mt-3 text-sm whitespace-pre-wrap"></div>
        </Card>

        <Card title="2) UX Coins">
          <form onSubmit={async(e)=>{
            e.preventDefault();
            const cid = e.currentTarget.cid.value;
            const res = await fetch(`/api/uxcoins?citizenid=${encodeURIComponent(cid)}`);
            const data = await res.json();
            const el = document.getElementById("uxcoins-results");
            el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          }} className="space-y-2">
            <input name="cid" className="input" placeholder="CitizenID" />
            <button className="btn-primary">Consultar</button>
          </form>
          <div id="uxcoins-results" className="mt-3 text-sm whitespace-pre-wrap"></div>
        </Card>

        <Card title="3) ¿Tiene Casa?">
          <form onSubmit={async(e)=>{
            e.preventDefault();
            const cid = e.currentTarget.cid.value;
            const res = await fetch(`/api/has-house?citizenid=${encodeURIComponent(cid)}`);
            const data = await res.json();
            const el = document.getElementById("house-results");
            el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          }} className="space-y-2">
            <input name="cid" className="input" placeholder="CitizenID" />
            <button className="btn-primary">Consultar</button>
          </form>
          <div id="house-results" className="mt-3 text-sm whitespace-pre-wrap"></div>
        </Card>

        <Card title="4) Casas & Últimas Conexiones (inactividad)">
          <a className="btn-primary" href="/api/homes-lastseen" target="_blank" rel="noreferrer">Ver reporte</a>
        </Card>

        <Card title="5) Top Dinero">
          <a className="btn-primary" href="/api/money-top" target="_blank" rel="noreferrer">Ver Top 50</a>
        </Card>

        <Card title="6) Vehículos">
          <form onSubmit={async(e)=>{
            e.preventDefault();
            const owner = e.currentTarget.owner.value;
            const url = owner ? `/api/vehicles?owner=${encodeURIComponent(owner)}` : "/api/vehicles";
            const res = await fetch(url);
            const data = await res.json();
            const el = document.getElementById("veh-results");
            el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          }} className="space-y-2">
            <input name="owner" className="input" placeholder="Dueño (opcional)" />
            <button className="btn-primary">Buscar</button>
          </form>
          <div id="veh-results" className="mt-3 text-sm whitespace-pre-wrap"></div>
        </Card>

        <Card title="7) VIP">
          <a className="btn-primary" href="/api/vip" target="_blank" rel="noreferrer">Ver VIP</a>
        </Card>
      </div>
    </div>
  );
}
