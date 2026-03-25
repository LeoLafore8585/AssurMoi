const express = require('express');
const routes = require('./routes');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API AssurMoi OK');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base de données avec Sequelize');
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur connexion BDD :', error.message);
  });