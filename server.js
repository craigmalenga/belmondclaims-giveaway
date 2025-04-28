import express       from 'express';
import bodyParser    from 'body-parser';
import mysql         from 'mysql2/promise';
import path          from 'path';
import 'dotenv/config';  // only if you want to load a local .env

const app = express();
const pool = mysql.createPool(process.env.DATABASE_URL);

// serve static front-end
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
