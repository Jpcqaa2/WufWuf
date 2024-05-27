const express = require('express');
const axios = require('axios');

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
const serviceProxyCatalogPets  = createProxyMiddleware({
    target: 'http://catalog-front-service:3000/service-pets/api/',
    changeOrigin: true,
});
app.use('/api', (req, res, next) => {
    // Pasa el cuerpo de la solicitud al proxy
    serviceProxyCatalogPets(req, res, next);
});


// Configura un proxy para redirigir las solicitudes a catalog-front-service/service-pets/api/:id
const serviceProxyCatalogPetId = createProxyMiddleware({
    target: 'http://catalog-front-service:3000/service-pets/api/',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        // Obtenemos el id del parámetro de la ruta
        const id = req.params.id;
        // Concatenamos el id a la ruta
        return `${path}/${id}`;
    }
});
// Usa el proxy para todas las solicitudes a /api/:id
app.use('/api/:id', (req, res, next) => {
    serviceProxyCatalogPetId(req, res, next);
});


// Configura un proxy para redirigir las solicitudes a catalog-front-service/service-pets/api/list_all_pets/
const serviceProxyCatalogPetsAll  = createProxyMiddleware({
    target: 'http://catalog-front-service:3000/service-pets/api/list_all_pets/',
    changeOrigin: true,
});
app.use('/service-pets/api/list_all_pets/', (req, res, next) => {
    // Pasa el cuerpo de la solicitud al proxy
    serviceProxyCatalogPetsAll(req, res, next);
});


// Configura un proxy para redirigir las solicitudes a catalog-front-service/service-pets/api/create_pet/
const serviceProxyCatalogPetsCreate = createProxyMiddleware({
    target: 'http://catalog-front-service:3000/service-pets/api/create_pet/',
    changeOrigin: true,
});
app.use('/api/create_pet/', (req, res, next) => {
    // Pasa el cuerpo de la solicitud al proxy
    serviceProxyCatalogPetsCreate(req, res, next);
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

// Escuchar en el puerto
app.listen(PORT2, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT2}`);
});

app.get('/service-scheduling', async (req, res) => {
    try {
        const response = await axios.get('http://frontend-dates-service');
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener datos del microservicio scheduling:', error);
        res.status(500).json({ error: 'Error al obtener datos del microservicio scheduling' });
    }
});

app.get('/test2', async (req, res) => {
    try {
        const response = await axios.get('http://users-frontend-service:3000');
        res.send(response.data);
    } catch (error) {
        console.error('Error al obtener datos del microservicio scheduling:', error);
        res.status(500).json({ error: 'Error al obtener datos del microservicio scheduling' });
    }
});

