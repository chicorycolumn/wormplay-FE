import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://wormplayserver.herokuapp.com/");

ReactDOM.render(<App socket={socket} />, document.getElementById("root"));
