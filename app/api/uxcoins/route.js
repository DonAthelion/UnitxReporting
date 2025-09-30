// app/api/uxcoins/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET(req) {
  const citizenid = req.nextUrl.searchParams.get("citizenid") || "";
  if (!citizenid) return NextResponse.json({ error: "citizenid requerido" }, { status: 400 });

  const jsonPath = process.env.UXCOINS_JSON_PATH || "$.uxcoins";
  const pool = getPool();

  // Sanitiza: si metadata es NULL o la ruta no existe o no es numérica → 0
  const sql = `
    SELECT
      citizenid,
      name,
      CAST(
        IF(
          JSON_UNQUOTE(
            JSON_EXTRACT(
              IFNULL(metadata, '{}'),
              ?
            )
          ) REGEXP '^-?[0-9]+$',
          JSON_UNQUOTE(JSON_EXTRACT(IFNULL(metadata, '{}'), ?)),
          '0'
        ) AS DECIMAL(30,0)
      ) AS uxcoins
    FROM players
    WHERE citizenid = ?
    LIMIT 1
  `;
  const params = [jsonPath, jsonPath, citizenid];

  try {
    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "uxcoins query failed", detail: String(err) }, { status: 500 });
  }
}
