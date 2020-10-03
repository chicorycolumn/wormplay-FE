import Phaser from "phaser";
import config from "../Config/config";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create() {
    this.creditsText = this.add.text(0, 0, "Credits", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.madeByText = this.add.text(
      0,
      0,
      "Created By:\nChris Matus,\nJames Johnson,\nNadia Rashad\nand Patrick Mackridge",
      {
        fontSize: "26px",
        fill: "#fff",
      }
    );
    this.imageText = this.add.text(
      0,
      0,
      "Background image credits: Vecteezy.com",
      {
        fontSize: "18px",
        fill: "#fff",
      }
    );
    this.musicText = this.add.text(
      0,
      0,
      "Original 8 bit music created by Patrick Mackridge",
      {
        fontSize: "18px",
        fill: "#fff",
        align: "centre",
      }
    );
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height
    );

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);

    Phaser.Display.Align.In.Center(this.imageText, this.zone);
    Phaser.Display.Align.In.Center(this.madeByText, this.zone);
    Phaser.Display.Align.In.Center(this.musicText, this.zone);

    this.creditsText.setY(130);
    this.creditsText.setX(150);
    this.madeByText.setY(200);
    this.madeByText.setX(150);
    this.imageText.setY(400);
    this.imageText.setX(150);
    this.musicText.setY(440);
    this.musicText.setX(150);

    this.menuButton = this.add.sprite(110, 570, "blueButton1").setInteractive();

    this.menuText = this.add.text(0, 0, "Back to game", {
      fontSize: "20px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.menuText, this.menuButton);

    this.menuButton.on(
      "pointerup",
      function (pointer) {
        this.scene.start("MainScene");
      }.bind(this)
    );
  }
}
