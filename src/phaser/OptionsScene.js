import Phaser from "phaser";
import blueButton1 from "../assets/ui/blue_button02.png";
import blueButton2 from "../assets/ui/blue_button03.png";
import checkedBox from "../assets/ui/blue_boxCheckmark.png";
import box from "../assets/ui/grey_box.png";

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super("Options");
  }

  preload() {
    //adding all of the images needed for the options buttons
    this.load.image("blueButton1", blueButton1);
    this.load.image("blueButton2", blueButton2);
    this.load.image("checkedBox", checkedBox);
    this.load.image("box", box);
  }

  create() {
    //bring in the functions from the model to control the sound
    this.model = this.sys.game.globals.model;

    //adding the buttons and setting interactive, initially set to on (ticked box)
    this.text = this.add.text(300, 100, "Options", { fontSize: 40 });
    this.musicButton = this.add.image(200, 200, "checkedBox");
    this.musicText = this.add.text(250, 190, "Music Enabled", { fontSize: 24 });

    this.soundButton = this.add.image(200, 300, "checkedBox");
    this.soundText = this.add.text(250, 290, "Sound Enabled", { fontSize: 24 });

    this.musicButton.setInteractive();
    this.soundButton.setInteractive();

    this.musicButton.on(
      "pointerdown",
      function () {
        this.model.musicOn = !this.model.musicOn;
        this.updateAudio();
      }.bind(this)
    );

    this.soundButton.on(
      "pointerdown",
      function () {
        1;
        this.model.soundOn = !this.model.soundOn;
        this.updateAudio();
      }.bind(this)
    );

    this.menuButton = this.add.sprite(400, 500, "blueButton1").setInteractive();
    this.menuText = this.add.text(0, 0, "Menu", {
      fontSize: "32px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.menuText, this.menuButton);

    this.menuButton.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("Title");
      }.bind(this)
    );

    //invoke the controlling audio function and boxes from ticked to unticked
    this.updateAudio();
  }

  //updates the tick boxes
  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture("box");
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture("checkedBox");
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }

    if (this.model.soundOn === false) {
      this.soundButton.setTexture("box");
    } else {
      this.soundButton.setTexture("checkedBox");
    }
  }
}
