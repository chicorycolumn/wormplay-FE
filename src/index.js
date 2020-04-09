import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://wormplayserver.herokuapp.com/");

console.log(App);

export const config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scene: playGame,
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,

  document.getElementById("gene") || document.createElement("div")
);
ReactDOM.render(<App socket={socket} />, document.getElementById("root"));
