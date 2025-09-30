// app/api/vip/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET() {
  const pool = getPool();
  const sql = `
    SELECT
      citizenid,
      name,
      vip,
      /* Normaliza fechavip */
      CASE
        WHEN fechavip IS NULL OR fechavip = '' THEN NULL
        WHEN fechavip REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechavip AS UNSIGNED))
        ELSE STR_TO_DATE(fechavip, '%Y-%m-%d %H:%i:%s')
      END AS vip_start,
      /* Normaliza fechafinal */
      CASE
        WHEN fechafinal IS NULL OR fechafinal = '' THEN NULL
        WHEN fechafinal REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechafinal AS UNSIGNED))
        ELSE STR_TO_DATE(fechafinal, '%Y-%m-%d %H:%i:%s')
      END AS vip_end,
      /* Días restantes (NULL si no hay fin) */
      CASE
        WHEN (CASE
                WHEN fechafinal IS NULL OR fechafinal = '' THEN NULL
                WHEN fechafinal REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechafinal AS UNSIGNED))
                ELSE STR_TO_DATE(fechafinal, '%Y-%m-%d %H:%i:%s')
              END) IS NULL
          THEN NULL
        ELSE DATEDIFF(
          (CASE
            WHEN fechafinal REGEXP '^[0-9]+$' THEN FROM_UNIXTIME(CAST(fechafinal AS UNSIGNED))
            ELSE STR_TO_DATE(fechafinal, '%Y-%m-%d %H:%i:%s')
          END),
          NOW()
        )
      END AS days_left
    FROM players
    WHERE vip IS NOT NULL AND vip <> '0'
    ORDER BY days_left IS NULL, days_left ASC, name ASC
  `;
  try {
    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "vip query failed", detail: String(err) }, { status: 500 });
  }
}
