import './LeJourJ.css';

const PROGRAMME = [
  { heure: '14h00', titre: 'Cérémonie', texte: 'Cérémonie laïque au Domaine de la Buritaz' },
  { heure: '15h30', titre: 'Vin d\'honneur', texte: 'Cocktail et félicitations dans les jardins' },
  { heure: '19h00', titre: 'Dîner', texte: 'Dîner assis suivi des discours' },
  { heure: '22h00', titre: 'Soirée dansante', texte: 'DJ, piste de danse et fête jusqu\'au bout de la nuit' },
];

function LeJourJ() {
  return (
    <div className="section container">
      <h1 className="section-title">Le jour J</h1>
      <p className="section-subtitle">
        Toutes les informations pratiques pour notre grand jour.
      </p>

      <div className="programme">
        {PROGRAMME.map((etape) => (
          <div className="programme-item card" key={etape.heure}>
            <span className="programme-heure">{etape.heure}</span>
            <div>
              <h3>{etape.titre}</h3>
              <p>{etape.texte}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="lieu card">
        <h2>Le lieu</h2>
        <div className="map-wrapper">
          <iframe
            title="Domaine de la Buritaz"
            src="https://www.google.com/maps?q=Domaine+de+la+Buritaz,+Chemin+de+la+Buritaz+1,+1070+Puidoux,+Suisse&output=embed"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="dresscode card">
        <h2>Tenue</h2>
        <div className="dresscode-item start">
          <span className="dresscode-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9.5 18L20 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p>
              Tenue habillée — robes longues, costumes légers, couleurs vives et motifs floraux, sentez-vous beau ! Pour celles et ceux qui le veulent, voici la palette de couleurs
            </p>
            <div className="palette-swatches">
              <span className="palette-swatch" title="Orange vif" style={{ background: 'var(--color-primary)' }} />
              <span className="palette-swatch" title="Jaune moutarde" style={{ background: 'var(--color-secondary)' }} />
              <span className="palette-swatch" title="Rose poudré" style={{ background: 'var(--color-accent)' }} />
              <span className="palette-swatch" title="Vert olive" style={{ background: 'var(--color-accent-2)' }} />
            </div>
          </div>
        </div>
        <div className="dresscode-item">
          <span className="dresscode-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9.5 18L20 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p>
            Le blanc et toutes ces déclinaisons sont réservées à la mariée !
          </p>
        </div>
      </div>
    </div>
  );
}

export default LeJourJ;
