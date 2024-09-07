# Etapa de construcción del frontend
FROM node:21.5.0 AS build

# Configura el directorio de trabajo para el frontend
WORKDIR /usr/src/app/client

# Copia los archivos package.json y package-lock.json para instalar dependencias
COPY client/package*.json ./

# Instala las dependencias del frontend
RUN npm install

# Copia el resto del código del frontend
COPY client/ .

# Construye la aplicación frontend
RUN npm run build

# Etapa de construcción del backend
FROM node:21.5.0

# Configura el directorio de trabajo para el backend
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto del código del backend
COPY src/ ./src

# Copia los archivos construidos del frontend desde la etapa de construcción
COPY --from=build /usr/src/app/client/build /usr/src/app/src/public

# Expone el puerto en el que tu servidor escuchará
EXPOSE 5000

# Comando para iniciar la aplicación backend
CMD ["npm", "start"]
