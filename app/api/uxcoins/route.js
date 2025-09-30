import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET(req) {
  const citizenid = req.nextUrl.searchParams.get("citizenid") || "";
  if (!citizenid) return NextResponse.json({ error: "citizenid requerido" }, { status: 400 });

  const jsonPath = process.env.UXCOINS_JSON_PATH || "$.uxcoins";
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT citizenid, name,
            CAST(JSON_UNQUOTE(JSON_EXTRACT(metadata, ?)) AS UNSIGNED) AS uxcoins
     FROM players
     WHERE citizenid = ?`,
    [jsonPath, citizenid]
  );
  return NextResponse.json(rows);
}
