
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "promos.db");
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS promos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, tags TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS clicks (promo_id INTEGER PRIMARY KEY, count INTEGER)");
});

app.post("/api/promos", (req, res) => {
  const { title, url, tags } = req.body;
  db.run("INSERT INTO promos (title, url, tags) VALUES (?, ?, ?)", [title, url, JSON.stringify(tags)], function(err) {
    if (err) return res.status(500).json({ error: "Insert failed" });
    res.json({ id: this.lastID, title, url, tags });
  });
});

app.get("/api/promos", (req, res) => {
  db.all("SELECT * FROM promos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Read failed" });
    const promos = rows.map(p => ({ ...p, tags: JSON.parse(p.tags || "[]") }));
    res.json(promos);
  });
});

app.post("/api/click", (req, res) => {
  const { id } = req.body;
  db.run("INSERT INTO clicks (promo_id, count) VALUES (?, 1) ON CONFLICT(promo_id) DO UPDATE SET count = count + 1", [id], err => {
    if (err) return res.status(500).json({ error: "Click error" });
    res.json({ success: true });
  });
});

app.get("/api/feed", (req, res) => {
  db.all("SELECT * FROM promos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Feed error" });
    const promos = rows.map(p => ({ ...p, tags: JSON.parse(p.tags || "[]") }));
    res.json(promos);
  });
});

app.listen(PORT, () => console.log(`Backend up on ${PORT}`));
