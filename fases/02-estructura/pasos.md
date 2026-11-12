# fase 02 - estructura con carpetas

## objetivo
dejar de tener todo en index.js y separar comandos y eventos en carpetas.
los handlers los cargan solos: agregas un archivo y ya funciona, sin tocar index.js

## por que
con un solo index.js, cada comando nuevo es otro if adentro del mismo evento.
con 20 comandos eso es imposible de leer y de mantener

## como queda
```
mi-bot/
├── index.js                  -> crea el bot y llama a los handlers
├── handlers/
│   ├── commandHandler.js     -> carga todos los archivos de commands/
│   └── eventHandler.js       -> carga todos los archivos de events/
├── events/
│   ├── ready.js              -> cuando el bot se conecta
│   └── messageCreate.js      -> cuando llega un mensaje, busca el comando
└── commands/
    └── utilidades/
        └── ping.js           -> el comando !ping
```

## paso 1: crear las carpetas
```bash
  mkdir handlers events commands
  mkdir commands/utilidades
```

## paso 2: modificar el index.js
- copiar el index.js de `ejemplo/`
- tiene los mismos intents y partials de la fase 01
- se saca el client.once y el client.on (se mudan a events/)
- se agrega `client.commands` y se llama a los handlers

## paso 3: crear los handlers
- copiar `handlers/commandHandler.js` y `handlers/eventHandler.js`
- no hace falta tocarlos nunca mas

## paso 4: crear los eventos
- copiar `events/ready.js` y `events/messageCreate.js`

## paso 5: crear el primer comando
- copiar `commands/utilidades/ping.js`

## paso 6: probar
```bash
node index.js
```
- en consola tiene que aparecer:
```
evento cargado: ready
evento cargado: messageCreate
comando cargado: ping
conectado como ...
```
- escribir `!ping` en el servidor

---

## formato de un comando
archivo en `commands/<categoria>/<nombre>.js`
```js
module.exports = {
  name: 'nombre',              // lo que se escribe despues del prefijo
  description: 'que hace',
  async execute(message, args, client) {
    // codigo del comando
  },
};
```

## formato de un evento
archivo en `events/<nombre>.js`
```js
const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,  // cualquier Events.X
  once: false,                  // true = solo se ejecuta una vez
  async execute(...args) {
    // codigo del evento (el ultimo argumento siempre es client)
  },
};
```

## para agregar un comando nuevo
1. crear el archivo en `commands/<categoria>/`
2. reiniciar el bot
3. listo, no se toca nada mas

## conceptos
- **handler**: archivo que recorre una carpeta y carga lo que encuentra
- **collection**: un map de discord.js, guardamos nombre -> comando
- **module.exports**: lo que un archivo "exporta" para que otro lo use con require
- **args**: las palabras que van despues del comando (`!say hola mundo` -> `['hola', 'mundo']`)

## errores comunes
| error | solucion |
|---|---|
| `enoent: no such file or directory` | falta crear alguna carpeta (paso 1) |
| `comando cargado` no aparece | el archivo no termina en .js o le falta name/execute |
| `x is not a function` | el archivo no tiene `module.exports` |
| el comando no responde | revisar que el `name` sea igual a lo que escribis |