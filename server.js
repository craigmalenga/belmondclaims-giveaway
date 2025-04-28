// server.js
import express    from 'express';
import bodyParser from 'body-parser';
import mysql      from 'mysql2/promise';
import path       from 'path';
import { fileURLToPath } from 'url';

// ES-module __dirname shim:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const pool = mysql.createPool(process.env.DATABASE_URL);

// Serve your static files (index.html, logo.png, etc)
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const { email, notify } = req.body;
  try {
    await pool.execute(
      'INSERT INTO entries (email, notify) VALUES (?, ?)',
      [email, notify ? 1 : 0]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
