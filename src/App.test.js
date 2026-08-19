import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche les noms des mariés sur la page d\'accueil', () => {
  render(<App />);
  const title = screen.getByRole('heading', { level: 1, name: /Gabrielle & Hugo/i });
  expect(title).toBeInTheDocument();
});
