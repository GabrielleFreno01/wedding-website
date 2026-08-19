const express = require('express');
const db = require('../db');

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.status(401).json({ error: 'Non authentifié.' });
}

router.post('/login', (req, res) => {
  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configuré côté serveur.' });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }

  res.status(401).json({ error: 'Mot de passe incorrect.' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  res.json({ isAdmin: !!req.session?.isAdmin });
});

router.get('/rsvp', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM rsvp ORDER BY created_at DESC').all();
  res.json({ rows });
});

router.get('/guests', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT g.id, g.prenom, g.nom, g.nombre_autorise, g.created_at,
              r.presence, r.nombre AS nombre_confirme, r.created_at AS repondu_le
       FROM guests g
       LEFT JOIN rsvp r ON r.guest_id = g.id
       ORDER BY g.nom, g.prenom`
    )
    .all();
  res.json({ rows });
});

router.post('/guests', requireAuth, (req, res) => {
  const { prenom, nom, nombre_autorise } = req.body || {};

  if (!prenom?.trim() || !nom?.trim()) {
    return res.status(400).json({ error: 'Prénom et nom sont requis.' });
  }

  const stmt = db.prepare('INSERT INTO guests (prenom, nom, nombre_autorise) VALUES (?, ?, ?)');
  const info = stmt.run(
    prenom.trim(),
    nom.trim(),
    Number(nombre_autorise) > 0 ? Number(nombre_autorise) : 1
  );

  res.status(201).json({ id: info.lastInsertRowid });
});

router.post('/guests/bulk', requireAuth, (req, res) => {
  const { texte } = req.body || {};

  if (!texte?.trim()) {
    return res.status(400).json({ error: 'Liste vide.' });
  }

  const lignes = texte
    .split('\n')
    .map((ligne) => ligne.trim())
    .filter(Boolean);

  const stmt = db.prepare('INSERT INTO guests (prenom, nom, nombre_autorise) VALUES (?, ?, ?)');
  let ajoutes = 0;

  const insertMany = db.transaction((rows) => {
    for (const ligne of rows) {
      const [prenom, nom, nombre] = ligne.split(',').map((part) => (part || '').trim());
      if (!prenom || !nom) continue;
      stmt.run(prenom, nom, Number(nombre) > 0 ? Number(nombre) : 1);
      ajoutes += 1;
    }
  });

  insertMany(lignes);

  res.status(201).json({ ajoutes });
});

router.delete('/guests/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.get('/musique', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM song_requests ORDER BY created_at DESC').all();
  res.json({ rows });
});

router.delete('/musique/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM song_requests WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) =>
    columns.map((col) => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  return [header, ...lines].join('\n');
}

router.get('/export/rsvp.csv', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM rsvp ORDER BY created_at DESC').all();
  const csv = toCsv(rows, ['id', 'prenom', 'nom', 'email', 'presence', 'nombre', 'regime', 'message', 'created_at']);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rsvp.csv"');
  res.send(csv);
});

router.get('/export/musique.csv', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM song_requests ORDER BY created_at DESC').all();
  const csv = toCsv(rows, ['id', 'nom', 'chanson', 'created_at']);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="musique.csv"');
  res.send(csv);
});

module.exports = router;
