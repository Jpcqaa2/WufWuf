const express = require('express');
const axios = require('axios');

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

app.get('/service-user-management', async (req, res) => {
    try {
        const response = await axios.get('http://frontend-user-management-service/service-3');
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener datos del microservicio user management:', error);
        res.status(500).json({ error: 'Error al obtener datos del microservicio user management' });
    }
});

// Escuchar en el puerto
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});