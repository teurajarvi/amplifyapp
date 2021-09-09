# amplifyapp

React App for learning a Single Page Web App Hosting using ASW Amplify.
Getting Started with AWS, Create a simple web application using AWS Amplify, Build a Full-Stack React Application example used:
https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/

## How the React amplifyapp was initially created

> npx create-react-app amplifyapp

## How the AWS Amplify CLI was initially created

> npm install -g @aws-amplify/cli

## How the AWS Amplify CLI was initially configured (frontend)

See the video: https://www.youtube.com/watch?v=fWbM5DLh25U

> amplify configure

# How the AWS Amplify backend development was initially configured (backend)

- AWS -> All apps -> amplifyapp -> Backend environments -> Get started
- After the AWS creates the backend -> Open admin UI
- Go to AWS Amplify Console Backend environments tab and open the "Local setup instructions". Copy the command to your clipboard and open the terminal on your computer. f.e
  .. _"amplify pull --appId d2h86h7rfyr6cq --envName staging"._
  .. _Opening link: https://eu-central-1.admin.amplifyapp.com/admin/d2h86h7rfyr6cq/staging/verify/_
  .. _Continue in browser to log in…_ and in Browser _Are you sure you want to login to the Amplify CLI?._
  .. Click YES and go back to your terminal window.
- _Select your preferences:_
  .. _? Choose your default editor: Visual Studio Code_
  .. _? Choose the type of app that you're building: javascript_
  .. _? What javascript framework are you using: react_
  .. _? Source Directory Path: src_
  .. _? Distribution Directory Path: build_
  .. _? Build Command: npm run-script build_
  .. _? Start Command: npm run-script start_
  .. _? Do you plan on modifying this backend? Y_
- _\ Fetching updates to backend environment: staging from the cloud. Successfully pulled backend environment staging from the cloud._
  _Run 'amplify pull' to sync future upstream changes._

## To view your Amplify project in the dashboard at any time you can now run the following command:

> amplify console

_"? Which site do you want to open? ..._
_Amplify admin UI_
_Amplify console"_

# Adding the authentication to the app (amplifyapp)

## First install Amplify libraries:

> npm install aws-amplify @aws-amplify/ui-react

## Create authentication service, use the Amplify CLI:

> amplify add auth

_Using service: Cognito, provided by: awscloudformation_

_The current configured provider is Amazon Cognito._

_Do you want to use the default authentication and security configuration? (Use arrow keys)_
_Default configuration_
_Default configuration with Social Provider (Federation)_
_Manual configuration_
_I want to learn more._

Select: Default configuration

_Warning: you will not be able to edit these selections._
_How do you want users to be able to sign in? (Press <space> to select, <a> to toggle all, <i> to invert selection)_
_( ) Email_
_(\*) Username_
_( ) Phone number_

Select: Username

_Do you want to configure advanced settings? (Use arrow keys)_
_No, I am done._
_Yes, I want to make some additional changes._

Select: No, I am done.

_Successfully added auth resource amplifyapp795afc35 locally_

_Some next steps:_
_"amplify push" will build all your local backend resources and provision it in the cloud_
_"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud_

# Deploy the authentication service configured in previous steps

> amplify push --y

## Configure the React project with Amplify resources

Add following code lines to src/index.js below the last import statement:

```javascript
import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);
```

## Add following code lines to the src/App.js

```javascript
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

function App() {
  return (
    <div className='App'>
      <header>
        <img src={logo} className='App-logo' alt='logo' />
        <h1>We now have Auth!</h1>
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
```

In this component we've used the withAuthenticator component. This component will scaffold out an entire user authentication flow allowing users to sign up, sign in, reset their password, and confirm sign in for multifactor authentication (MFA). We've also used the AmplifySignOut component which will render a Sign Out button.

Test the app locally:

> npm start

# Set up CI/CD of the front end and backend

> amplify console

This will open the Amplify Console inside AWS. From the navigation sidebar, choose App settings > Build settings and modify it to add the backend section (lines 2-7 in the code below) to your amplify.yml. After making the edits, choose Save.

```javascript
version: 1
backend:
  phases:
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
      build:
        commands:
          - yarn run build
  artifacts:
    baseDirectory: build
    files:
      - '**/\*'
  cache:
    paths:
      - node_modules/**/\*
```

Next, update your front end branch to point to the backend environment you just created. Under the branch name, choose Edit, and then point your master branch to the dev (staging) backend you just created. Choose Save.

The frontend (main) will now be connected to the backend (staging) . These changes will be applied on your next build.

## Deploy the changes to the live environment

> git add .

> git commit -m “added auth”

> git push origin main

# Create a GaphGL API and database

> amplify add api

_? Please select from one of the below mentioned services: **GraphQL**_
_? Provide API name: **notesapp**_
_? Choose the default authorization type for the API: **API Key**_
_? Enter a description for the API key: **demo**_
_? After how many days from now the API key should expire (1-365): **7**_
_? Do you want to configure advanced settings for the GraphQL API: **No, I am done.**_
_? Do you have an annotated GraphQL schema? **No**_
_? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)_

_The following types do not have '@auth' enabled. Consider using @auth with @model - Todo_
_Learn more about @auth here: https://docs.amplify.aws/cli/graphql-transformer/auth_

_GraphQL schema compiled successfully._

_Edit your schema at \amplifyapp\amplify\backend\api\notesapp\schema.graphql or place .graphql files in a directory at \amplifyapp\amplify\backend\api\notesapp\schema_
_? Do you want to edit the schema now? (**y**/N)_

_Edit the file in your editor: \amplifyapp\amplify\backend\api\notesapp\schema.graphql_
_Successfully added resource notesapp locally_

_Some next steps:_
_"amplify push" will build all your local backend resources and provision it in the cloud_
_"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud_

## Deploy the API

> amplify push --y

This will do 3 things:

- Create the AppSync API
- Create a DynamoDB table
- Create the local GraphQL operations in a folder located at src/graphql that you can use to query the API

To view the GraphQL API in your account at any time, run the following command:

> amplify console api

Choose GraphQL

# Write front-end code to interact with the API

Update src/App.js with the following code:

```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import { API } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className='App'>
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder='Note name'
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder='Note description'
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete note</button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
```

# Add Storege

> amplify add storage

_? Please select from one of the below mentioned services: **Content (Images, audio, video, etc.)**_
_? Please provide a friendly name for your resource that will be used to label this category in the project: **imagestorage**_
_? Please provide bucket name: **<your-unique-bucket-name>**_
_? Who should have access: **Auth users only**_
_? What kind of access do you want for Authenticated users? (Press <space> to select, **<a> to toggle all**, <i> to invert selection)_
_(\*) create/update_
_(\*) read_
_(\*) delete_
_? Do you want to add a Lambda Trigger for your S3 Bucket?_ **N**

✅ _Successfully added resource imagestorage locally_

⚠️ _If a user is part of a user pool group, run "amplify update storage" to enable IAM group policies for CRUD operations_
✅ _Some next steps:_
_"amplify push" builds all of your local backend resources and provisions them in the cloud_
_"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud_

## Update the GraphQL schema

Next, open amplify/backend/api/notesapp/schema.graphql and update it with the following schema:

```javascript
type Note @model {
  id: ID!
  name: String!
  description: String
  image: String
}
```

## Deploy storage service and API updates

Now that the storage service has been configured locally and we've updated the GraphQL schema, we can deploy the updates by running the Amplify push command:

> amplify push --y

_√ Generated GraphQL operations successfully and saved at src\graphql_
_√ All resources are updated in the cloud_

_GraphQL endpoint: https://ehe2tlg4gnd63cq32fcl5s7vpu.appsync-api.eu-central-1.amazonaws.com/graphql_
_GraphQL API KEY: da2-c7japuus6bbjzgyhka4vl7yoga_

## Update the React app

Add

```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import { API, Storage } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

const initialFormState = { name: "", description: "" };

function App() {
  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listTodos.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image;
        }
        return note;
      })
    );
    setNotes(apiData.data.listTodos.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className='App'>
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder='Note name'
        value={formData.name}
      />
      <input type='file' onChange={onChange} />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder='Note description'
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete note</button>
            {note.image && (
              <img alt='note' src={note.image} style={{ width: 400 }} />
            )}
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
```

# Set Amplify CLI version to latest

Your build may fail if the Amplify CLI version is not the latest. You can set the latest version by AWS Amplify -> App settings -> Build settings -> Build image settings -> Live package updates -> Package: Amplify CLI -> Version: latests

# Add a service role to the Amplify console

The Amplify Console requires permissions to deploy backend resources with your front end. You use a service role to accomplish this. A service role is the AWS Identity and Access Management (IAM) role that Amplify Console assumes when calling other services on your behalf.

https://docs.aws.amazon.com/amplify/latest/userguide/how-to-service-role-amplify-console.html

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

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

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
