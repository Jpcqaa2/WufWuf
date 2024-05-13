const express = require('express');
const axios = require('axios');

const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = 3000;

app.get('/service-catalog', async (req, res) => {
    try {
        const response = await axios.get('http://frontend-catalog-service/service-1');
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener datos del microservicio catalog:', error);
        res.status(500).json({ error: 'Error al obtener datos del microservicio catalog' });
    }
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

// Define reverse proxy middleware for each microservice
const serviceProxyUsers = createProxyMiddleware({
    target: 'http://users-frontend-service:3000',
    changeOrigin: true,
    //pathRewrite: {'^/service-users' : '/'}
    // pathRewrite: {
    //   '^/service-users': '/'
    // }
  });

//   const serviceProxyUsersStatic = createProxyMiddleware({
//     target: 'http://users-frontend-service:3000/_next',
//     changeOrigin: true,
//   });

app.use('/service-users', serviceProxyUsers);
//app.use('/_next', serviceProxyUsersStatic);

// Escuchar en el puerto
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});