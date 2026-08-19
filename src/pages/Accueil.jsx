import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import './Accueil.css';

function Accueil() {
  return (
    <div>
      <div className="accueil-stripes">
        <div className="accueil-frame" />
        <div className="accueil-photo-frame">
          <img
            src="/images/couple.jpg"
            alt="Gabrielle et Hugo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="accueil-badge">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="accueil-badge-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text className="accueil-badge-text">
              <textPath href="#accueil-badge-path">
                &nbsp;· GABRIELLE &amp; HUGO · 04.09.2027
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="container accueil-content">
        <p className="accueil-kicker">On se marie !</p>
        <h1 className="accueil-title">Gabrielle &amp; Hugo</h1>
        <p className="accueil-date">04 septembre 2027</p>
        <p className="accueil-venue">Domaine de la Buritaz — Puidoux, Suisse</p>

        <Countdown />

        <div className="accueil-actions">
          <Link to="/rsvp" className="btn btn-primary">
            Confirmer ma présence
          </Link>
          <Link to="/le-jour-j" className="btn btn-secondary">
            Voir le programme
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
