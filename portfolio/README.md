# Personal Portfolio

This project is a small React application created with [Create React App](https://github.com/facebook/create-react-app).
The goal of this app is to explain who I am by providing a simple portfolio with some background information and ways to contact me.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits and you will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## Firebase Cloud Functions

The project originally exposed a Cloud Function named `selectFunction` to map a
chat message to the appropriate component. The React application now performs
this selection directly in the browser using Firebase AI with the `GoogleAIBackend`,
so no extra configuration such as `REACT_APP_SELECT_FUNCTION_URL` is required when
developing locally.

Example request using `curl`:

```bash
curl -X POST https://<your-region>-<your-project>.cloudfunctions.net/selectFunction \
     -H "Content-Type: application/json" \
     -d '{"text": "Show me your interests"}'
```

This will return a JSON response similar to:

```json
{ "function": "interestGraph" }
```

Set the environment variables `FIREBASE_WEB_API_KEY` and `FIREBASE_APP_ID` in your Firebase project to enable the Firebase AI integration.

### `autoReply` function

This function returns the introductory message that appears in the chat when the
page first loads. Send a JSON payload with a `lang` field (`en` or `ja`) and the
function will respond with a randomly selected message in that language.

Example:

```bash
curl -X POST https://<your-region>-<your-project>.cloudfunctions.net/autoReply \
     -H "Content-Type: application/json" \
     -d '{"lang": "en"}'
```

This will return a JSON response containing the introduction text.
