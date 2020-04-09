import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import socketIOClient from "socket.io-client";

let shouldEndpointBeHeroku = true //TOGGLE THIS MANUALLY DURING DEVELOPMENT

const socket
socket = shouldEndpointBeHeroku ? socketIOClient("https://wormplayserver.herokuapp.com/") : socketIOClient("http://localhost:4001");

ReactDOM.render(<App socket={socket} />, document.getElementById("root"));
