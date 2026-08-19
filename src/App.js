import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import NotreHistoire from './pages/NotreHistoire';
import LeJourJ from './pages/LeJourJ';
import Voyage from './pages/Voyage';
import Musique from './pages/Musique';
import FAQ from './pages/FAQ';
import RSVP from './pages/RSVP';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="page">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/notre-histoire" element={<NotreHistoire />} />
            <Route path="/le-jour-j" element={<LeJourJ />} />
            <Route path="/voyage" element={<Voyage />} />
            <Route path="/musique" element={<Musique />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/rsvp" element={<RSVP />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
