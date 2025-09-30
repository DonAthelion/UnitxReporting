export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET(req) {
  const term = (req.nextUrl.searchParams.get("term") || "").trim();
  const pool = getPool();
  const sql = `
    SELECT citizenid, name, last_updated AS last_seen
    FROM players
    WHERE name LIKE CONCAT('%', ?, '%')
       OR citizenid = ?
    ORDER BY last_updated DESC
    LIMIT 25
  `;
  const [rows] = await pool.query(sql, [term, term]);
  return NextResponse.json(rows);
}
