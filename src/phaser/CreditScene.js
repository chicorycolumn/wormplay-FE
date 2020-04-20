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
      "Created By: Chris, James, Nadia and Patrick",
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
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height
    );

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);

    Phaser.Display.Align.In.Center(this.imageText, this.zone);
    Phaser.Display.Align.In.Center(this.madeByText, this.zone);

    this.creditsText.setY(70);
    this.madeByText.setY(200);
    this.imageText.setY(280);

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

    //this is if you want the credits to auto scroll though and then go back to the game
    // this.creditsTween = this.tweens.add({
    //   targets: this.creditsText,
    //   y: -100,
    //   ease: "Power1",
    //   duration: 3000,
    //   delay: 1000,
    //   onComplete: function () {
    //     this.destroy;
    //   },
    // });

    // this.madeByTween = this.tweens.add({
    //   targets: this.madeByText,
    //   y: -300,
    //   ease: "Power1",
    //   duration: 8000,
    //   delay: 1000,
    //   onComplete: function () {
    //     this.madeByText.destroy;
    //     this.scene.start("MainScene");
    //   }.bind(this),
    // });
    // this.imageTween = this.tweens.add({
    //   targets: this.imageText,
    //   y: -200,
    //   ease: "Power1",
    //   duration: 3000,
    //   delay: 2000,
    //   onComplete: function () {
    //     this.destroy;
    //   },
    // });
  }
}
