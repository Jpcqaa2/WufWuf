const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT1 = 3000;
const PORT2 = 3001;

// ================== API GATEWAY PARA EL CATÁLOGO ==================

// Configura un proxy para redirigir las solicitudes a catalog-front-service
const serviceProxyCatalog = createProxyMiddleware({
    target: 'http://catalog-front-service:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/service-pets': '', // Remueve '/service-pets' de la ruta antes de redirigir
    },
});
// endpoint for the catalog microservice
app.use('/service-pets', serviceProxyCatalog);


// Configura un proxy para redirigir las solicitudes a catalog-front-service/service-pets/api/
const serviceProxyCatalogAll  = createProxyMiddleware({
    target: 'http://catalog-front-service:3000/api/',
    changeOrigin: true,
});
app.use('/api', (req, res, next) => {
    // Pasa el cuerpo de la solicitud al proxy
    serviceProxyCatalogAll(req, res, next);
});

// Inicia el servidor en el puerto PORT1
app.listen(PORT1, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT1}`);
});

// ================== API GATEWAY PARA EL SERVICIO DE AUTENTICACION ==================
//Define reverse proxy middleware for each microservice
const serviceProxyUsers = createProxyMiddleware({
    target: 'http://users-frontend-service:3001',
    changeOrigin: true,
  });

app.use('/service-users', serviceProxyUsers);


// ================== API GATEWAY PARA EL SERVICIO DE SCHEDULING ==================

// Define reverse proxy middleware for each microservice
const serviceProxyDates = createProxyMiddleware({
  target: 'http://frontend-dates-service:3001',
  changeOrigin: true,
});

app.use('/service-dates', serviceProxyDates);

// Escuchar en el puerto
app.listen(PORT2, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT2}`);
});


