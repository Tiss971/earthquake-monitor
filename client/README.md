# quizzyWeb

Web server repository

## Technologies

-   ReactJs
-   Socket.io
-   MaterialUI
-   React-Redux
-   React-Router
-   and more to come...

## Setup

**NOTE:** Requires Node.js LTS version

Go to the repository folder's root and enter this in the command line:

```bash
npm install
```

This will install all the packages and development dependencies for the project
in order to work properly.

Now you should be able to start the development server with the options provided by the `npm` scripts:

-   `npm run start`: Start the server in development mode

## Testing

The testing framework used in this project is Jest (and Supertest for testing API requests).

Each route should have its own unit test file. In order to execute tests, launch

```bash
npm run test
```

Or if you want to test individual routes and modules:

```bash
npm run test -- <filename>
```
