# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.0. 

# Server

Repository also has a server (backend) folder to manage webhook via websockets which can be consumed in any component for async UI updates but currently client does not have this functionality as main motive was to integrate checkout Payment-Components.
The app is not upto the mark with the coding standards but is easy to understand how payment components can be integrated using the CDN within typrescript / angular.

# Run on local dev environment
If you just want to initiate the client app withour webhook setup, just pull the code and follow below steps:
- cd client/
- npm i
- ng serve
- visit the browser as app is by default listening at - localhost:4200

If you are willing to extend webhook implementation to consume the endpoint:
- cd server
- npm i
- npm start
- node.js will start the angular app as well and start listening on - localhost:3080
- The server side code is currently only in server/app.js with a http and websocket server setup by default with a webhook receiver endpoint.




