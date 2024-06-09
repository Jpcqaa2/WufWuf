const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const PORT = 3000;

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

// Define reverse proxy middleware for each microservice
const serviceProxyDates = createProxyMiddleware({
  target: 'http://frontend-dates-service:3000',
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

// Define reverse proxy middleware for each microservice
const serviceProxyCatalog = createProxyMiddleware({
  target: 'http://catalog-front-service:3000',
  changeOrigin: true,
  //pathRewrite: {'^/service-users' : '/'}
  // pathRewrite: {
  //   '^/service-users': '/'
  // }
});

app.use('/service-users', serviceProxyUsers);
//app.use('/_next', serviceProxyUsersStatic);

app.use('/service-dates', serviceProxyDates);
//app.use('/_next', serviceProxyUsersStatic);

app.use('/service-pets', serviceProxyCatalog);
//app.use('/_next', serviceProxyUsersStatic);

// Escuchar en el puerto
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});