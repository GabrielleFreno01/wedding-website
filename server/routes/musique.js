const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const voter = typeof req.query.voter === 'string' ? req.query.voter.trim() : '';

  const rows = db
    .prepare(
      `SELECT sr.id, sr.nom, sr.chanson, sr.pochette, sr.created_at,
              COUNT(sv.id) AS votes,
              MAX(CASE WHEN sv.voter_id = ? THEN 1 ELSE 0 END) AS aVoteRaw
       FROM song_requests sr
       LEFT JOIN song_votes sv ON sv.song_id = sr.id
       GROUP BY sr.id
       ORDER BY votes DESC, sr.created_at ASC`
    )
    .all(voter || null);

  res.json({
    rows: rows.map(({ aVoteRaw, ...row }) => ({ ...row, aVote: !!aVoteRaw })),
  });
});

router.post('/', (req, res) => {
  const { nom, chanson, pochette } = req.body || {};

  if (!nom?.trim()) {
    return res.status(400).json({ error: 'Votre prénom est requis.' });
  }

  if (!chanson?.trim()) {
    return res.status(400).json({ error: 'Le titre de la chanson est requis.' });
  }

  const existante = db
    .prepare('SELECT nom FROM song_requests WHERE LOWER(chanson) = LOWER(?)')
    .get(chanson.trim());

  if (existante) {
    return res.status(409).json({
      error: existante.nom
        ? `Oups ! Cette chanson a déjà été suggérée par ${existante.nom}.`
        : 'Oups ! Cette chanson a déjà été suggérée.',
    });
  }

  const stmt = db.prepare(
    'INSERT INTO song_requests (nom, chanson, pochette) VALUES (?, ?, ?)'
  );
  stmt.run(nom.trim(), chanson.trim(), pochette || null);

  res.status(201).json({ ok: true });
});

router.post('/:id/vote', (req, res) => {
  const songId = Number(req.params.id);
  const voter = (req.body?.voter || '').toString().trim();

  if (!voter) {
    return res.status(400).json({ error: 'Identifiant de vote manquant.' });
  }

  const song = db.prepare('SELECT id FROM song_requests WHERE id = ?').get(songId);
  if (!song) {
    return res.status(404).json({ error: 'Chanson introuvable.' });
  }

  const existant = db
    .prepare('SELECT id FROM song_votes WHERE song_id = ? AND voter_id = ?')
    .get(songId, voter);

  if (existant) {
    db.prepare('DELETE FROM song_votes WHERE id = ?').run(existant.id);
  } else {
    db.prepare('INSERT INTO song_votes (song_id, voter_id) VALUES (?, ?)').run(songId, voter);
  }

  const { votes } = db
    .prepare('SELECT COUNT(*) AS votes FROM song_votes WHERE song_id = ?')
    .get(songId);

  res.json({ ok: true, votes, aVote: !existant });
});

module.exports = router;
