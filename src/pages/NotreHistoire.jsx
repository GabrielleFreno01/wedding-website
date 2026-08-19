import './NotreHistoire.css';

const TAGS = ['Funfact', 'Avril', 'Septembre', 'Novembre'];

function renderTexte(texte) {
  return texte
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const tag = TAGS.find((t) => line.startsWith(t));
      if (!tag) {
        return <p key={line}>{line}</p>;
      }
      const reste = line.slice(tag.length).replace(/^\s*:\s*/, ' ').trim();
      return (
        <p key={line}>
          <span className="etape-tag">{tag}</span> {reste}
        </p>
      );
    });
}

const ETAPES = [
  {
    annee: '2016',
    titre: 'Notre rencontre',
    texte:
      'Et oui ! C\'est à l\'école de Commerce de Martigny que tout à commencer. \n Funfact : Le jour de l\'officialisation de leur couple, Hugo a mis Gabrielle KO lors d\'une balle au prisonnier avec un ballon en plein tête. ',
  },
  {
    annee: '2024',
    titre: 'Emménagement',
    texte:
      'Début de la vraie vie d\'adulte, à Lausanne dans leur premier appartement.',
  },
  {
    annee: '2025',
    titre: 'Bingo !',
    texte:
      'Avril : Adoption de Cisco, qui condamne Gabrielle et Hugo à avoir les mains qui sentent les croquettes et à retrouver des sacs à caca dans toutes leurs poches mais qui les comble d\'amour. \nSeptembre : Les fiançailles ! Qui, malgré ce que tout le monde pense, étaient complètement inattendues pour ma part. Seuls, perdus au milieu de la Corse, Gabrielle dit oui 💍 \nNovembre : Gabrielle et Hugo réalise un de leur rêve en achetant un VW California, pour aller n\'importe où, n\'importe quand',
  },
  {
    annee: '2027',
    titre: 'Le mariage',
    texte: 'Le moment tant attendu, après plus de 10 ans, de célébrer leur amour avec vous <3 ',
  },
];

function NotreHistoire() {
  return (
    <div className="section container">
      <h1 className="section-title">Notre histoire</h1>
      <p className="section-subtitle">
        Quelques étapes de notre chemin jusqu'ici.
      </p>

      <div className="timeline">
        {ETAPES.map((etape, index) => (
          <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={etape.titre}>
            <div className="timeline-card card">
              <span className="timeline-year">{etape.annee}</span>
              <h3>{etape.titre}</h3>
              <div className="timeline-text">{renderTexte(etape.texte)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotreHistoire;
