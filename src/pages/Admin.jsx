import { useEffect, useState } from 'react';
import './Admin.css';

function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErreur('');
    setEnvoiEnCours(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Connexion impossible');
      }

      onLoggedIn();
    } catch (error) {
      setErreur(error.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="section container admin-login">
      <h1 className="section-title">Administration</h1>
      <form className="admin-login-form card" onSubmit={handleSubmit}>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
        </label>
        {erreur && <p className="admin-erreur">{erreur}</p>}
        <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
          {envoiEnCours ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

function GuestsSection({ guests, onChange }) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [nombreAutorise, setNombreAutorise] = useState(1);
  const [bulkTexte, setBulkTexte] = useState('');
  const [erreur, setErreur] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const handleAdd = async (event) => {
    event.preventDefault();
    setErreur('');

    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, nombre_autorise: nombreAutorise }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Impossible d'ajouter l'invité.");
      }

      setPrenom('');
      setNom('');
      setNombreAutorise(1);
      onChange();
    } catch (error) {
      setErreur(error.message);
    }
  };

  const handleBulkAdd = async (event) => {
    event.preventDefault();
    setErreur('');

    try {
      const response = await fetch('/api/admin/guests/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texte: bulkTexte }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Impossible d'ajouter la liste.");
      }

      setBulkTexte('');
      onChange();
    } catch (error) {
      setErreur(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }

    setConfirmingId(null);
    await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' });
    onChange();
  };

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <h2>Liste des invités ({guests.length})</h2>
      </div>

      {erreur && <p className="admin-erreur">{erreur}</p>}

      <div className="admin-guests-forms">
        <form className="admin-guest-form card" onSubmit={handleAdd}>
          <h3>Ajouter un invité</h3>
          <label>
            Prénom
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </label>
          <label>
            Nom
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </label>
          <label>
            Nombre de personnes autorisées
            <input
              type="number"
              min="1"
              value={nombreAutorise}
              onChange={(e) => setNombreAutorise(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </form>

        <form className="admin-guest-form card" onSubmit={handleBulkAdd}>
          <h3>Ajout groupé</h3>
          <label>
            Une ligne par invité : Prénom, Nom, Nombre autorisé
            <textarea
              rows={6}
              value={bulkTexte}
              onChange={(e) => setBulkTexte(e.target.value)}
              placeholder={'Camille, Martin, 2\nLucas, Dupuis, 1'}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Ajouter la liste
          </button>
        </form>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Autorisé</th>
              <th>Statut</th>
              <th>Confirmé</th>
              <th>Répondu le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.prenom}</td>
                <td>{guest.nom}</td>
                <td>{guest.nombre_autorise}</td>
                <td>
                  {guest.presence === 'oui'
                    ? 'Vient'
                    : guest.presence === 'non'
                      ? 'Ne vient pas'
                      : 'En attente'}
                </td>
                <td>{guest.nombre_confirme ?? ''}</td>
                <td>{guest.repondu_le ?? ''}</td>
                <td>
                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() => handleDelete(guest.id)}
                  >
                    {confirmingId === guest.id ? 'Confirmer' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminDashboard({ onLoggedOut }) {
  const [rsvps, setRsvps] = useState([]);
  const [chansons, setChansons] = useState([]);
  const [guests, setGuests] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [confirmingChansonId, setConfirmingChansonId] = useState(null);

  const charger = async () => {
    try {
      const [rsvpRes, musiqueRes, guestsRes] = await Promise.all([
        fetch('/api/admin/rsvp'),
        fetch('/api/admin/musique'),
        fetch('/api/admin/guests'),
      ]);

      if (!rsvpRes.ok || !musiqueRes.ok || !guestsRes.ok) {
        throw new Error();
      }

      const rsvpData = await rsvpRes.json();
      const musiqueData = await musiqueRes.json();
      const guestsData = await guestsRes.json();
      setRsvps(rsvpData.rows || []);
      setChansons(musiqueData.rows || []);
      setGuests(guestsData.rows || []);
    } catch {
      setErreur('Impossible de charger les données.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    onLoggedOut();
  };

  const handleDeleteChanson = async (id) => {
    if (confirmingChansonId !== id) {
      setConfirmingChansonId(id);
      return;
    }

    setConfirmingChansonId(null);
    await fetch(`/api/admin/musique/${id}`, { method: 'DELETE' });
    charger();
  };

  const totalPersonnes = rsvps
    .filter((r) => r.presence === 'oui')
    .reduce((sum, r) => sum + (r.nombre || 0), 0);

  return (
    <div className="section container admin-dashboard">
      <div className="admin-header">
        <h1 className="section-title">Administration</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>

      {chargement && <p>Chargement...</p>}
      {erreur && <p className="admin-erreur">{erreur}</p>}

      {!chargement && !erreur && (
        <>
          <GuestsSection guests={guests} onChange={charger} />

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>
                RSVP ({rsvps.length} réponse{rsvps.length > 1 ? 's' : ''}, {totalPersonnes}{' '}
                personne{totalPersonnes > 1 ? 's' : ''} confirmée{totalPersonnes > 1 ? 's' : ''})
              </h2>
              <a className="btn btn-secondary" href="/api/admin/export/rsvp.csv">
                Exporter en CSV
              </a>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Présence</th>
                    <th>Nombre</th>
                    <th>Régime</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((row) => (
                    <tr key={row.id}>
                      <td>{row.prenom}</td>
                      <td>{row.nom}</td>
                      <td>{row.email}</td>
                      <td>{row.presence === 'oui' ? 'Oui' : 'Non'}</td>
                      <td>{row.nombre}</td>
                      <td>{row.regime}</td>
                      <td>{row.message}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>
                Musique ({chansons.length} suggestion{chansons.length > 1 ? 's' : ''})
              </h2>
              <a className="btn btn-secondary" href="/api/admin/export/musique.csv">
                Exporter en CSV
              </a>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Prénom</th>
                    <th>Titre &amp; artiste</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {chansons.map((row) => (
                    <tr key={row.id}>
                      <td>{row.nom}</td>
                      <td>{row.chanson}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDeleteChanson(row.id)}
                        >
                          {confirmingChansonId === row.id ? 'Confirmer' : 'Supprimer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [verification, setVerification] = useState(true);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setVerification(false));
  }, []);

  if (verification) {
    return (
      <div className="section container">
        <p>Chargement...</p>
      </div>
    );
  }

  return isAdmin ? (
    <AdminDashboard onLoggedOut={() => setIsAdmin(false)} />
  ) : (
    <AdminLogin onLoggedIn={() => setIsAdmin(true)} />
  );
}

export default Admin;
