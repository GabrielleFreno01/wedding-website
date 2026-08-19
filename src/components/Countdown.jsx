import { useEffect, useState } from 'react';
import './Countdown.css';

const WEDDING_DATE = new Date('2027-09-04T14:00:00');

function getRemaining() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'jours', value: remaining.days },
    { label: 'heures', value: remaining.hours },
    { label: 'minutes', value: remaining.minutes },
    { label: 'secondes', value: remaining.seconds },
  ];

  return (
    <div className="countdown">
      {units.map((unit) => (
        <div className="countdown-unit" key={unit.label}>
          <span className="countdown-value">{unit.value}</span>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Countdown;
