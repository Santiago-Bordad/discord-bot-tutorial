# fase 06 - base de datos

## objetivo
guardar datos que no se pierdan al reiniciar el bot: configuracion de cada servidor, monedas, niveles, etc

## por que
hasta ahora todo vivia en:
- el `.env`: sirve para un solo servidor y hay que reiniciar para cambiarlo
- la memoria (collections): se borra cuando el bot se apaga

## por que sqlite
- la base de datos es **un archivo** (`data/bot.db`), no hay que instalar ni configurar un servidor
- `better-sqlite3` es rapido y simple (no hace falta async/await)
- alcanza de sobra para bots de hasta miles de servidores

## como queda
```
mi-bot/
├── data/
│   └── bot.db                -> se crea solo, NO se sube a git
├── database/
│   ├── db.js                 -> NUEVO: conexion y creacion de tablas
│   ├── config.js             -> NUEVO: funciones de configuracion por servidor
│   └── usuarios.js           -> NUEVO: funciones de datos de usuarios
└── commands/
    ├── config/
    │   └── config.js         -> NUEVO: /config canal, ver, borrar
    └── economia/
        ├── daily.js          -> NUEVO: monedas cada 24 horas
        └── balance.js        -> NUEVO: ver monedas y top
```

## paso 1: instalar better-sqlite3
```bash
npm install better-sqlite3
```
- necesita node 22 o mas. con node 20 usar: `npm install better-sqlite3@12`

## paso 2: agregar al .gitignore
```
data/
*.db
```
- la base de datos tiene datos de los usuarios, no se sube a git

## paso 3: copiar la carpeta database
- copiar `ejemplo/database/` entera a la raiz

## paso 4: conectar la base al arrancar
en index.js, abajo de `require('dotenv').config();`:
```js
require('./database/db');
```
- asi se crean las tablas apenas prende el bot

## paso 5: copiar los comandos
- copiar `ejemplo/commands/config/` y `ejemplo/commands/economia/`

## paso 6: registrar y probar
```bash
node deploy-commands.js
node index.js
```
- en consola: `base de datos conectada`
- `/config canal funcion:logs canal:#logs` y despues `/config ver`
- `/daily` dos veces seguidas: la segunda dice cuando volver
- reiniciar el bot y `/balance`: las monedas siguen ahi

---

## como se usa en otros archivos
```js
// en un comando (commands/<categoria>/x.js)
const { obtenerConfig } = require('../../database/config');

// en un evento, boton, menu o modal (events/x.js, buttons/x.js, etc)
const { obtenerConfig } = require('../database/config');

const canalId = obtenerConfig(guild.id, 'canal_logs');
const canal = guild.channels.cache.get(canalId);
```

### pasar los eventos de la fase 04 del .env a la base de datos
en `events/guildMemberAdd.js`, cambiar:
```js
const canal = member.guild.channels.cache.get(process.env.CANAL_BIENVENIDA);
```
por:
```js
const { obtenerConfig } = require('../database/config'); // arriba de todo

const canal = member.guild.channels.cache.get(obtenerConfig(member.guild.id, 'canal_bienvenida'));
```
y lo mismo con `CANAL_LOGS` -> `'canal_logs'` y `CANAL_SUGERENCIAS` -> `'canal_sugerencias'`.
ahora cada servidor configura su canal con `/config` y el `.env` solo tiene el token

---

## sql basico
| que | sql |
|---|---|
| crear tabla | `CREATE TABLE IF NOT EXISTS x (col1 TEXT, col2 INTEGER)` |
| insertar | `INSERT INTO x (col1, col2) VALUES (?, ?)` |
| insertar si no existe | `INSERT OR IGNORE INTO x ...` |
| leer | `SELECT * FROM x WHERE col1 = ?` |
| actualizar | `UPDATE x SET col2 = ? WHERE col1 = ?` |
| borrar | `DELETE FROM x WHERE col1 = ?` |
| ordenar y limitar | `SELECT * FROM x ORDER BY col2 DESC LIMIT 10` |

### tipos de columnas
| tipo | para que |
|---|---|
| `TEXT` | texto y **ids de discord** (son muy largos para INTEGER en js) |
| `INTEGER` | numeros enteros, fechas en milisegundos, true/false (1/0) |
| `REAL` | numeros con decimales |

### metodos de better-sqlite3
| metodo | devuelve | para que |
|---|---|---|
| `db.prepare(sql)` | consulta preparada | armarla una vez y reusarla |
| `.get(...valores)` | un objeto o `undefined` | leer una fila |
| `.all(...valores)` | array de objetos | leer varias filas |
| `.run(...valores)` | `{ changes }` | insertar, actualizar, borrar |
| `db.exec(sql)` | nada | crear tablas |

⚠️ **siempre usar `?`** para los valores, nunca meterlos con `${}` en el texto del sql.
si un usuario escribe algo raro en un comando, con `${}` puede romper o borrar la base (sql injection)

## subcomandos
```js
new SlashCommandBuilder()
    .setName('config')
    .addSubcommand((sub) => sub.setName('ver').setDescription('...'))
    .addSubcommand((sub) => sub.setName('canal').setDescription('...').addChannelOption(...));

// en execute
const sub = interaction.options.getSubcommand(); // 'ver' o 'canal'
```
- un comando con subcomandos no puede tener opciones sueltas, van adentro de cada subcomando
- max 25 subcomandos por comando

## choices (opciones fijas)
```js
.addStringOption((option) =>
    option.setName('funcion').setDescription('...').addChoices(
        { name: 'lo que ve el usuario', value: 'lo que recibe el bot' },
    ),
)
```
max 25 choices

## agregar una tabla nueva
1. en `database/db.js` agregar otro `db.exec('CREATE TABLE IF NOT EXISTS ...')`
2. crear `database/<nombre>.js` con las funciones
3. reiniciar el bot

⚠️ `CREATE TABLE IF NOT EXISTS` no modifica tablas que ya existen. para agregar una columna a una tabla vieja:
```js
try { db.exec('ALTER TABLE usuarios ADD COLUMN xp INTEGER NOT NULL DEFAULT 0'); } catch {}
```
(el try es porque la segunda vez tira error de que la columna ya existe)

## ver la base de datos
programa gratis: **db browser for sqlite** (https://sqlitebrowser.org).
abrir `data/bot.db` y se ven las tablas como un excel

## backups
copiar `data/bot.db` (con el bot apagado). si se borra ese archivo, se pierden todos los datos

## errores comunes
| error | solucion |
|---|---|
| `could not locate the bindings file` / `node-gyp` | node viejo, actualizar a node 22 lts o usar `better-sqlite3@12` |
| `no such table` | la tabla no esta en db.js o falta `require('./database/db')` en index.js |
| `no such column` | agregaste la columna en db.js pero la tabla ya existia, usar ALTER TABLE |
| `unique constraint failed` | insertaste algo que ya existia, usar `INSERT OR IGNORE` u `ON CONFLICT` |
| `database is locked` | tenes la base abierta en db browser guardando cambios, cerrarlo |
| los datos se borran al reiniciar | el bot arranca desde otra carpeta, revisar `cwd` en pm2 (fase 05) |