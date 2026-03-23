const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: 'db',
  user: 'leo',
  password: 'leo123',
  database: 'api_annonces'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur connexion MySQL :', err.message);
    return;
  }
  console.log('Connecté à MySQL');
});

app.get('/', (req, res) => {
  res.send('API OK');
});

app.get('/db-test', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Connexion MySQL OK',
      result: results[0].result
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});