# AGENTS.md

API REST de gestión de turnos (clases y reservas) con Express 5. Código, mensajes de respuesta y comentarios en español. ESM (`"type": "module"`), sin TypeScript, linter ni tests.

## Comandos

- `npm run dev` — levanta el servidor con nodemon en `http://localhost:3000` (o el `PORT` del `.env`).
- `npm test` — no hay tests: el script falla a propósito (`exit 1`). No lo uses como verificación.
- No hay lint/format/typecheck. Verificar un cambio = levantar el server y probar los endpoints (`GET /` responde un healthcheck).

## Estado actual (no asumir lo contrario)

- Los dos controllers ya usan MySQL a través de `pool` (`src/config/db.js`: `createPool` de `mysql2/promise`, lee `DB_*` del `.env`, `dateStrings: true`). No quedan datos en memoria.
- `docker-compose.yml` levanta MySQL 8.4 leyendo `DB_PORT`, `DB_PASSWORD` y `DB_NAME` del `.env`. Requiere Docker Desktop corriendo y **no** monta `database/schema.sql`: hay que aplicarlo a mano.
- El server local puede estar corriendo con `node src/app.js` (sin recarga automática): reiniciarlo para que tome cambios.

## Arquitectura

- `src/app.js` es el único entrypoint: monta `/clases` y `/reservas`.
- `src/routes/*.routes.js` solo mapean CRUD REST a los controllers. Los updates usan `PATCH` (actualización parcial).
- `reservas.controller.js` valida la clase con un `SELECT` a `clases` (existe y está activa) y cuenta cupos con `COUNT(*)`; no importa nada de `clases.controller.js`.
- Los ids los genera MySQL (`AUTO_INCREMENT`); usar `result.insertId`.

## Reglas de negocio

- Estados de reserva válidos: `confirmada` | `cancelada`; `fecha` debe ser `YYYY-MM-DD`. Ambos se validan antes del SQL y devuelven 400.
- El cupo se valida solo en `createReserva`, contando reservas `confirmada`; `updateReserva` no revalida cupo.
- Defaults al crear clase: `cupoMaximo = 10`, `activo = true`.

## Convenciones

- JSON de la API en camelCase (`cupoMaximo`, `claseId`, `nombreCliente`); el schema SQL usa snake_case (`cupo_maximo`, `clase_id`, `nombre_cliente`). Mapear explícitamente al conectar la DB.
- Ramas existentes: `main`, `desarrollo`, `valen`, `gabi`. El trabajo actual está en `valen`.

## Flujo de trabajo

- El dueño del repo pide que le preguntes **antes** de modificar archivos. `AGENTS.md` es la excepción: se puede actualizar sin preguntar.
