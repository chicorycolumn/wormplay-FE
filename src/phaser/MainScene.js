import Phaser from "phaser";
import img from "../assets/circle.png";
import head from "../assets/head-smaller.png";
import body from "../assets/body-resized.png";
import background from "../assets/whitehouse.png";

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

    this.load.setPath("../assets/audio");
    this.load.audio("jazz", "assets/audio/jazz.wav");
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
    const letterArray = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    // Create a text object and put 6 random letters within it (with styling)
    this.gameState.text = {};
    this.gameState.text.letter1 = this.add.text(
      300,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );
    this.gameState.text.letter2 = this.add.text(
      350,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );
    this.gameState.text.letter3 = this.add.text(
      400,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );
    this.gameState.text.letter4 = this.add.text(
      450,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );
    this.gameState.text.letter5 = this.add.text(
      500,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );

    // this.gameState.text.letter6 = this.add.text(550, 25, "E", textStyle);
    this.gameState.text.letter6 = this.add.text(
      550,
      25,
      Phaser.Math.RND.pick(letterArray),
      textStyle
    );

    // Loop through text object and set up drag and drop functionality
    for (const letter in this.gameState.text) {
      this.gameState.text[letter].setFixedSize(48, 48);

      // Make letters interact with other objects but initially disable that ability
      this.physics.add.existing(this.gameState.text[letter]);
      this.gameState.text[letter].body.enable = false;

      // Removes blue outline from letters and floating blue box when attaching letters
      this.gameState.text[letter].body.debugShowBody = false;

      this.gameState.text[letter].onSegment = null;

      const startX = this.gameState.text[letter].x;
      const startY = this.gameState.text[letter].y;

      // Loop through body parts and set up interaction with letters
      for (const bodyPart in this.gameState) {
        if (/body\d/g.test(bodyPart)) {
          this.gameState[bodyPart].hasLetter = false;
          this.physics.add.overlap(
            this.gameState.text[letter],
            this.gameState[bodyPart],
            function () {
              if (
                this.gameState.text[letter].onSegment === null &&
                this.gameState[bodyPart].hasLetter === false
              ) {
                this.gameState.text[letter].onSegment = bodyPart;
                this.gameState[bodyPart].hasLetter = true;
                console.log(this.gameState.text[letter].body);
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
        this.body.enable = true;
        this.setTint(0xff0000);
      });

      this.gameState.text[letter].on(
        "drag",
        function (pointer, dragX, dragY) {
          this.gameState.text[letter].x = dragX;
          this.gameState.text[letter].y = dragY;

          this.gameState.text[letter].body.x = this.gameState.text[letter].x;
          this.gameState.text[letter].body.y = this.gameState.text[letter].y;

          const initialOnSegment = this.gameState.text[letter].onSegment;
          this.gameState.text[letter].onSegment = null;

          if (
            initialOnSegment !== null &&
            this.gameState.text[letter].onSegment === null
          ) {
            this.gameState[initialOnSegment].hasLetter = false;
          }
        },
        this
      );

      this.gameState.text[letter].on("dragend", function (pointer) {
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
    this.gameState.wormWord = ["", "", "", "", "", ""];

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

    this.gameState.submitBtn.on(
      "pointerup",
      function (event) {
        this.gameState.submitBtn.setTint(0xff0000);
        this.gameState.submitBtn.y = originalBtnY;
        this.gameState.submitWord(this.gameState.text, this.gameState.wormWord);
      },
      this
    );

    this.gameState.submitWord = function (textObj, wordArr) {
      for (const letter in textObj) {
        if (textObj[letter].onSegment !== null) {
          const bodyIndex = Number(textObj[letter].onSegment.slice(4)) - 1;
          wordArr[bodyIndex] = textObj[letter].text;
        }
      }
      const submittedWord = wordArr.join("");
      // Send submittedWord to the server with socket,io
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
