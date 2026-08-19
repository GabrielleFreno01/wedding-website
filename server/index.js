require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const rsvpRouter = require('./routes/rsvp');
const musiqueRouter = require('./routes/musique');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5057;
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// Railway (et la plupart des hebergeurs) terminent le HTTPS sur un proxy en amont ;
// sans ceci, Express ne voit que du HTTP et le cookie "secure" ne serait jamais envoye.
app.set('trust proxy', 1);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use('/api/rsvp', rsvpRouter);
app.use('/api/musique', musiqueRouter);
app.use('/api/admin', adminRouter);

let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Identifiants Spotify manquants (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET).');
  }

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Echec de l'authentification Spotify (${response.status})`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

app.get('/api/spotify/search', async (req, res) => {
  const query = (req.query.q || '').toString().trim();

  if (!query) {
    return res.json({ tracks: [] });
  }

  try {
    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(query)}`;
    const spotifyResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!spotifyResponse.ok) {
      throw new Error(`Recherche Spotify echouee (${spotifyResponse.status})`);
    }

    const data = await spotifyResponse.json();
    const tracks = (data.tracks?.items || []).map((track) => ({
      id: track.id,
      titre: track.name,
      artiste: track.artists.map((artist) => artist.name).join(', '),
      album: track.album?.name || '',
      pochette: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || null,
      url: track.external_urls?.spotify || null,
    }));

    res.json({ tracks });
  } catch (error) {
    console.error('[spotify]', error.message);
    res.status(502).json({ error: 'Recherche Spotify indisponible pour le moment.' });
  }
});

// Sert le build de production (utile pour un hebergement auto-heberge, ex. Raspberry Pi)
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur pret sur http://localhost:${PORT}`);
});
