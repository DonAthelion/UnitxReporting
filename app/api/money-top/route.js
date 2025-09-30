import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT citizenid, name,
           CAST(JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')) AS UNSIGNED) AS cash,
           CAST(JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')) AS UNSIGNED) AS bank,
           (CAST(JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')) AS UNSIGNED) +
            CAST(JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')) AS UNSIGNED)) AS total
    FROM players
    ORDER BY total DESC
    LIMIT 50
  `);
  return NextResponse.json(rows);
}
