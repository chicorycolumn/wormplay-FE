import Phaser from "phaser";
import p1HeadHappy from "../assets/p1-default-head/p1-face-default.png";
import p1HeadSad from "../assets/p1-default-head/p1-face-sad.png";
import p1HeadAngry from "../assets/p1-default-head/p1-face-angry.png";
import p1HeadShocked from "../assets/p1-default-head/p1-face-shocked.png";
import p2HeadHappy from "../assets/p2-default-head/p2-face-happy.png";
import p2HeadSad from "../assets/p2-default-head/p2-face-sad.png";
import p2HeadAngry from "../assets/p2-default-head/p2-face-angry.png";
import p2HeadShocked from "../assets/p2-default-head/p2-face-shocked.png";

import body from "../assets/body-resized.png";
import p2Head from "../assets/p2-head-smaller.png";
import background from "../assets/whitehouse.png";
import blueButton1 from "../assets/ui/blue_button02.png";
import blueButton2 from "../assets/ui/blue_button03.png";
import checkedBox from "../assets/ui/blue_boxCheckmark.png";
import box from "../assets/ui/grey_box.png";

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
let shouldIBotherPlayingMusic = false; //TOGGLE DURING DEVELOPMENT
let scene;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.gameState = {
      wormWordArr: [" ", " ", " ", " ", " ", " "],
      opponentsArr: [" ", " ", " ", " ", " ", " "],
      opponents: {},
      text: {},
      scores: {},
      wantsNewGame: null,
      roundsWon: { p1: 0, p2: 0 },
      timer: { p1: 0, p2: 0 },
    };
  }

  preload() {
    scene = this; // scene variable makes 'this' available anywhere within the game
    socket = this.game.react.state.socket;
    isP1 = this.game.react.state.isP1;
    isP2 = this.game.react.state.isP2;

    p1Name = this.game.react.state.currentRoom.p1.username;
    p2Name = this.game.react.state.currentRoom.p2.username;
    this.gameState.scores = {}; // Resets scores every <round></round> ***************

    this.gameState.wantsNewGame = { p1: false, p2: false };
    this.load.image("head", p1HeadHappy);
    this.load.image("p1HeadShocked", p1HeadShocked);
    this.load.image("body", body);
    this.load.image("p2Head", p2HeadHappy);
    this.load.image("p2HeadShocked", p2HeadShocked);
    this.load.image("background", background);
    this.load.image("blueButton1", blueButton1);
    this.load.image("blueButton2", blueButton2);
    this.load.image("checkedBox", checkedBox);
    this.load.image("box", box);
    if (shouldIBotherPlayingMusic) {
      this.load.audio("bgMusic", ["src/assets/wiggle.mp3"]);
    }
  }

  create() {
    const { opponents, opponentsArr, timer, roundsWon } = this.gameState;

    // Resets count of rounds won when in new game
    if (roundsWon.p1 === 3 || roundsWon.p2 === 3) {
      roundsWon.p1 = 0;
      roundsWon.p2 = 0;
    }

    //adding a background image, the 400 & 300 are the scale so no need to change that when we update the image
    let bg = this.add.image(400, 300, "background");
    bg.displayHeight = this.sys.game.config.height;
    bg.displayWidth = this.sys.game.config.width;

    this.gameState.body6 = this.physics.add.image(400, 125, "body");
    this.gameState.body6.index = 5;
    this.gameState.body5 = this.physics.add.image(400, 125, "body");
    this.gameState.body5.index = 4;
    this.gameState.body4 = this.physics.add.image(400, 125, "body");
    this.gameState.body4.index = 3;
    this.gameState.body3 = this.physics.add.image(400, 125, "body");
    this.gameState.body3.index = 2;
    this.gameState.body2 = this.physics.add.image(400, 125, "body");
    this.gameState.body2.index = 1;
    this.gameState.body1 = this.physics.add.image(400, 125, "body");
    this.gameState.body1.index = 0;
    this.gameState.head = this.physics.add.image(400, 125, "head");
    this.gameState.p1HeadShocked = this.add.image(400, 125, "p1HeadShocked");
    this.gameState.p1HeadShocked.setVisible(false);

    this.gameState.p2Body6 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body6.index = 5;
    this.gameState.p2Body5 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body5.index = 4;
    this.gameState.p2Body4 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body4.index = 3;
    this.gameState.p2Body3 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body3.index = 2;
    this.gameState.p2Body2 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body2.index = 1;
    this.gameState.p2Body1 = this.physics.add.image(600, 300, "body");
    this.gameState.p2Body1.index = 0;
    this.gameState.p2Head = this.physics.add.image(600, 300, "p2Head");
    this.gameState.p2HeadShocked = this.add.image(600, 300, "p2HeadShocked");
    this.gameState.p2HeadShocked.setVisible(false);

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
          }
        }
      } else if (isP2 === true) {
        for (const objectKey in this.gameState) {
          if (/p2Body\d/g.test(objectKey) === true) {
            const bodyPart = this.gameState[objectKey];
            bodyPart.hasLetter = false;
            bodyPart.setInteractive();
            console.log(this.gameState[objectKey]);
            console.log(this.gameState[objectKey].hasLetter);

            this.physics.add.overlap(thisLetter, bodyPart, function () {
              if (
                thisLetter.onSegment === null &&
                bodyPart.hasLetter === false
              ) {
                thisLetter.onSegment = objectKey; //'objectKey' is the name/key of the body part
                bodyPart.hasLetter = true;
              }
            });
          }
        }
      }

      // Make letters draggable
      thisLetter.setInteractive();

      this.input.setDraggable(thisLetter);

      thisLetter.on("dragstart", function (pointer) {
        this.body.enable = true;
        this.setTint(0xff0000);
        if (this.onSegment !== null) {
          const n = this.onSegment.split("ody")[1];
          const indexOfChar = n - 1;
          this.scene.gameState.wormWordArr.splice(indexOfChar, 1, " ");
          socket.emit("playerChangesLetter", {
            array: this.scene.gameState.wormWordArr,
          });
        }
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
        console.log(this);
        if (this.onSegment === null) {
          this.x = startX;
          this.y = startY;
          this.body.enable = false;
          this.body.x = startX;
          this.body.y = startY;
        } else {
          const n = this.onSegment.split("ody")[1];
          const indexOfChar = n - 1;
          this.scene.gameState.wormWordArr.splice(indexOfChar, 1, this.value);
          if (isP1 === true) {
            for (const objectKey in this.scene.gameState) {
              if (
                /body\d/g.test(objectKey) === true &&
                this.scene.gameState[objectKey].hasLetter === false
              ) {
                const index = this.scene.gameState[objectKey].index;
                this.scene.gameState.wormWordArr.splice(index, 1, " ");
              }
            }
          } else if (isP2 === true) {
            for (const objectKey in this.scene.gameState) {
              if (
                /p2Body\d/g.test(objectKey) === true &&
                this.scene.gameState[objectKey].hasLetter === false
              ) {
                console.log(this.scene.gameState[objectKey]);
                const index = this.scene.gameState[objectKey].index;
                this.scene.gameState.wormWordArr.splice(index, 1, " ");
              }
            }
          }
          socket.emit("playerChangesLetter", {
            array: this.scene.gameState.wormWordArr,
          });
        }
      });
    }

    //listening for changes in player array
    socket.on("opponentUpdates", function (data) {
      for (let i = 0; i < opponentsArr.length; i++) {
        opponentsArr[i] = data.array[i];
        const n = i + 1;
        opponents[`opponent${n}`].setText(opponentsArr[i]);
      }
      if (isP1 === true) {
        timer.p1 = 20;
      } else if (isP2 === true) {
        timer.p2 = 20;
      }
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

    // Permanent quit button
    this.lobbyBtn = this.add.sprite(750, 585, "blueButton1").setInteractive();
    this.lobbyBtn.setScale(0.5);
    this.lobbyText = this.add.text(0, 0, "Lobby", {
      fontSize: "20px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);

    this.lobbyBtn.on(
      "pointerdown",
      function (pointer) {
        this.lobbyBtn = this.add
          .sprite(750, 585, "blueButton2")
          .setInteractive();
        this.lobbyBtn.setScale(0.5);
        this.lobbyText = this.add.text(0, 0, "Lobby", {
          fontSize: "20px",
          fill: "#fff",
        });
        Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);
      }.bind(this)
    );

    this.menuButton.on(
      "pointerup",
      function (pointer) {
        // GO TO LOBBY
      }.bind(this)
    );

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
      this.setTint(0xffbf00);
      this.y = originalBtnY;
      this.hasBeenPressed = true;
      this.scene.gameState.sendWord(
        this.scene.gameState.text,
        this.scene.gameState.wormWordArr,
        this.scene.game.react.state.socket,
        this.hasBeenPressed
      );
      this.disableInteractive();
    });


      let wordArr = this.scene.gameState.wormWordArr.map((el) => (el = " "));
      let allLettersObj = this.scene.gameState.text;

      for (const letter in allLettersObj) {
        if (allLettersObj[letter].onSegment !== null) {
          const bodyIndex = isP1
            ? Number(allLettersObj[letter].onSegment.slice(4)) - 1
            : Number(allLettersObj[letter].onSegment.slice(6)) - 1;
          wordArr[bodyIndex] = allLettersObj[letter].text;
        }
      }
      if (!wordArr.every((letter) => letter === " ")) {
        this.hasBeenPressed = true;
        this.scene.gameState.sendWord(
          wordArr,
          this.scene.game.react.state.socket,
          this.hasBeenPressed
        );
      }
    });

    this.gameState.sendWord = function (wordArr, socket, submitBtnPressed) {
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

    if (
      shouldIBotherPlayingMusic &&
      this.model.musicOn === true &&
      this.model.bgMusicPlaying === false
    ) {
      this.bgMusic = this.sound.add("bgMusic", { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }

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

    const roundScoreStyle = {
      font: "45px Arial",
      color: "#cc0000",
      align: "center",
      stroke: "#000000",
      strokeThickness: 10,
    };

    const finalScoreStyle = {
      font: "50px Arial",
      color: "#ffef00",
      align: "center",
      stroke: "#000000",
      strokeThickness: 10,
    };

    this.gameState.displayScore = function (scoreObj, isCurrentPlayer) {
      const opponentName = isP1 === true ? p2Name : p1Name;
      if (this.scoreText !== undefined) {
        this.scoreText.destroy();
      }

      if (isCurrentPlayer === true) {
        this.scores.currentPlayer = scoreObj;

        if (scoreObj.isValid === false) {
          this.scoreText = scene.add.text(
            250,
            400,
            [`Oh no! ${scoreObj.word} isn't a word!`, `You get no points!`],
            scoreStyle
          );
        } else {
          this.scoreText = scene.add.text(
            300,
            400,
            [
              `You said ${scoreObj.word}!`,
              `${scoreObj.pointsArray.join(" + ")}`,
              `makes ${scoreObj.points} points!`,
            ],
            scoreStyle
          );
        }
      } else {
        this.scores.opponent = scoreObj;
        if (scoreObj.isValid === false) {
          this.scoreText = scene.add.text(
            200,
            400,
            [
              `Ha ha! ${opponentName} said ${scoreObj.word}.`,
              `That's not a word stupid!`,
            ],
            scoreStyle
          );
        } else {
          this.scoreText = scene.add.text(
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
      // Fades out player scores after 3 second
      scene.time.delayedCall(2500, function () {
        scene.tweens.add({
          targets: scene.gameState.scoreText,
          alpha: 0,
          duration: 500,
          ease: "Power 2",
        });
      });
      if (
        this.scores.currentPlayer !== undefined &&
        this.scores.opponent !== undefined
      ) {
        scene.time.delayedCall(2000, this.showRoundWinner, [
          this.scores,
          opponentName,
        ]);
        scene.gameState.scores = {};
      }
    };

    this.gameState.showRoundWinner = function (scoreObj, opponentName) {
      if (scoreObj.currentPlayer.points > scoreObj.opponent.points) {
        this.roundWinnerText = scene.add.text(
          200,
          200,
          [
            `You win with ${scoreObj.currentPlayer.word}!`,
            `What a great word!`,
          ],
          roundScoreStyle
        );
        const winner = isP1 === true ? "p1" : "p2";
        roundsWon[winner] += 1;
        socket.emit("update rounds", roundsWon);
      } else if (scoreObj.currentPlayer.points < scoreObj.opponent.points) {
        this.roundWinnerText = scene.add.text(
          150,
          200,
          [
            `Oh no, ${opponentName} won with ${scoreObj.opponent.word}!`,
            `I hate that word!`,
          ],
          roundScoreStyle
        );
      } else {
        this.roundWinnerText = scene.add.text(
          50,
          200,
          [
            `A drawer?!?! Now no-ones happy!`,
            `I think your word ${scoreObj.currentPlayer.word} was better`,
          ],
          roundScoreStyle
        );
        socket.emit("update rounds", roundsWon);
      }
    };

    this.gameState.showFinalWinner = function (amIWinner) {
      // this.roundWinnerText.destroy(); -- sort this, not working

      const thisPlayerName = isP1 ? p1Name : p2Name;
      const opponentName = isP1 ? p2Name : p1Name;

      this.newGameBtn.setVisible(true);
      this.newGameText.setVisible(true);
      this.quitBtn.setVisible(true);
      this.quitText.setVisible(true);

      if (amIWinner === true) {
        this.gameState.finalWinnerText = scene.add.text(
          200,
          70,
          [`Well Done ${thisPlayerName}!`, `You Won!`],
          finalScoreStyle
        );
      } else {
        this.gameState.finalWinnerText = scene.add.text(
          200,
          70,
          [`Oh no ${opponentName} Won!`, `I'm sorry.`],
          finalScoreStyle
        );
      }
    };

    this.model = this.sys.game.globals.model;

    this.musicButton = this.add.image(130, 585, "checkedBox");
    this.musicButton.setScale(0.5);
    this.musicText = this.add.text(150, 578, "Music Enabled", {
      fontSize: 24,
    });
    this.musicText.setScale(0.75);
    this.musicButton.setInteractive();

    this.musicButton.on(
      "pointerdown",
      function () {
        this.model.musicOn = !this.model.musicOn;
        this.updateAudio();
      }.bind(this)
    );

    if (shouldIBotherPlayingMusic) {
      this.updateAudio();
    }

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
        150,
        250,
        [`OH NO! API ERROR:`, `${error.status} ${error.message}`],
        roundScoreStyle
      );
    });

    socket.on("new game request", function (opponentInfo) {
      scene.gameState.wantsNewGame[opponentInfo.player] = true;
      scene.gameState.newGameText = scene.add.text(
        100,
        400,
        `Uh oh! ${opponentInfo.name} wants a re-match. Do you?`,
        scoreStyle
      );
    });

    socket.on("start new game", function () {
      scene.scene.start("MainScene");
    });

    socket.on("set new rounds", function (newRounds) {
      scene.gameState.roundsWon = newRounds;
      scene.gameState.displayRounds(scene.gameState.roundsWon);

      if (newRounds.p1 === 3) {
        const didIWin = isP1 ? true : false;
        scene.gameState.showFinalWinner(didIWin);
      } else if (newRounds.p2 === 3) {
        const didIWin = isP1 ? false : true;
        scene.gameState.showFinalWinner(didIWin);
      } else {
        // Add countdown on screen
        scene.time.delayedCall(3000, function () {
          scene.scene.start("MainScene");
        });
      }
    });

    this.gameState.newGameBtn = this.add
      .sprite(300, 350, "blueButton1")
      .setInteractive();
    this.gameState.newGameBtn.setScale(0.8);
    this.gameState.newGameText = this.add.text(0, 0, "Rematch", {
      fontSize: "20px",
      fill: "#fff",
      align: "center",
    });
    Phaser.Display.Align.In.Center(
      this.gameState.newGameText,
      this.gameState.newGameBtn
    );

    this.gameState.newGameBtn.on(
      "pointerdown",
      function (pointer) {
        this.gameState.newGameBtn.setScale(0.8);
        this.gameState.newGameText = this.add.text(0, 0, "Rematch", {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        });
        Phaser.Display.Align.In.Center(
          this.gameState.newGameText,
          this.gameState.newGameBtn
        );
      }.bind(this)
    );

    this.gameState.newGameBtn.on(
      "pointerout",
      function (pointer) {
        this.gameState.newGameBtn = this.add.sprite(300, 350, "blueButton1");

        this.gameState.newGameBtn.setScale(0.8);
        this.gameState.newGameText = this.add.text(0, 0, "Rematch", {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        });
        Phaser.Display.Align.In.Center(
          this.gameState.newGameText,
          this.gameState.newGameBtn
        );
      }.bind(this)
    );

    this.gameState.newGameBtn.on(
      "pointerup",
      function (pointer) {
        isP1 === true
          ? (this.gameState.wantsNewGame.p1 = true)
          : (this.gameState.wantsNewGame.p2 = true);
        if (
          this.gameState.wantsNewGame.p1 === true &&
          this.gameState.wantsNewGame.p2 === true
        ) {
          socket.emit("new game");
        } else {
          socket.emit("make new game request", {
            name: isP1 === true ? p1Name : p2Name,
            player: isP1 === true ? "p1" : "p2",
          });
          scene.gameState.newGameText = scene.add.text(
            150,
            400,
            [
              `You asked ${isP1 === true ? p2Name : p1Name} for a re-match!`,
              `Are they brave enough?`,
            ],
            scoreStyle
          );
        }
        this.gameState.newGameBtn = this.add.sprite(300, 350, "blueButton1");

        this.gameState.newGameBtn.setScale(0.8);
        this.gameState.newGameText = this.add.text(0, 0, "Rematch", {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        });
        Phaser.Display.Align.In.Center(
          this.gameState.newGameText,
          this.gameState.newGameBtn
        );
      }.bind(this)
    );

    this.gameState.newGameBtn.setVisible(false);
    this.gameState.newGameText.setVisible(false);

    this.gameState.quitBtn = this.add
      .sprite(500, 350, "blueButton1")
      .setInteractive();
    this.gameState.quitBtn.setScale(0.8);
    this.gameState.quitText = this.add.text(0, 0, "Quit", {
      fontSize: "20px",
      fill: "#fff",
      align: "center",
    });

    Phaser.Display.Align.In.Center(
      this.gameState.quitText,
      this.gameState.quitBtn
    );

    this.gameState.quitBtn.on(
      "pointerdown",
      function (pointer) {
        this.gameState.quitBtn = this.add.sprite(500, 350, "blueButton2");

        this.gameState.quitBtn.setScale(0.8);
        this.gameState.quitText = this.add.text(0, 1, "Quit", {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        });
        Phaser.Display.Align.In.Center(
          this.gameState.quitText,
          this.gameState.quitBtn
        );
      }.bind(this)
    );

    this.gameState.quitBtn.on(
      "pointerout",
      function (pointer) {
        this.gameState.quitBtn = this.add.sprite(500, 350, "blueButton1");

        this.gameState.quitBtn.setScale(0.8);
        this.gameState.quitText = this.add.text(0, 0, "Quit", {
          fontSize: "20px",
          fill: "#fff",
          align: "center",
        });
        Phaser.Display.Align.In.Center(
          this.gameState.quitText,
          this.gameState.quitBtn
        );
      }.bind(this)
    );

    this.gameState.quitBtn.on(
      "pointerup",
      function (pointer) {
        this.scene.start("Title");
      }.bind(this)
    );

    this.gameState.quitBtn.setVisible(false);
    this.gameState.quitText.setVisible(false);

    this.gameState.displayRounds = function (currentRounds) {
      if (this.gameState.thisPlayerScore !== undefined) {
        this.gameState.thisPlayerScore.destroy();
      }
      if (this.gameState.oppositionScore !== undefined) {
        this.gameState.oppositionScore.destroy();
      }
      this.gameState.thisPlayerScore = this.add.text(
        650,
        85,
        `YOU: ${isP1 ? currentRounds.p1 : currentRounds.p2}`,
        {
          fontSize: "30px",
          color: "blue",
          strokeThickness: 3,
          fontFamily: "Arial",
        }
      );

      this.gameState.oppositionScore = this.add.text(
        650,
        150,
        `${isP1 ? p2Name : p1Name}: ${
          isP1 ? currentRounds.p2 : currentRounds.p1
        }`,
        {
          fontSize: "30px",
          color: "red",
          stroke: "black",
          strokeThickness: 3,
          fontFamily: "Arial",
        }
      );
    }.bind(this);

    this.gameState.displayRounds(roundsWon);
  }

  update() {
    const {
      head,
      p1HeadShocked,
      timer,
      body1,
      body2,
      body3,
      body4,
      body5,
      body6,
      text,
      p2Head,
      p2HeadShocked,
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
    if (p1Name !== this.game.react.state.currentRoom.p1.username) {
      p1Name = this.game.react.state.currentRoom.p1.username;
    }

    if (p2Name !== this.game.react.state.currentRoom.p2.username) {
      p2Name = this.game.react.state.currentRoom.p2.username;
    }

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
      opponent1.x = p2Body1.x - 28;
      opponent1.y = p2Body1.y - 28;
      opponent2.x = p2Body2.x - 28;
      opponent2.y = p2Body2.y - 28;
      opponent3.x = p2Body3.x - 28;
      opponent3.y = p2Body3.y - 28;
      opponent4.x = p2Body4.x - 28;
      opponent4.y = p2Body4.y - 28;
      opponent5.x = p2Body5.x - 28;
      opponent5.y = p2Body5.y - 28;
      opponent6.x = p2Body6.x - 28;
      opponent6.y = p2Body6.y - 28;

      if (timer.p1 > 0) {
        timer.p1 -= 1;
        head.setVisible(false);
        p1HeadShocked.setVisible(true);
        p1HeadShocked.x = head.x;
        p1HeadShocked.y = head.y;
        if (timer.p1 === 0) {
          head.setVisible(true);
          p1HeadShocked.setVisible(false);
        }
      }
    } else if (isP2 === true) {
      opponent1.x = body1.x - 28;
      opponent1.y = body1.y - 28;
      opponent2.x = body2.x - 28;
      opponent2.y = body2.y - 28;
      opponent3.x = body3.x - 28;
      opponent3.y = body3.y - 28;
      opponent4.x = body4.x - 28;
      opponent4.y = body4.y - 28;
      opponent5.x = body5.x - 28;
      opponent5.y = body5.y - 28;
      opponent6.x = body6.x - 28;
      opponent6.y = body6.y - 28;

      if (timer.p2 > 0) {
        timer.p2 -= 1;
        p2Head.setVisible(false);
        p2HeadShocked.setVisible(true);
        p2HeadShocked.x = p2Head.x;
        p2HeadShocked.y = p2Head.y;
        if (timer.p2 === 0) {
          p2Head.setVisible(true);
          p2HeadShocked.setVisible(false);
        }
      }
    }
  }

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
  }
}
