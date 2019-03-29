require('dotenv-safe').config({
  path: '.env'
});

const server = require('./server');

const app = server.getServer().listen(process.env.PORT || 3000, () => {
  const { address, port } = app.address();
  console.log(`Listening at http://${address}:${port}`);
});
