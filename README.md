# UnitX RP • Panel de Reportes

Panel con login y 7 reportes conectados a MariaDB (QBCore). Stack:
- Next.js (App Router) + Tailwind
- API Routes serverless con `mysql2/promise`
- Autenticación simple por cookie (usuario/clave de .env)

## Requisitos
- Node 18+
- Una base de datos MariaDB accesible desde internet o tu entorno de despliegue.
- Crear un usuario **read-only** para la web.

## Configuración
1. Copia `.env.example` a `.env.local` y completa:
   - `DATABASE_URL` (usa el usuario read-only)
   - `PANEL_USER` / `PANEL_PASS`
   - `UXCOINS_JSON_PATH` si tus UX coins están en otra ruta JSON
2. Instala dependencias:
   ```bash
   npm i
   npm run dev
   ```

## Endpoints
- `POST /api/login`  -> setea cookie de sesión si credenciales OK.
- `GET  /api/logout` -> borra cookie.
- Reportes:
  1. `GET /api/lastseen?term=<nameOrCitizenId>`
  2. `GET /api/uxcoins?citizenid=...`
  3. `GET /api/has-house?citizenid=...`
  4. `GET /api/homes-lastseen`
  5. `GET /api/money-top`
  6. `GET /api/vehicles?owner=...` (opcional)
  7. `GET /api/vip`

## Despliegue Gratis
### Vercel
- Sube el repo a GitHub.
- Crea proyecto en Vercel.
- En **Environment Variables** agrega: `DATABASE_URL`, `PANEL_USER`, `PANEL_PASS`, `SESSION_COOKIE`, `SESSION_COOKIE_VALUE`, `UXCOINS_JSON_PATH` (opcional).
- Deploy.

### Cloudflare (alternativa)
- Front: Cloudflare Pages.
- API: Cloudflare Workers o micro API detrás de Cloudflare Tunnel.
- Variables de entorno: mismas que arriba.

## Seguridad
- Usa usuario **read-only** en la DB.
- No subas `.env.local` al repo.
- Si quieres HMAC en la cookie, agrega firmar/verificar con un `SESSION_SECRET` y cambia el `middleware`.
