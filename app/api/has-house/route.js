import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET(req) {
  const citizenid = req.nextUrl.searchParams.get("citizenid") || "";
  if (!citizenid) return NextResponse.json({ error: "citizenid requerido" }, { status: 400 });

  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT house, owner, COALESCE(rented,0) AS rented
     FROM player_houses
     WHERE citizenid = ?
       AND COALESCE(rented,0) = 0`,
    [citizenid]
  );
  return NextResponse.json(rows);
}
