import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import Lobby from "./components/Lobby.jsx";
import socketIOClient from "socket.io-client";

let shouldEndpointBeHeroku = false; //TOGGLE THIS MANUALLY DURING DEVELOPMENT

let goStraightToLobby = false; //USE THIS TO SKIP STRAIGHT TO LOBBY, BYPASSING LOGIN.

let goStraightToRoomOne = false; //USE THIS TO SKIP STRAIGHT TO GAME, BYPASSING LOGIN AND LOBBY.
//                              THOUGH SOME FXNS MAY NOT WORK AS EXPECTED.
//                              USEFUL MORE FOR GRAPHIC WORK THAN SOCKET BASED WORK.

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
