export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db.js";

export async function GET() {
  const pool = getPool();

  // Usamos DECIMAL(30,0) para evitar overflow de BIGINT UNSIGNED
  // y saneamos valores no numéricos con REGEXP.
  const sql = `
    SELECT
      citizenid,
      name,
      CAST(
        IF(JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')) REGEXP '^-?[0-9]+$',
           JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')),
           '0'
        ) AS DECIMAL(30,0)
      ) AS cash,
      CAST(
        IF(JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')) REGEXP '^-?[0-9]+$',
           JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')),
           '0'
        ) AS DECIMAL(30,0)
      ) AS bank,
      (
        CAST(
          IF(JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')) REGEXP '^-?[0-9]+$',
             JSON_UNQUOTE(JSON_EXTRACT(money, '$.cash')),
             '0'
          ) AS DECIMAL(30,0)
        )
        +
        CAST(
          IF(JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')) REGEXP '^-?[0-9]+$',
             JSON_UNQUOTE(JSON_EXTRACT(money, '$.bank')),
             '0'
          ) AS DECIMAL(30,0)
        )
      ) AS total
    FROM players
    ORDER BY total DESC
    LIMIT 50
  `;

  try {
    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
  } catch (err) {
    // Evita que un error de SQL rompa el build/ejecución
    return NextResponse.json(
      { error: "money-top query failed", detail: String(err) },
      { status: 500 }
    );
  }
}
