import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import MainScene from "./MainScene";
import Model from "../Model";
import OptionsScene from "../phaser/OptionsScene";
import TitleScene from "../phaser/TitleScene";
import CreditScene from "../phaser/CreditScene";
import PreloaderScene from "../phaser/PreloaderScene";
import BootScene from "../phaser/BootScene";

export default class PhaserGame extends Phaser.Game {
  constructor(react) {
    const config = {
      type: Phaser.AUTO, //Use WebGL if avail, otherwise Canvas.
      parent: "phaserContainer", //Could this adding a canvas element conflict with the photo taking canvas?
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
        },
      },
      // scene: [MainScene, OptionsScene, TitleScene],
    };
    super(config);

    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.react = react;
    this.scene.add("Options", OptionsScene);
    this.scene.add("MainScene", MainScene);
    this.scene.add("Title", TitleScene);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Credits", CreditScene);
    this.scene.add("Boot", BootScene);
    this.scene.start("MainScene");
  }
}
