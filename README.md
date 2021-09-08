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
- Go to AWS Amplify Console Backend environments tab and open the "Local setup instructions". Copy the command to your clipboard and open the terminal on your computer. f.e "amplify pull --appId d2h86h7rfyr6cq --envName staging". You will see "Opening link: https://eu-central-1.admin.amplifyapp.com/admin/d2h86h7rfyr6cq/staging/verify/
  \ Continue in browser to log in…" and in Browser "Are you sur
  e you want to login to the Amplify CLI?". Click YES and go back to your terminal window.
- Select your preferences:
  ? Choose your default editor: Visual Studio Code
  ? Choose the type of app that you're building: javascript
  ? What javascript framework are you using: react
  ? Source Directory Path: src
  ? Distribution Directory Path: build
  ? Build Command: npm run-script build
  ? Start Command: npm run-script start
  ? Do you plan on modifying this backend? Y
- Finally you see: "\ Fetching updates to backend environment: staging from the cloud. Successfully pulled backend environment staging from the cloud.
  Run 'amplify pull' to sync future upstream changes."

# To view your Amplify project in the dashboard at any time you can now run the following command:

> amplify console

You will see then the options:
"? Which site do you want to open? ...
Amplify admin UI
Amplify console"

# Adding the authentication to the app (amplifyapp)

## First install Amplify libraries:

> npm install aws-amplify @aws-amplify/ui-react

## Create authentication service, use the Amplify CLI:

> amplify add auth

Using service: Cognito, provided by: awscloudformation

The current configured provider is Amazon Cognito.

Do you want to use the default authentication and security configuration? (Use arrow keys)
Default configuration
Default configuration with Social Provider (Federation)
Manual configuration
I want to learn more.
Select: Default configuration

Warning: you will not be able to edit these selections.
How do you want users to be able to sign in? (Press <space> to select, <a> to toggle all, <i> to invert selection)
( ) Email
(\*) Username
( ) Phone number
Select: Username

Do you want to configure advanced settings? (Use arrow keys)
No, I am done.
Yes, I want to make some additional changes.
Select: No, I am done.

Successfully added auth resource amplifyapp795afc35 locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

## Deploy the authentication service configured in previous steps

> amplify push --y

## Configure the React project with Amplify resources

Add following code lines to src/index.js below the last import statement:

import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

## Add following code lines to the src/App.js

---

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
return (

<div className="App">
<header>
<img src={logo} className="App-logo" alt="logo" />
<h1>We now have Auth!</h1>
</header>
<AmplifySignOut />
</div>
);
}

## export default withAuthenticator(App);

In this component we've used the withAuthenticator component. This component will scaffold out an entire user authentication flow allowing users to sign up, sign in, reset their password, and confirm sign in for multifactor authentication (MFA). We've also used the AmplifySignOut component which will render a Sign Out button.

Test the app locally:

> npm start

# Set up CI/CD of the front end and backend

> amplify console

This will open the Amplify Console inside AWS. From the navigation sidebar, choose App settings > Build settings and modify it to add the backend section (lines 2-7 in the code below) to your amplify.yml. After making the edits, choose Save.

1 version: 1
2 backend:
3 phases:
4 build:
5 commands:
6 - '# Execute Amplify CLI with the helper script'
7 - amplifyPush --simple
8 frontend:
9 phases:
10 preBuild:
11 commands:
12 - yarn install
13 build:
14 commands:
15 - yarn run build
16 artifacts:
17 baseDirectory: build
18 files:
19 - '**/\*'
20 cache:
21 paths:
22 - node_modules/**/\*

Next, update your front end branch to point to the backend environment you just created. Under the branch name, choose Edit, and then point your master branch to the dev (staging) backend you just created. Choose Save.

The frontend (main) will now be connected to the backend (staging) . These changes will be applied on your next build.

## Deploy the changes to the live environment

> git add .

> git commit -m “added auth”

> git push origin main

# Create a GaphGL API and database

> amplify add api

? Please select from one of the below mentioned services: GraphQL
? Provide API name: notesapp
? Choose the default authorization type for the API: API Key
? Enter a description for the API key: demo
? After how many days from now the API key should expire (1-365): 7
? Do you want to configure advanced settings for the GraphQL API No, I am done.
? Do you have an annotated GraphQL schema? No
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)

The following types do not have '@auth' enabled. Consider using @auth with @model - Todo
Learn more about @auth here: https://docs.amplify.aws/cli/graphql-transformer/auth

GraphQL schema compiled successfully.

Edit your schema at C:\Users\jp.teurajarvi\github\AWS\amplifyapp\amplify\backend\api\notesapp\schema.graphql or place .graphql files in a directory at C:\Users\jp.teurajarvi\github\AWS\amplifyapp\amplify\backend\api\notesapp\schema
? Do you want to edit the schema now? (y/N)

Edit the file in your editor: C:\Users\jp.teurajarvi\github\AWS\amplifyapp\amplify\backend\api\notesapp\schema.graphql
Successfully added resource notesapp locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

## Deploy the API

> amplify push --y

This will do 3 things:

Create the AppSync API
Create a DynamoDB table
Create the local GraphQL operations in a folder located at src/graphql that you can use to query the API
To view the GraphQL API in your account at any time, run the following command:

> amplify console api

Choose GraphQL

# Add Storege

> amplify add storage

? Please select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Please provide a friendly name for your resource that will be used to label this category in the project: imagestorage
? Please provide bucket name: <your-unique-bucket-name>
? Who should have access: Auth users only
? What kind of access do you want for Authenticated users? (Press <space> to select, <a> to toggle all, <i> to invert selection)
(_) create/update
(_) read
(\*) delete
? Do you want to add a Lambda Trigger for your S3 Bucket? N

✅ Successfully added resource imagestorage locally

⚠️ If a user is part of a user pool group, run "amplify update storage" to enable IAM group policies for CRUD operations
✅ Some next steps:
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud

## Update the GraphQL schema

Next, open amplify/backend/api/notesapp/schema.graphql and update it with the following schema:

type Note @model {
id: ID!
name: String!
description: String
image: String
}

## Deploy storage service and API updates

> amplify push --y

√ Generated GraphQL operations successfully and saved at src\graphql
√ All resources are updated in the cloud

GraphQL endpoint: https://ehe2tlg4gnd63cq32fcl5s7vpu.appsync-api.eu-central-1.amazonaws.com/graphql
GraphQL API KEY: da2-c7japuus6bbjzgyhka4vl7yoga

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
