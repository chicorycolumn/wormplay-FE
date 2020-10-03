import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import Lobby from "./components/Lobby.jsx";
import socketIOClient from "socket.io-client";

let shouldEndpointBeHeroku = false;
let goStraightToLobby = false;
let goStraightToRoomOne = false;

const socket = socketIOClient(
  shouldEndpointBeHeroku
    ? "https://wormplayserver.herokuapp.com/"
    : "http://localhost:4002"
);

if (goStraightToRoomOne) {
  ReactDOM.render(
    <Lobby socket={socket} goStraightToRoomOne={goStraightToRoomOne} />,
    document.getElementById("mainBody")
  );
} else
  ReactDOM.render(
    <App socket={socket} goStraightToLobby={goStraightToLobby} />,
    document.getElementById("mainBody")
  );
