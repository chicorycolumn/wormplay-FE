import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import MainScene from "./MainScene";

export default class PhaserGame extends Phaser.Game {
  constructor(react) {
    const config = {
      type: Phaser.AUTO, //Use WebGL if avail, otherwise Canvas.
      parent: "phaser", //Could this adding a canvas element conflict with the photo taking canvas?
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
        },
      },
      scene: [MainScene],
    };
    super(config);
    this.react = react;
  }
}
