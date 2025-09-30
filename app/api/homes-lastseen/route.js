import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT id, house, citizenid, owner,
           firstname, lastname, last_seen, days_since,
           CASE
             WHEN days_since > 30 THEN 'rojo'
             WHEN days_since > 15 THEN 'amarillo'
             ELSE 'verde'
           END AS estado
    FROM v_unitx_homeowners_lastseen
    ORDER BY days_since DESC
  `);
  return NextResponse.json(rows);
}
