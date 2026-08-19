import { useState } from 'react';
import './FAQ.css';

const QUESTIONS = [
  {
    question: 'Quelle tenue porter ?',
    reponse: 'Tenue habillée — robes longues, costumes légers, couleurs vives et motifs floraux, mais surtout sentez-vous beau !',
  },
  {
    question: 'Puis-je venir accompagné·e ?',
    reponse: 'Les accompagnant·es sont nommé·es sur votre faire-part. En cas de doute, écrivez-nous.',
  },
  {
    question: 'Les enfants sont-ils les bienvenus ?',
    reponse: 'Nous adorons vos petits, mais avons choisi de réserver la fête aux adultes après la cérémonie, pour que tout le monde puisse profiter pleinement.',
  },
  {
    question: 'Où se loger ?',
    reponse: 'Voir la page « Voyage » pour les suggestions d\'hébergement autour de Puidoux.',
  },
  {
    question: 'Les cadeaux ?',
    reponse:
      'Votre présence est notre plus beau cadeau. Si vous souhaitez tout de même contribuer, une cagnotte lune de miel sera disponible le jour J.',
  },
  {
    question: 'Y a-t-il un parking sur place ?',
    reponse: 'Oui, un parking sera à disposition au Domaine de la Buritaz.',
  },
  {
    question: 'Y aura-t-il des options végétariennes / véganes ?',
    reponse: 'Oui — merci d\'indiquer vos régimes alimentaires sur le formulaire RSVP.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="section container">
      <h1 className="section-title">Questions fréquentes</h1>
      <p className="section-subtitle">
        Vous avez une question ? Voici quelques réponses, mais n'hésitez pas à nous contacter !
      </p>

      <div className="faq-list">
        {QUESTIONS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`faq-item card ${isOpen ? 'open' : ''}`} key={item.question}>
              <button className="faq-question" onClick={() => toggle(index)}>
                {item.question}
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="faq-reponse">{item.reponse}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;
