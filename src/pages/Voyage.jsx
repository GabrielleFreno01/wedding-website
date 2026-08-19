import './Voyage.css';

function Voyage() {
  return (
    <div className="section container">
      <h1 className="section-title">Voyage &amp; logistique</h1>
      <p className="section-subtitle">
        Comment rejoindre le Domaine de la Buritaz et où loger sur place.
      </p>

      <div className="voyage-grid">
        <div className="card">
          <h2>🚗 En voiture</h2>
          <p>
            Le Domaine de la Buritaz se trouve à Puidoux, dans le canton de Vaud, à proximité de
            Vevey et Lausanne. Un parking sera à disposition sur place pour les invités.
          </p>
        </div>

        <div className="card">
          <h2>🚆 En train</h2>
          <p>
            Gare la plus proche : Puidoux-Chexbres. Depuis la gare, comptez quelques minutes en
            voiture/taxi jusqu'au domaine. Précisions sur une éventuelle navette à venir.
          </p>
        </div>

        <div className="card">
          <h2>🏨 Hébergement</h2>
          <p>
            Une liste d'hôtels et logements recommandés dans la région de Puidoux / Vevey /
            Lausanne sera ajoutée ici, avec si possible un tarif préférentiel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Voyage;
