# AGENTS.md

API REST de gestión de turnos (clases y reservas) con Express 5. Código, mensajes de respuesta y comentarios en español. ESM (`"type": "module"`), sin TypeScript, linter ni tests.

## Comandos

- `npm run dev` — levanta el servidor con nodemon en `http://localhost:3000` (o el `PORT` del `.env`).
- `npm test` — no hay tests: el script falla a propósito (`exit 1`). No lo uses como verificación.
- No hay lint/format/typecheck. Verificar un cambio = levantar el server y probar los endpoints (`GET /` responde un healthcheck).

## Estado actual (no asumir lo contrario)

- La API funciona **en memoria**: los controllers guardan arrays a nivel de módulo (`clases`, `reservas`, `nextId`) y los datos se pierden al reiniciar.
- `mysql2` está instalado, pero **la DB no está conectada**. `src/config/db.js` está sin trackear y roto (`import { mysql } from 'mysql2/promise'` y `import {'dotenv/config'}` no son válidos).
- `docker-compose.yml` levanta MySQL 8.4 leyendo `DB_PORT`, `DB_PASSWORD` y `DB_NAME` del `.env`, pero **no** monta `database/schema.sql`: hay que aplicarlo a mano.

## Arquitectura

- `src/app.js` es el único entrypoint: monta `/clases` y `/reservas`.
- `src/routes/*.routes.js` solo mapean CRUD REST a los controllers.
- `clases.controller.js` exporta el array `clases` además de los handlers; `reservas.controller.js` lo importa para validar existencia, estado activo y cupo. Cambiar o renombrar ese export rompe reservas.
- Los ids nuevos salen de un contador `nextId`; no derivarlos de `array.length` (provoca colisiones después de un delete).

## Reglas de negocio

- Estados de reserva válidos: `confirmada` | `cancelada`.
- El cupo se valida solo en `createReserva`, contando reservas `confirmada`; `updateReserva` no revalida cupo.
- Defaults al crear clase: `cupoMaximo = 10`, `activo = true`.

## Convenciones

- JSON de la API en camelCase (`cupoMaximo`, `claseId`, `nombreCliente`); el schema SQL usa snake_case (`cupo_maximo`, `clase_id`, `nombre_cliente`). Mapear explícitamente al conectar la DB.
- Ramas existentes: `main`, `desarrollo`, `valen`, `gabi`. El trabajo actual está en `valen`.
