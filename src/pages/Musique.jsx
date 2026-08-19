import { useCallback, useEffect, useRef, useState } from 'react';
import './Musique.css';

function getVoterId() {
  const cle = 'musique-voter-id';
  let voterId = localStorage.getItem(cle);
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem(cle, voterId);
  }
  return voterId;
}

function Musique() {
  const [form, setForm] = useState({ nom: '', chanson: '', pochette: '' });
  const voterId = useRef(getVoterId()).current;
  const [envoye, setEnvoye] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState('');

  const [query, setQuery] = useState('');
  const [resultats, setResultats] = useState([]);
  const [recherche, setRecherche] = useState(false);
  const [erreur, setErreur] = useState('');
  const timeoutRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);

  const chargerSuggestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/musique?voter=${encodeURIComponent(voterId)}`);
      if (!response.ok) throw new Error('liste indisponible');
      const data = await response.json();
      setSuggestions(data.rows || []);
    } catch {
      // silencieux : la liste est secondaire par rapport au formulaire
    }
  }, [voterId]);

  const handleVote = async (songId) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === songId ? { ...s, votes: s.votes + (s.aVote ? -1 : 1), aVote: !s.aVote } : s
      )
    );

    try {
      const response = await fetch(`/api/musique/${songId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voter: voterId }),
      });
      if (!response.ok) throw new Error('vote impossible');
      const data = await response.json();
      setSuggestions((prev) =>
        prev
          .map((s) => (s.id === songId ? { ...s, votes: data.votes, aVote: data.aVote } : s))
          .sort((a, b) => b.votes - a.votes || new Date(a.created_at) - new Date(b.created_at))
      );
    } catch {
      chargerSuggestions();
    }
  };

  useEffect(() => {
    chargerSuggestions();
  }, [chargerSuggestions]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResultats([]);
      setErreur('');
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setRecherche(true);
      setErreur('');
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('spotify indisponible');
        const data = await response.json();
        setResultats(data.tracks || []);
      } catch {
        setErreur(
          'Recherche Spotify indisponible pour le moment. Vous pouvez saisir le titre et l\'artiste manuellement ci-dessous.'
        );
        setResultats([]);
      } finally {
        setRecherche(false);
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const choisirMorceau = (track) => {
    setForm((prev) => ({
      ...prev,
      chanson: `${track.titre} - ${track.artiste}`,
      pochette: track.pochette || '',
    }));
    setQuery('');
    setResultats([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nom.trim()) {
      setErreurEnvoi('Merci d\'indiquer votre prénom.');
      return;
    }

    if (!form.chanson?.trim()) {
      setErreurEnvoi('Merci de choisir une chanson dans les résultats Spotify.');
      return;
    }

    setErreurEnvoi('');
    setEnvoiEnCours(true);

    try {
      const response = await fetch('/api/musique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Impossible d'enregistrer votre suggestion pour le moment. Merci de réessayer dans quelques instants.");
      }

      setEnvoye(true);
      setForm({ nom: '', chanson: '', pochette: '' });
      chargerSuggestions();
    } catch (error) {
      setErreurEnvoi(error.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="section container">
      <h1 className="section-title">Musique</h1>
      <p className="section-subtitle">
        Aidez-nous à composer la playlist de la soirée
      </p>

      <form className="musique-form card" onSubmit={handleSubmit}>
        <label>
          Votre prénom *
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </label>

        <div className="musique-search">
          <label htmlFor="spotify-search">Chercher sur Spotify *</label>
          <input
            id="spotify-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            required={!form.chanson}
          />

          {recherche && <p className="musique-status">Recherche en cours…</p>}
          {erreur && <p className="musique-status musique-status-erreur">{erreur}</p>}

          {form.chanson && (
            <p className="musique-selection">
              {form.pochette && <img src={form.pochette} alt="" />}
              Sélection : <strong>{form.chanson}</strong>
            </p>
          )}

          {resultats.length > 0 && (
            <ul className="musique-resultats">
              {resultats.map((track) => (
                <li key={track.id}>
                  <button type="button" onClick={() => choisirMorceau(track)}>
                    {track.pochette && <img src={track.pochette} alt="" />}
                    <span>
                      <strong>{track.titre}</strong>
                      <br />
                      {track.artiste}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {erreurEnvoi && <p className="musique-status musique-status-erreur">{erreurEnvoi}</p>}

        <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
          {envoiEnCours ? 'Envoi...' : 'Envoyer ma suggestion'}
        </button>

        {envoye && <p className="musique-confirmation">Merci pour votre suggestion 🎶 !</p>}
      </form>

      {suggestions.length > 0 && (
        <div className="musique-suggestions card">
          <h2>Classement des suggestions</h2>
          <ul className="musique-suggestions-liste">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id}>
                <span className="musique-suggestion-rang">{index + 1}</span>
                {suggestion.pochette && <img src={suggestion.pochette} alt="" />}
                <span className="musique-suggestion-info">
                  <span className="musique-suggestion-chanson">{suggestion.chanson}</span>
                  {suggestion.nom && (
                    <span className="musique-suggestion-nom">par {suggestion.nom}</span>
                  )}
                </span>
                <button
                  type="button"
                  className={`musique-vote-btn ${suggestion.aVote ? 'musique-vote-btn-active' : ''}`}
                  onClick={() => handleVote(suggestion.id)}
                  aria-pressed={suggestion.aVote}
                >
                  ❤ {suggestion.votes}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Musique;
