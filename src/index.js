import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import socketIOClient from "socket.io-client";

let shouldEndpointBeHeroku = false; //TOGGLE THIS MANUALLY DURING DEVELOPMENT

const socket = socketIOClient(
  shouldEndpointBeHeroku
    ? "https://wormplayserver.herokuapp.com/"
    : "http://localhost:4001"
);

ReactDOM.render(<App socket={socket} />, document.getElementById("rightPanel"));
