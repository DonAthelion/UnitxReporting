export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT
      citizenid, name, vip,
      CASE
        WHEN fechavip REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechavip AS UNSIGNED))
        ELSE STR_TO_DATE(fechavip, '%Y-%m-%d %H:%i:%s')
      END AS vip_start,
      CASE
        WHEN fechafinal REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechafinal AS UNSIGNED))
        ELSE STR_TO_DATE(fechafinal, '%Y-%m-%d %H:%i:%s')
      END AS vip_end,
      DATEDIFF(
        CASE
          WHEN fechafinal REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechafinal AS UNSIGNED))
          ELSE STR_TO_DATE(fechafinal, '%Y-%m-%d %H:%i:%s')
        END,
        NOW()
      ) AS days_left
    FROM players
    WHERE vip <> '0'
    ORDER BY days_left ASC
  `);
  return NextResponse.json(rows);
}
