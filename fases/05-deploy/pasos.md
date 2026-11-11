# fase 05 - deploy

## objetivo
dejar el bot prendido 24/7, que se reinicie solo si se cae y que un error no lo apague

## el problema
con `node index.js` el bot vive mientras la terminal este abierta.
si cerras la terminal, apagas la pc o hay un error no manejado -> el bot se apaga

## como queda
```
mi-bot/
├── index.js                  -> CAMBIA: se agrega el antiCrash
├── ecosystem.config.js       -> NUEVO: configuracion de pm2
├── package.json              -> CAMBIA: scripts nuevos
└── handlers/
    └── antiCrash.js          -> NUEVO: atrapa errores para que el bot no se caiga
```

## paso 1: agregar el antiCrash
- copiar `ejemplo/handlers/antiCrash.js` a `handlers/`
- en index.js, arriba de todo (despues del require de dotenv), agregar:
```js
require('./handlers/antiCrash')();
```

## paso 2: instalar pm2
pm2 es un programa que mantiene node prendido y lo reinicia si se cae
```bash
npm install -g pm2
```
- verificar con `pm2 -v`

## paso 3: crear la configuracion de pm2
- copiar `ejemplo/ecosystem.config.js` a la raiz
- cambiar `name` por el nombre de tu bot

## paso 4: agregar los scripts
en `package.json`, dentro de "scripts":
```json
"start": "node index.js",
"deploy": "node deploy-commands.js",
"pm2:start": "pm2 start ecosystem.config.js",
"pm2:stop": "pm2 stop mi-bot",
"pm2:restart": "pm2 restart mi-bot",
"pm2:logs": "pm2 logs mi-bot"
```

## paso 5: prender el bot con pm2
```bash
npm run deploy      # registrar comandos (si cambiaste alguno)
npm run pm2:start
```
- ahora podes cerrar la terminal y el bot sigue prendido

## paso 6: comandos de pm2
| comando | para que |
|---|---|
| `pm2 list` | ver que esta corriendo |
| `pm2 logs mi-bot` | ver la consola del bot en vivo |
| `pm2 restart mi-bot` | reiniciar (despues de cambiar codigo) |
| `pm2 stop mi-bot` | apagar |
| `pm2 delete mi-bot` | sacarlo de pm2 |
| `pm2 monit` | ver memoria y cpu |

## paso 7: que arranque solo al prender la maquina
- **linux**:
```bash
pm2 startup     # copia y pega el comando que te devuelve
pm2 save        # guarda la lista de procesos actual
```
- **windows**: `pm2 startup` no anda, usar el paquete `pm2-windows-startup`:
```bash
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

---

## donde hostear el bot
| opcion | pros | contras |
|---|---|---|
| tu pc | gratis, facil | se apaga si apagas la pc |
| raspberry pi / pc vieja | gratis despues de comprarla, consume poco | depende de tu luz e internet |
| vps (servidor en la nube) | 24/7 real, control total | se paga (o free tiers con limites), hay que saber linux |
| hosting de bots | facil, panel web | los gratis suelen tener limites o apagarse |

para un bot chico alcanza con 512mb de ram

## subir el bot a un vps (resumen)
```bash
# 1. en el vps, instalar node (lts) y git
# 2. clonar tu proyecto
git clone https://github.com/tu-usuario/mi-bot.git
cd mi-bot
npm install
# 3. crear el .env a mano (nunca esta en git)
nano .env
# 4. registrar comandos y prender
npm run deploy
npm install -g pm2
npm run pm2:start
pm2 startup && pm2 save
```

## actualizar el bot despues de cambiar codigo
```bash
git pull
npm install          # por si agregaste paquetes
npm run deploy       # solo si cambiaste comandos
pm2 restart mi-bot
```

## checklist antes de deployar
- [ ] el `.env` no esta en git
- [ ] el bot funciona con `npm start` en tu pc
- [ ] los comandos estan registrados (global si es para varios servidores, fase 03)
- [ ] sacaste los intents que no usas (fase 01)
- [ ] el antiCrash esta agregado

## errores comunes
| error | solucion |
|---|---|
| `pm2 no se reconoce como comando` | falta `npm install -g pm2` o reiniciar la terminal |
| pm2 dice `online` pero el bot no se conecta | `pm2 logs mi-bot` para ver el error |
| `an invalid token was provided` en el vps | falta crear el .env en el vps |
| el bot se reinicia todo el tiempo | hay un error al arrancar, mirar `pm2 logs` |
| los cambios no se aplican | falto `pm2 restart mi-bot` |