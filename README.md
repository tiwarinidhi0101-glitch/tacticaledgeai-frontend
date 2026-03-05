# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.  

The build is ready to be deployed.

---

## Environment Variables

This project uses **environment variables** to configure API URLs for both local development and production.

Create a `.env` file at the root of the project with the following:

```env
# Local backend URL
REACT_APP_LOCAL_API=http://localhost:8000

# Remote backend URL (production)
REACT_APP_REMOTE_API=https://movie-app.ap-south-1.elasticbeanstalk.com
