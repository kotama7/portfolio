# Portfolio

This repository contains the source code for my personal portfolio website. The application is built with React and TypeScript and can be run locally or deployed to Firebase Hosting.

## Repository structure

- `portfolio/` – React application created with Create React App. See `portfolio/README.md` for details on available scripts.
- `docker-compose.yml` – Example compose file that builds the app and deploys it using Firebase.

## Getting started

To develop locally you will need [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/). After cloning the repository, install dependencies and start the development server:

```bash
cd portfolio
yarn install
yarn start
```

The site will be available at [http://localhost:3000](http://localhost:3000).

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

