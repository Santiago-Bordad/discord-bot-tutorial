# fase 00 - preparacion

## paso 1: instalar node.js
- bajar la version lts de https://nodejs.org
- verificar en la terminal:
  node -v
  npm -v

## paso 2: crear la aplicacion en discord
- entrar a https://discord.com/developers/applications
- new application -> ponerle nombre
- ir a "bot" -> reset token -> copiar el token
- ⚠️ el token nunca se sube a git

## paso 3: activar los intents
- en "bot" -> privileged gateway intents
- activar: server members intent y message content intent

## paso 4: invitar el bot al servidor
- oauth2 -> url generator
- scopes: bot y applications.commands
- permisos: administrator (para probar)
- abrir el link y elegir el servidor

## paso 5: sacar los ids
- client_id: en "general information" -> application id
- guild_id: activar modo desarrollador en discord,
  click derecho en el servidor -> copiar id

## paso 6: crear el proyecto
  mkdir mi-bot
  cd mi-bot
  npm init -y
  npm install discord.js dotenv

- crear un archivo .env:
  TOKEN=tu_token
  CLIENT_ID=tu_client_id
  GUILD_ID=tu_guild_id

- crear un .gitignore:
  node_modules/
  .env