// server.js
import express           from 'express';
import bodyParser        from 'body-parser';
import mysql             from 'mysql2/promise';
import path              from 'path';
import { fileURLToPath } from 'url';

// ES-module __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
// Pool will read the DATABASE_URL env var (set by Railway)
const pool = mysql.createPool(process.env.DATABASE_URL);

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const { email, notify, marketing } = req.body;
  const shouldNotify = notify ? 1 : 0;
  const opt_in       = marketing ? 1 : 0;

  try {
    await pool.execute(
      `INSERT INTO entries (email, notify, opt_in)
       VALUES (?, ?, ?)`,
      [email, shouldNotify, opt_in]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
