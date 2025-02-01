const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:8080'
  };
  
  const outputFile = './swagger-output.json';
  const routes = ['./routes/clientRouter.js', './routes/courseRoutes.js','./routes/quizeRoute.js'];
  
swaggerAutogen(outputFile, routes, doc);