import Phaser from "phaser";
import head from "../assets/head-smaller.png";
import obama from "../assets/obama.png";
import body from "../assets/body-resized.png";
import p2Head from "../assets/p2-head-smaller.png";
import background from "../assets/whitehouse.png";
import blueButton1 from "../assets/ui/blue_button02.png";
import blueButton2 from "../assets/ui/blue_button03.png";
import checkedBox from "../assets/ui/blue_boxCheckmark.png";
import box from "../assets/ui/grey_box.png";
// import bgMusic from ["../assets/wiggle.mp3"];

//****************************************** */
//Hey James! We now have access to any photos were taken
//with webcam as >>>>>this.game.react.state.photoSet<<<<<<<<
//****************************************** */

import { vowelArray, consonantArray } from "../refObjs.js";

//You can access the state of ReactGameHolder.jsx with `this.game.react.state`.

//You can access the socket anywhere inside the component below, using `this.game.react.state.socket`.
//I (Chris) suggest that in this file we use the socket for all the in-game stuff.

let socket; // This looks weird but is correct, because we want to declare the socket variable here, but we can't yet initialise it with a value.
let isP1 = false;
let isP2 = false;
let p1Name = null;
let p2Name = null;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.gameState = {
      wormWordArr: [" ", " ", " ", " ", " ", " "],
      opponentsArr: [" ", " ", " ", " ", " ", " "],
      opponents: {},
      text: {},

      scores: {},
    };
  }

  preload() {
    console.log("in phaser PRELOAD");
    console.log(this.game.react.state.photoSet);
    socket = this.game.react.state.socket;
    isP1 = this.game.react.state.isP1;
    isP2 = this.game.react.state.isP2;
    p1Name = this.game.react.state.playersDetails.p1.username;
    p2Name = this.game.react.state.playersDetails.p2.username;
    this.load.image("head", head);
    this.load.image("body", body);
    this.load.image("p2Head", p2Head);
    this.load.image("background", background);
    this.load.image("blueButton1", blueButton1);
    this.load.image("blueButton2", blueButton2);
    this.load.image("checkedBox", checkedBox);
    this.load.image("box", box);
    // this.load.audio("bgMusic", ["src/assets/wiggle.mp3"]);
  }

  create() {
    const { opponents, opponentsArr } = this.gameState;

    console.log("in phaser CREATE");

    const scene = this; // scene variable makes 'this' available anywhere within the create function

    //adding a background image, the 400 & 300 are the scale so no need to change that when we update the image
    let bg = this.add.image(400, 300, "background");
    bg.displayHeight = this.sys.game.config.height;
    bg.displayWidth = this.sys.game.config.width;

    this.gameState.body6 = this.physics.add.image(400, 125, "body");
    this.gameState.body5 = this.physics.add.image(400, 125, "body");
    this.gameState.body4 = this.physics.add.image(400, 125, "body");
    this.gameState.body3 = this.physics.add.image(400, 125, "body");
    this.gameState.body2 = this.physics.add.image(400, 125, "body");
    this.gameState.body1 = this.physics.add.image(400, 125, "body");
    this.gameState.head = this.physics.add.image(400, 125, "head");

    this.gameState.p2Body6 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body5 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body4 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body3 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body2 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body1 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Head = this.physics.add.image(600, 300, "p2Head");

    //variables for destination
    this.gameState.head.xDest = 400;
    this.gameState.head.yDest = 150;
    this.gameState.head.count = 0;
    this.gameState.head.body.collideWorldBounds = true;

    this.gameState.p2Head.xDest = 400;
    this.gameState.p2Head.yDest = 150;
    this.gameState.p2Head.count = 0;
    this.gameState.p2Head.body.collideWorldBounds = true;

    //Create letter styling
    const wordTileStyle = {
      font: "35px Arial",
      fill: "#007300",
      align: "center",
      padding: { top: 4 },
    };

    // create a text block for each part of the array
    opponentsArr.forEach((char, i) => {
      const n = i + 1;
      this.gameState.opponents[`opponent${n}`] = this.add.text(
        -50,
        -50,
        char,
        wordTileStyle
      );
    });

    //letter array so the random letter generation can pick from it

    // Create a text object and put 6 random letters within it (with styling)

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
      const char = Phaser.Math.RND.pick(num < 5 ? vowelArray : consonantArray);
      this.gameState.text[`letter${num}`] = this.add.text(
        letterTileSpecifications[num].x,
        letterTileSpecifications[num].y,
        char,
        wordTileStyle
      );
      this.gameState.text[`letter${num}`].value = char;
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
      if (isP1 === true) {
        for (const objectKey in this.gameState) {
          if (/body\d/g.test(objectKey) === true) {
            const bodyPart = this.gameState[objectKey];
            bodyPart.hasLetter = false;
            bodyPart.setInteractive();

            this.physics.add.overlap(thisLetter, bodyPart, function () {
              if (
                thisLetter.onSegment === null &&
                bodyPart.hasLetter === false
              ) {
                thisLetter.onSegment = objectKey; //'objectKey' is the name/key of the body part
                bodyPart.hasLetter = true;
              }
            });
          } else if (/p2Body\d/g.test(objectKey) === true) {
            const bodyPart = this.gameState[objectKey];
            bodyPart.setOrigin(0.3, 0.1);
          }
        }
      } else if (isP2 === true) {
        for (const objectKey in this.gameState) {
          if (/p2Body\d/g.test(objectKey) === true) {
            const bodyPart = this.gameState[objectKey];
            bodyPart.hasLetter = false;
            bodyPart.setInteractive();

            this.physics.add.overlap(thisLetter, bodyPart, function () {
              if (
                thisLetter.onSegment === null &&
                bodyPart.hasLetter === false
              ) {
                thisLetter.onSegment = objectKey; //'objectKey' is the name/key of the body part
                bodyPart.hasLetter = true;
              }
            });
          } else if (/body\d/g.test(objectKey) === true) {
            const bodyPart = this.gameState[objectKey];
            bodyPart.setOrigin(0.3, 0.1);
          }
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
        } else {
          const n = this.onSegment.split("ody")[1];
          const indexOfChar = n - 1;
          socket.emit("playerChangesLetter", {
            index: indexOfChar,
            character: this.value,
          });
        }
      });
    }

    //listening for changes in player array
    socket.on("opponentUpdates", function (data) {
      opponentsArr.splice(data.index, 1, data.character);
      opponentsArr.forEach((char, i) => {
        const n = i + 1;
        opponents[`opponent${n}`].setText(char);
      });
    });

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
      this.scene.gameState.sendWord(
        this.scene.gameState.text,
        this.scene.gameState.wormWordArr,
        this.scene.game.react.state.socket,
        this.hasBeenPressed
      );
    });

    this.gameState.sendWord = function (
      allLettersObj,
      wormWordArr,
      socket,
      submitBtnPressed
    ) {
      let wordArr = wormWordArr.map((el) => (el = " "));
      for (const letter in allLettersObj) {
        if (allLettersObj[letter].onSegment !== null) {
          const bodyIndex = isP1
            ? Number(allLettersObj[letter].onSegment.slice(4)) - 1
            : Number(allLettersObj[letter].onSegment.slice(6)) - 1;
          console.log(bodyIndex);
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

    this.model = this.sys.game.globals.model;

    // if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
    //   this.bgMusic = this.sound.add("bgMusic", { volume: 0.5, loop: true });
    //   this.bgMusic.play();
    //   this.model.bgMusicPlaying = true;
    //   this.sys.game.globals.bgMusic = this.bgMusic;
    // }

    const scoreStyle = {
      font: "35px Arial",
      align: "center",
      stroke: "#000000",
      strokeThickness: 5,
    };

    const finalScoreStyle = {
      font: "45px Arial",
      color: "#cc0000",
      align: "center",
      stroke: "#000000",
      strokeThickness: 10,
    };

    this.gameState.displayScore = function (scoreObj, isCurrentPlayer) {
      const opponentName = isP1 === true ? p2Name : p1Name;
      if (isCurrentPlayer === true) {
        this.scores.currentPlayer = scoreObj;

        if (scoreObj.isValid === false) {
          this.scores.currentPlayerText = scene.add.text(
            250,
            400,
            [`Oh no! ${scoreObj.word} isn't a word!`, `You get no points!`],
            scoreStyle
          );
        } else {
          this.scores.currentPlayerText = scene.add.text(
            300,
            400,
            [`You said ${scoreObj.word}!`, `That's ${scoreObj.points} points!`],
            scoreStyle
          );
        }
      } else {
        this.scores.opponent = scoreObj;
        if (scoreObj.isValid === false) {
          this.scores.opponentText = scene.add.text(
            200,
            400,
            [
              `Ha ha! ${opponentName} said ${scoreObj.word}.`,
              `That's not a word stupid!`,
            ],
            scoreStyle
          );
        } else {
          this.scores.opponentText = scene.add.text(
            250,
            400,
            [
              `${opponentName} said ${scoreObj.word}!`,
              `They scored ${scoreObj.points} points!`,
            ],
            scoreStyle
          );
        }
      }
      if (
        this.scores.currentPlayer !== undefined &&
        this.scores.opponent !== undefined
      ) {
        scene.time.delayedCall(2000, this.showFinalScores, [
          this.scores,
          opponentName,
        ]);
      }
    };

    this.gameState.showFinalScores = function (scoresObj, opponentName) {
      if (scoresObj.currentPlayer.points > scoresObj.opponent.points) {
        this.finalScoreText = scene.add.text(
          200,
          200,
          [
            `You win with ${scoresObj.currentPlayer.word}!`,
            `What a great word!`,
          ],
          finalScoreStyle
        );
      } else if (scoresObj.currentPlayer.points < scoresObj.opponent.points) {
        this.finalScoreText = scene.add.text(
          100,
          200,
          [
            `Oh no ${opponentName} won with ${scoresObj.opponent.word}!`,
            `I hate that word!`,
          ],
          finalScoreStyle
        );
      } else {
        this.finalScoreText = scene.add.text(
          50,
          200,
          [
            `A drawer?!?! Now no-ones happy!`,
            `I think your word ${scoresObj.currentPlayer.word} was better`,
          ],
          finalScoreStyle
        );
      }
    };

    // this.model = this.sys.game.globals.model;

    // this.musicButton = this.add.image(130, 585, "checkedBox");
    // this.musicButton.setScale(0.5);
    // this.musicText = this.add.text(150, 578, "Music Enabled", { fontSize: 24 });
    // this.musicText.setScale(0.75);
    // this.musicButton.setInteractive();

    // this.musicButton.on(
    //   "pointerdown",
    //   function () {
    //     this.model.musicOn = !this.model.musicOn;
    //     this.updateAudio();
    //   }.bind(this)
    // );

    // this.updateAudio();

    this.game.react.state.socket.on("word checked", function (scoreObj) {
      const isCurrentPlayer = true;
      scene.gameState.displayScore(scoreObj, isCurrentPlayer);
    });

    this.game.react.state.socket.on("opponent score", function (scoreObj) {
      const isCurrentPlayer = false;
      scene.gameState.displayScore(scoreObj, isCurrentPlayer);
    });

    this.game.react.state.socket.on("api error", function (error) {
      console.log("Error:", error.status, error.message);
      scene.gameState.errMessage = scene.add.text(
        250,
        250,
        `OH NO! API ERROR: ${error.status} ${error.message}`,
        {
          font: "35px Arial",
          color: "#f00000",
          align: "center",
        }
      );
    });
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
      p2Head,
      p2Body1,
      p2Body2,
      p2Body3,
      p2Body4,
      p2Body5,
      p2Body6,
    } = this.gameState;
    const {
      opponent1,
      opponent2,
      opponent3,
      opponent4,
      opponent5,
      opponent6,
    } = this.gameState.opponents;

    // Update Player Name(s)
    if (p1Name !== this.game.react.state.playersDetails.p1.username) {
      p1Name = this.game.react.state.playersDetails.p1.username;
    }

    if (p2Name !== this.game.react.state.playersDetails.p2.username) {
      p2Name = this.game.react.state.playersDetails.p2.username;
    }

    console.log("in phaser UPDATE");

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
      if (head.xDest - head.x > 0 && head.xDest - head.x < 50) {
        head.xDest += Math.floor(Math.random() * 100 + 50);
      } else if (head.xDest - head.x <= 0 && head.xDest - head.x > -50) {
        head.xDest += Math.floor(Math.random() * 100 + 50);
      }

      if (head.yDest - head.y > 0 && head.yDest - head.y < 50) {
        head.yDest += Math.floor(Math.random() * 100 + 50);
      } else if (head.yDest - head.x <= 0 && head.yDest - head.x > -50) {
        head.yDest += Math.floor(Math.random() * 100 + 50);
      }

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

    // Fades out player scores after 3 seconds
    if (this.gameState.scores.currentPlayerText !== undefined) {
      this.time.delayedCall(
        2500,
        function () {
          this.tweens.add({
            targets: this.gameState.scores.currentPlayerText,
            alpha: 0,
            duration: 500,
            ease: "Power 2",
          });
        },
        null,
        this
      );
    }

    if (this.gameState.scores.opponentText !== undefined) {
      this.time.delayedCall(
        2500,
        function () {
          this.tweens.add({
            targets: this.gameState.scores.opponentText,
            alpha: 0,
            duration: 500,
            ease: "Power 2",
          });
        },
        null,
        this
      );
    }

    if (p2Head.count === 0) {
      p2Head.xDest = Math.floor(Math.random() * 800);
      p2Head.yDest = Math.floor(Math.random() * 600);
      if (p2Head.xDest - p2Head.x > 0 && p2Head.xDest - p2Head.x < 50) {
        p2Head.xDest += Math.floor(Math.random() * 100 + 50);
      } else if (
        p2Head.xDest - p2Head.x <= 0 &&
        p2Head.xDest - p2Head.x > -50
      ) {
        p2Head.xDest += Math.floor(Math.random() * 100 + 50);
      }

      if (p2Head.yDest - p2Head.y > 0 && p2Head.yDest - p2Head.y < 50) {
        p2Head.yDest += Math.floor(Math.random() * 100 + 50);
      } else if (
        p2Head.yDest - p2Head.x <= 0 &&
        p2Head.yDest - p2Head.x > -50
      ) {
        p2Head.yDest += Math.floor(Math.random() * 100 + 50);
      }

      this.physics.moveTo(p2Head, p2Head.xDest, p2Head.yDest, 60, 60, 60);

      p2Head.count = 300;
    }
    p2Head.rotation = this.physics.accelerateTo(
      p2Head,
      p2Head.xDest,
      p2Head.yDest,
      60,
      60,
      60
    );
    this.physics.moveTo(p2Body1, p2Head.x, p2Head.y, 60, 750, 750);
    this.physics.moveTo(p2Body2, p2Body1.x, p2Body1.y, 60, 750, 750);
    this.physics.moveTo(p2Body3, p2Body2.x, p2Body2.y, 60, 750, 750);
    this.physics.moveTo(p2Body4, p2Body3.x, p2Body3.y, 60, 750, 750);
    this.physics.moveTo(p2Body5, p2Body4.x, p2Body4.y, 60, 750, 750);
    this.physics.moveTo(p2Body6, p2Body5.x, p2Body5.y, 60, 750, 750);
    if (p2Head.count > 0) {
      p2Head.count--;
    }

    if (isP1 === true) {
      opponent1.x = p2Body1.x;
      opponent1.y = p2Body1.y;
      opponent2.x = p2Body2.x;
      opponent2.y = p2Body2.y;
      opponent3.x = p2Body3.x;
      opponent3.y = p2Body3.y;
      opponent4.x = p2Body4.x;
      opponent4.y = p2Body4.y;
      opponent5.x = p2Body5.x;
      opponent5.y = p2Body5.y;
      opponent6.x = p2Body6.x;
      opponent6.y = p2Body6.y;
    } else if (isP2 === true) {
      opponent1.x = body1.x;
      opponent1.y = body1.y;
      opponent2.x = body2.x;
      opponent2.y = body2.y;
      opponent3.x = body3.x;
      opponent3.y = body3.y;
      opponent4.x = body4.x;
      opponent4.y = body4.y;
      opponent5.x = body5.x;
      opponent5.y = body5.y;
      opponent6.x = body6.x;
      opponent6.y = body6.y;
    }
  }

  // updateAudio() {
  //   if (this.model.musicOn === false) {
  //     this.musicButton.setTexture("box");
  //     this.sys.game.globals.bgMusic.stop();
  //     this.model.bgMusicPlaying = false;
  //   } else {
  //     this.musicButton.setTexture("checkedBox");
  //     if (this.model.bgMusicPlaying === false) {
  //       this.sys.game.globals.bgMusic.play();
  //       this.model.bgMusicPlaying = true;
  //     }
  //   }
  // }
}
