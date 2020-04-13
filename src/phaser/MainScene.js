import Phaser from "phaser";
import img from "../assets/circle.png";
import head from "../assets/head-smaller.png";
import body from "../assets/body-resized.png";
import background from "../assets/whitehouse.png";

import blueButton1 from "../assets/ui/blue_button02.png";

import { vowelArray, consonantArray } from "../refObjs.js";

//You can access the state of ReactGameHolder.jsx with `this.game.react.state`.

//You can access the socket anywhere inside the component below, using `this.game.react.state.socket`.
//I (Chris) suggest that in this file we use the socket for all the in-game stuff.

let socket; // This looks weird but is correct, because we want to declare the socket variable here, but we can't yet initialise it with a value.

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.gameState = {};
  }

  preload() {
    socket = this.game.react.state.socket; // Here is where the socket gets made.
    this.load.image("head", head);
    this.load.image("body", body);
    this.load.image("background", background);
    this.load.image("blueButton1", blueButton1);
    // this.load.audio("bgMusic", ["../assets/wiggle.mp3"]);
  }

  create() {
    //adding a background image, the 400 & 300 are the scale so no need to change that when we update the image
    let bg = this.add.image(400, 300, "background");
    bg.displayHeight = this.sys.game.config.height;
    bg.displayWidth = this.sys.game.config.width;

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

    //letter array so the random letter generation can pick from it

    // Create a text object and put 6 random letters within it (with styling)
    this.gameState.text = {};

    const letterTileSpecifications = {
      1: { x: 50, y: 25 },
      2: { x: 100, y: 25 },
      3: { x: 150, y: 25 },
      4: { x: 200, y: 25 },
      5: { x: 250, y: 25 },
      6: { x: 300, y: 25 },
      7: { x: 350, y: 25 },
      8: { x: 400, y: 25 },
      9: { x: 450, y: 25 },
      10: { x: 500, y: 25 },
    };

    Object.keys(letterTileSpecifications).forEach((n) => {
      let num = parseInt(n);
      this.gameState.text[`letter${num}`] = this.add.text(
        letterTileSpecifications[num].x,
        letterTileSpecifications[num].y,
        Phaser.Math.RND.pick(num < 5 ? vowelArray : consonantArray),
        textStyle
      );
    });

    // Loop through text object and set up drag and drop functionality
    for (const letter in this.gameState.text) {
      const thisLetter = this.gameState.text[letter];

      thisLetter.setFixedSize(48, 48);

      // Make letters interact with other objects but initially disable that ability
      this.physics.add.existing(thisLetter);
      thisLetter.body.enable = false;

      thisLetter.onSegment = null;

      const startX = thisLetter.x;
      const startY = thisLetter.y;

      // Loop through body parts and set up interaction with letters
      for (const objectKey in this.gameState) {
        if (/body\d/g.test(objectKey) === true) {
          const bodyPart = this.gameState[objectKey];
          bodyPart.hasLetter = false;

          this.physics.add.overlap(thisLetter, bodyPart, function () {
            if (thisLetter.onSegment === null && bodyPart.hasLetter === false) {
              thisLetter.onSegment = objectKey; //'objectKey' is the name/key of the body part
              bodyPart.hasLetter = true;
            }
          });
        }
      }

      // Make letters draggable
      thisLetter.setInteractive();

      this.input.setDraggable(thisLetter);

      thisLetter.on("dragstart", function (pointer) {
        this.body.enable = true;
        this.setTint(0xff0000);
      });

      thisLetter.on("drag", function (pointer, dragX, dragY) {
        this.x = dragX;
        this.y = dragY;

        this.body.x = this.x;
        this.body.y = this.y;

        const initialOnSegment = this.onSegment;

        this.onSegment = null; // Only applies if letter is not overlapping with the a body part

        if (initialOnSegment !== null && this.onSegment === null) {
          this.scene.gameState[initialOnSegment].hasLetter = false;
        }
      });

      thisLetter.on("dragend", function (pointer) {
        this.clearTint();

        if (this.onSegment === null) {
          this.x = startX;
          this.y = startY;
          this.body.enable = false;
          this.body.x = startX;
          this.body.y = startY;
        }
      });
    }

    // Create Array of worm letters
    this.gameState.wormWordArr = [" ", " ", " ", " ", " ", " "];

    // Create submit button
    const btnStyle = {
      font: "35px Arial",
      fill: "#000000",
      align: "center",
      backgroundColor: "#FFBF00",
      padding: { top: 4, left: 8, right: 8 },
    };

    this.gameState.submitBtn = this.add
      .text(650, 25, "Submit", btnStyle)
      .setInteractive();

    //adding a menu button & setting interactive
    this.menuButton = this.add.sprite(50, 585, "blueButton1").setInteractive();
    this.menuButton.setScale(0.5);
    this.menuText = this.add.text(0, 0, "Menu", {
      fontSize: "20px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.menuText, this.menuButton);

    //adding menu button functionality, on click will take you to title
    this.menuButton.on(
      "pointerdown",
      function (pointer) {
        this.scene.start("Title");
      }.bind(this)
    );

    const originalBtnY = this.gameState.submitBtn.y;

    this.gameState.submitBtn.on("pointerover", function (event) {
      this.setTint(0xff0000);
    });

    this.gameState.submitBtn.on("pointerout", function (event) {
      this.setTint(0xffbf00);
      this.y = originalBtnY;
    });

    this.gameState.submitBtn.on("pointerdown", function (event) {
      this.setTint(0xdf0101);
      this.y = this.y + 2;
    });

    this.gameState.submitBtn.on("pointerup", function (event) {
      this.setTint(0xff0000);
      this.y = originalBtnY;
      this.hasBeenPressed = true;
      this.scene.gameState.submitWord(
        this.scene.gameState.text,
        this.scene.gameState.wormWordArr,
        this.scene.game.react.state.socket,
        this.hasBeenPressed
      );
    });

    this.gameState.submitWord = function (
      allLettersObj,
      wormWordArr,
      socket,
      submitBtnPressed
    ) {
      let wordArr = wormWordArr.map((el) => (el = " "));
      for (const letter in allLettersObj) {
        if (allLettersObj[letter].onSegment !== null) {
          const bodyIndex =
            Number(allLettersObj[letter].onSegment.slice(4)) - 1;

          wordArr[bodyIndex] = allLettersObj[letter].text;
        }
      }
      if (submitBtnPressed === true) {
        const firstSpace = wordArr.indexOf(" ");
        if (firstSpace !== -1) {
          wordArr = wordArr.slice(0, firstSpace);
        }
        const submittedWord = wordArr.join("");
        socket.emit("worm word submitted", submittedWord);
      } // else: For sending letters-on-worm info to other players (on overlap line 151?) }
    };
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
        const attachedBodyPart = this.gameState[text[letter].onSegment];

        text[letter].x = attachedBodyPart.x - 24;
        text[letter].y = attachedBodyPart.y - 24;
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
