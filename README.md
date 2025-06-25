# Portfolio

This repository contains the source code for my personal portfolio website. The application is built with React and TypeScript and can be run locally or deployed to Firebase Hosting.

## Repository structure

- `portfolio/` – React application created with Create React App. See `portfolio/README.md` for details on available scripts.
- `docker-compose.yml` – Example compose file that builds the app and deploys it using Firebase.
- `portfolio/functions/` – Firebase Cloud Functions used for the AI features.

## Getting started

To develop locally you will need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/). After cloning the repository, install dependencies and start the development server:

```bash
cd portfolio
yarn install
yarn start
```

The site will be available at [http://localhost:3000](http://localhost:3000).

The chat interface originally relied on a Cloud Function named `selectFunction`.
The selection logic now runs directly in the browser using Firebase AI, so you
no longer need to set `REACT_APP_SELECT_FUNCTION_URL` when developing locally.

### Tests

Unit tests can be run from the `portfolio` directory:

```bash
yarn test
```

### Docker and deployment

The included `docker-compose.yml` builds the project image and runs `yarn build && yarn firebase deploy` to deploy the production build to Firebase Hosting:

```bash
docker-compose up --build
```

You will need valid Firebase credentials configured in your environment for the deployment to succeed.

### Cloud Functions

AI-powered features live in the `portfolio/functions` directory. To deploy them separately run:

```bash
firebase deploy --only functions
```

Ensure `FIREBASE_WEB_API_KEY` and `FIREBASE_APP_ID` are set in your project before deploying.

