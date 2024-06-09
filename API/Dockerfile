# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación al directorio de trabajo
COPY ./api.js ./

# Instala las dependencias
# Instala Express y axios
RUN npm init -y
RUN npm install express
RUN npm install axios
RUN npm i http-proxy-middleware

# Expone el puerto en el que la aplicación escucha las solicitudes HTTP
EXPOSE 3000

# Define el comando de inicio
CMD ["node", "api.js"]