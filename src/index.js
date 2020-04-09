import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:4001");

ReactDOM.render(<App socket={socket} />, document.getElementById("root"));
