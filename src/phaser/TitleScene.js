import Phaser from "phaser";
import config from "../Config/config";
import blueButton1 from "../assets/ui/blue_button02.png";
import blueButton2 from "../assets/ui/blue_button03.png";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  preload() {
    this.load.image("blueButton1", blueButton1);
    this.load.image("blueButton2", blueButton2);
    this.load.audio("bgMusic", ["src/assets/wiggle.mp3"]);
  }

  create() {
    // Game
    this.gameButton = this.add.sprite(100, 200, "blueButton1").setInteractive();
    this.centerButton(this.gameButton, 1);

    this.gameText = this.add.text(0, 0, "Play", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.centerButtonText(this.gameText, this.gameButton);

    this.gameButton.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("MainScene");
      }.bind(this)
    );

    // Options
    this.optionsButton = this.add
      .sprite(300, 200, "blueButton1")
      .setInteractive();
    this.centerButton(this.optionsButton);

    this.optionsText = this.add.text(0, 0, "Options", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.centerButtonText(this.optionsText, this.optionsButton);

    this.optionsButton.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("Options");
      }.bind(this)
    );

    // Credits
    this.creditsButton = this.add
      .sprite(300, 200, "blueButton1")
      .setInteractive();
    this.centerButton(this.creditsButton, -1);

    this.creditsText = this.add.text(0, 0, "Credits", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.centerButtonText(this.creditsText, this.creditsButton);

    this.creditsButton.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("Credits");
      }.bind(this)
    );

    this.input.on("pointerover", function (event, gameObjects) {
      gameObjects[0].setTexture("blueButton2");
    });

    this.input.on("pointerout", function (event, gameObjects) {
      gameObjects[0].setTexture("blueButton1");
    });
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height
      )
    );
  }

  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
}
