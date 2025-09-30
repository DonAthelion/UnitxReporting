export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET(req) {
  const owner = req.nextUrl.searchParams.get("owner") || "";
  const pool = getPool();
  let sql, params;
  if (owner) {
    sql = `SELECT v.plate, v.vehicle AS model, v.state, v.garage, v.type,
                  v.citizenid, p.name AS owner_name
           FROM player_vehicles v
           JOIN players p ON p.citizenid = v.citizenid
           WHERE p.name LIKE CONCAT('%', ?, '%')
           ORDER BY v.vehicle`;
    params = [owner];
  } else {
    sql = `SELECT v.plate, v.vehicle AS model, v.state, v.garage, v.type,
                  v.citizenid, p.name AS owner_name
           FROM player_vehicles v
           LEFT JOIN players p ON p.citizenid = v.citizenid
           ORDER BY owner_name, v.plate`;
    params = [];
  }
  const [rows] = await pool.query(sql, params);
  return NextResponse.json(rows);
}
