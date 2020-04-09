import Phaser from "phaser";
import img from "../assets/circle.png";
import head from "../assets/head-smaller.png";
import body from "../assets/body-resized.png";
<<<<<<< HEAD:src/phaser/scene.js
import background from "../assets/whitehouse.png";
=======
//Access the state of ReactGameHolder.jsx with `this.game.react.state`.
let socket;
>>>>>>> 50451a22944207778f8108c1dd3f1871ae814fc9:src/phaser/MainScene.js

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.gameState = {};
  }

  // The functions below should be broken down into seperate functions for optimisation
  //These functions create the circle and make it move randomly

  preload() {
    socket = this.game.react.state.socket;
    this.load.image("head", head);
    this.load.image("body", body);
    this.load.image("background", background);
    this.load.audio("trumpsad", ["../assets/idontwinanymore.mp3"]);
  }

  create() {
    //adding a background image, the 400 & 300 are the scale so no need to change that when we update the image
    let bg = this.add.image(400, 300, "background");
    bg.displayHeight = this.sys.game.config.height;
    bg.displayWidth = this.sys.game.config.width;

    // music = this.game.add.audio("trumpsad");
    // music.play();

    this.gameState.body6 = this.physics.add.image(400, 150, "body");
    this.gameState.body5 = this.physics.add.image(400, 125, "body");
    this.gameState.body4 = this.physics.add.image(400, 125, "body");
    this.gameState.body3 = this.physics.add.image(400, 125, "body");
    this.gameState.body2 = this.physics.add.image(400, 125, "body");
    this.gameState.body1 = this.physics.add.image(400, 125, "body");
    this.gameState.head = this.physics.add.image(400, 125, "head");

    //variables for destination
    this.gameState.head.xDest = 400;
    this.gameState.head.yDest = 150;
    this.gameState.head.count = 0;
    this.gameState.head.body.collideWorldBounds = true;

    //Create letter styling
    const textStyle = {
      font: "35px Arial",
      fill: "#007300",
      align: "center",
      backgroundColor: "#FAFFE8",
      padding: { top: 4 },
    };

    // Create a text object and put 6 letters within it (with styling)
    this.gameState.text = {};
    this.gameState.text.letter1 = this.add.text(300, 25, "W", textStyle);
    this.gameState.text.letter2 = this.add.text(350, 25, "I", textStyle);
    this.gameState.text.letter3 = this.add.text(400, 25, "G", textStyle);
    this.gameState.text.letter4 = this.add.text(450, 25, "G", textStyle);
    this.gameState.text.letter5 = this.add.text(500, 25, "L", textStyle);
    this.gameState.text.letter6 = this.add.text(550, 25, "E", textStyle);

    // Loop through text object and set up drag and drop functionality
    for (const letter in this.gameState.text) {
      this.gameState.text[letter].setFixedSize(48, 48);

      // Make letters interact with other objects
      this.physics.add.existing(this.gameState.text[letter]);

      this.gameState.text[letter].onSegment = null;

      const startX = this.gameState.text[letter].x;
      const startY = this.gameState.text[letter].y;

      // Loop through body part and set up interaction with letters
      for (const bodyPart in this.gameState) {
        if (/body\d/g.test(bodyPart)) {
          this.physics.add.overlap(
            this.gameState.text[letter],
            this.gameState[bodyPart],
            function () {
              if (this.gameState.text[letter].onSegment === null) {
                this.gameState.text[letter].onSegment = bodyPart;
              }
            },
            null,
            this
          );
        }
      }

      // Make letters draggable
      this.gameState.text[letter].setInteractive();

      this.input.setDraggable(this.gameState.text[letter]);

      this.gameState.text[letter].on("dragstart", function (pointer) {
        this.setTint(0xff0000);
      });

      this.gameState.text[letter].on("drag", function (pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
        this.onSegment = null;
      });

      this.gameState.text[letter].on("dragend", function (pointer) {
        this.clearTint();

        if (this.onSegment === null) {
          this.x = startX;
          this.y = startY;
        }
      });
    }
  }

  update() {
    const {
      head,
      body1,
      body2,
      body3,
      body4,
      body5,
      body6,
      text,
    } = this.gameState;

    // Fix letters to body parts
    for (const letter in text) {
      if (text[letter].onSegment !== null) {
        text[letter].x = this.gameState[text[letter].onSegment].x - 24;
        text[letter].y = this.gameState[text[letter].onSegment].y - 24;
      }
    }

    if (head.count === 0) {
      head.xDest = Math.floor(Math.random() * 800);
      head.yDest = Math.floor(Math.random() * 600);
      this.physics.moveTo(head, head.xDest, head.yDest, 60, 60, 60);

      head.count = 300;
    }
    head.rotation = this.physics.accelerateTo(
      head,
      head.xDest,
      head.yDest,
      60,
      60,
      60
    );
    this.physics.moveTo(body1, head.x, head.y, 60, 750, 750);
    this.physics.moveTo(body2, body1.x, body1.y, 60, 750, 750);
    this.physics.moveTo(body3, body2.x, body2.y, 60, 750, 750);
    this.physics.moveTo(body4, body3.x, body3.y, 60, 750, 750);
    this.physics.moveTo(body5, body4.x, body4.y, 60, 750, 750);
    this.physics.moveTo(body6, body5.x, body5.y, 60, 750, 750);
    if (head.count > 0) {
      head.count--;
    }
  }
}
