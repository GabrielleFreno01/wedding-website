import { useState } from 'react';
import './RSVP.css';

const INITIAL_FORM = {
  prenom: '',
  nom: '',
  presence: 'oui',
  nombre: 1,
  regime: '',
  message: '',
};

function RSVP() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [envoye, setEnvoye] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErreur('');
    setEnvoiEnCours(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue, merci de réessayer.');
      }

      setEnvoye(true);
    } catch (error) {
      setErreur(
        error.message ||
          "Impossible d'enregistrer votre réponse pour le moment. Merci de réessayer dans quelques instants."
      );
    } finally {
      setEnvoiEnCours(false);
    }
  };

  if (envoye) {
    return (
      <div className="section container rsvp-merci">
        <h1 className="section-title">Merci {form.prenom || ''} !</h1>
        <p className="section-subtitle">
          Votre réponse a bien été enregistrée. Nous avons hâte de célébrer ce jour avec vous !
        </p>
      </div>
    );
  }

  return (
    <div className="section container">
      <h1 className="section-title">RSVP</h1>
      <p className="section-subtitle">
        Merci de nous confirmer votre présence avant le [date à définir].
      </p>

      <form className="rsvp-form card" onSubmit={handleSubmit}>
        <label>
          Prénom
          <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required />
        </label>

        <label>
          Nom
          <input type="text" name="nom" value={form.nom} onChange={handleChange} required />
        </label>

        <label>
          Serez-vous présent(e) ?
          <select name="presence" value={form.presence} onChange={handleChange}>
            <option value="oui">Oui, avec plaisir</option>
            <option value="non">Non, je ne pourrai pas venir</option>
          </select>
        </label>

        <label>
          Nombre de personnes (vous inclus·e)
          <input
            type="number"
            name="nombre"
            min="1"
            max="3"
            value={form.nombre}
            onChange={handleChange}
          />
        </label>

        <label>
          Régime alimentaire particulier
          <input
            type="text"
            name="regime"
            value={form.regime}
            onChange={handleChange}
            placeholder="Végétarien, allergies, etc."
          />
        </label>

        <label>
          Un petit mot pour les mariés
          <textarea name="message" value={form.message} onChange={handleChange} rows={4} />
        </label>

        {erreur && <p className="rsvp-erreur">{erreur}</p>}

        <button type="submit" className="btn btn-primary" disabled={envoiEnCours}>
          {envoiEnCours ? 'Envoi...' : 'Envoyer ma réponse'}
        </button>
      </form>
    </div>
  );
}

export default RSVP;
