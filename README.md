# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Déploiement sur Railway

Cette application est un seul process Node (`server/index.js`) qui sert à la fois
l'API (`/api/*`) et le build React (`/build`). Railway convient bien à ce modèle.

Le fichier `railway.json` définit déjà :
- **Build** : `npm run build` (génère le dossier `build/`)
- **Start** : `npm run server` (lance Express, qui sert l'API + le build)

### Checklist avant de déployer

- [ ] **Variables d'environnement** à définir dans l'onglet "Variables" du service Railway
      (voir `.env.example` pour la liste complète) :
      - `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`
      - `ADMIN_PASSWORD`
      - `SESSION_SECRET` (chaîne aléatoire longue)
      - `NODE_ENV=production` (active le cookie de session sécurisé)
      - Ne pas définir `PORT` — Railway le fournit automatiquement.
- [ ] **Volume persistant** : par défaut, le système de fichiers de Railway est
      éphémère et est réinitialisé à chaque déploiement. La base de données
      (`server/data/wedding.db`, qui contient la liste des invités, les RSVP et
      les suggestions musicales) serait donc effacée à chaque déploiement.
      Dans l'onglet du service Railway, ajoutez un **Volume** monté sur le
      chemin `/app/server/data` (adapter si le répertoire de build diffère).
- [ ] **Domaine** : Railway fournit un sous-domaine `*.up.railway.app` par
      défaut ; un domaine personnalisé peut être ajouté dans les settings du
      service si besoin.
- [ ] Vérifier après le premier déploiement que `/admin` fonctionne (login,
      ajout d'invités) et que les données survivent à un redéploiement — c'est
      le signe que le volume est bien monté.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
