const express = require('express');
const db = require('../db');
const { normalizeName } = require('../lib/normalize');

const router = express.Router();

function findGuest(prenom, nom) {
  const np = normalizeName(prenom);
  const nn = normalizeName(nom);
  return db
    .prepare('SELECT * FROM guests')
    .all()
    .find((g) => normalizeName(g.prenom) === np && normalizeName(g.nom) === nn);
}

router.post('/', (req, res) => {
  const { prenom, nom, presence, nombre, regime, message } = req.body || {};

  if (!prenom?.trim() || !nom?.trim() || !presence) {
    return res.status(400).json({ error: 'Prénom, nom et présence sont requis.' });
  }

  if (presence !== 'oui' && presence !== 'non') {
    return res.status(400).json({ error: 'Valeur de présence invalide.' });
  }

  const guest = findGuest(prenom, nom);

  if (!guest) {
    return res.status(404).json({
      error:
        "Nous ne trouvons pas ce nom sur notre liste d'invités. Vérifiez l'orthographe ou contactez-nous directement.",
    });
  }

  const nombreDemande = Number(nombre) > 0 ? Number(nombre) : 1;

  if (nombreDemande < 1 || nombreDemande > 3) {
    return res.status(400).json({ error: 'Le nombre de personnes doit être compris entre 1 et 3.' });
  }

  if (presence === 'oui' && nombreDemande > guest.nombre_autorise) {
    return res.status(400).json({
      error: `Votre invitation est prévue pour ${guest.nombre_autorise} personne(s) maximum. Contactez-nous directement si besoin.`,
    });
  }

  const trimmedPrenom = prenom.trim();
  const trimmedNom = nom.trim();
  const trimmedRegime = (regime || '').trim();
  const trimmedMessage = (message || '').trim();

  const existing = db.prepare('SELECT id FROM rsvp WHERE guest_id = ?').get(guest.id);

  if (existing) {
    db.prepare(
      `UPDATE rsvp
       SET prenom = ?, nom = ?, presence = ?, nombre = ?, regime = ?, message = ?, created_at = datetime('now')
       WHERE id = ?`
    ).run(trimmedPrenom, trimmedNom, presence, nombreDemande, trimmedRegime, trimmedMessage, existing.id);
  } else {
    db.prepare(
      `INSERT INTO rsvp (guest_id, prenom, nom, email, presence, nombre, regime, message)
       VALUES (?, ?, ?, '', ?, ?, ?, ?)`
    ).run(guest.id, trimmedPrenom, trimmedNom, presence, nombreDemande, trimmedRegime, trimmedMessage);
  }

  res.status(201).json({ ok: true });
});

module.exports = router;
