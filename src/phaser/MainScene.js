import Phaser from "phaser";
import p1HeadHappy from "../assets/p1-default-head/p1-face-default.png";
import p1HeadSad from "../assets/p1-default-head/p1-face-sad.png";
import p1HeadAngry from "../assets/p1-default-head/p1-face-angry.png";
import p1HeadShocked from "../assets/p1-default-head/p1-face-shocked.png";
import p2HeadHappy from "../assets/p2-default-head/p2-face-happy.png";
import p2HeadSad from "../assets/p2-default-head/p2-face-sad.png";
import p2HeadAngry from "../assets/p2-default-head/p2-face-angry.png";
import p2HeadShocked from "../assets/p2-default-head/p2-face-shocked.png";
import enterTheWorm from "../assets/EnterTheWorm.mp3";

import { playerFaces } from "../../public/emotion-rec";
// import body from "../assets/body-resized.png";

import body from "../assets/resizedpinkbody.png";
import body2 from "../assets/bluebodyresized.png";
import background from "../assets/background.png";
import blueButton1 from "../assets/ui/blue_button02.png";
import blueButton2 from "../assets/ui/blue_button03.png";
import checkedBox from "../assets/ui/blue_boxCheckmark.png";
import box from "../assets/ui/grey_box.png";
import { vowelArray, consonantArray } from "../refObjs.js";

let opponentName = null;
let socket; // This looks weird but is correct, because we want to declare the socket variable here, but we can't yet initialise it with a value.
let isP1 = false;
let isP2 = false;
let p1Name = null;
let p2Name = null;
let shouldIBotherPlayingMusic = true; //TOGGLE DURING DEVELOPMENT
let scene;
let lobbyBtnIsDepressed = false;
let setStateCallback = () => {
  console.log("Haven't set SSC fxn in MainScene yet.");
};
let roomID;

const p1Arr = [
  {
    facesKey: "happyFace",
    spriteLabel: "p1HeadHappy",
    image: p1HeadHappy,
  },
  {
    facesKey: "sadFace",
    spriteLabel: "p1HeadSad",
    image: p1HeadSad,
  },
  {
    facesKey: "angryFace",
    spriteLabel: "p1HeadAngry",
    image: p1HeadAngry,
  },
  {
    facesKey: "shockedFace",
    spriteLabel: "p1HeadShocked",
    image: p1HeadShocked,
  },
];

const p2Arr = [
  {
    facesKey: "happyFace",
    spriteLabel: "p2HeadHappy",
    image: p2HeadHappy,
  },
  {
    facesKey: "sadFace",
    spriteLabel: "p2HeadSad",
    image: p2HeadSad,
  },
  {
    facesKey: "angryFace",
    spriteLabel: "p2HeadAngry",
    image: p2HeadAngry,
  },
  {
    facesKey: "shockedFace",
    spriteLabel: "p2HeadShocked",
    image: p2HeadShocked,
  },
];

let myFaces = playerFaces;
let oppFaces = {
  happyFace: null,
  sadFace: null,
  angryFace: null,
  shockedFace: null,
};

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
      timer: { p1: 0, p2: 0, angryP1: 0, angryP2: 0 },
      roundTimer: 30,
      usingMyFace: false,
      awaitingApi: false,

      whoWon: { p1: null, p2: null },
    };
  }

  preload() {
    scene = this; // scene variable makes 'this' available anywhere within the game
    socket = this.game.react.state.socket;
    isP1 = this.game.react.state.isP1;
    isP2 = this.game.react.state.isP2;
    setStateCallback = this.game.react.state.setStateCallback;
    roomID = this.game.react.state.currentRoom.roomID;

    p1Name = this.game.react.state.currentRoom.p1.username;
    p2Name = this.game.react.state.currentRoom.p2.username;
    this.gameState.scores = {}; // Resets scores every <round></round> ***************

    this.gameState.opponentsArr = [" ", " ", " ", " ", " ", " "];

    if (isP1 === true && this.game.react.state.currentRoom.p2.playerFaces) {
      console.log("will update p2 faces cos they just entered");
      oppFaces = this.game.react.state.currentRoom.p2.playerFaces;
    } else if (
      isP2 === true &&
      this.game.react.state.currentRoom.p1.playerFaces
    ) {
      console.log("will update p1 faces cos they just entered");
      oppFaces = this.game.react.state.currentRoom.p1.playerFaces;
    }

    // console.log("P:myFaces", myFaces);
    // console.log("P:oppFaces", oppFaces);

    if (isP1 === true) {
      //I AM PLAYER ONE.
      //Load either my photo, or if that's null, load the emoji.
      p1Arr.forEach((ref) => {
        if (myFaces[ref.facesKey] === null) {
          this.load.image(ref.spriteLabel, ref.image);
        } else {
          this.textures.addBase64(ref.spriteLabel, myFaces[ref.facesKey]);
        }
      });
      //For player two, load my opponent's either photos or emojis.
      p2Arr.forEach((ref) => {
        if (oppFaces[ref.facesKey] === null) {
          this.load.image(ref.spriteLabel, ref.image);
        } else {
          this.textures.addBase64(ref.spriteLabel, oppFaces[ref.facesKey]);
        }
      });
    } else if (isP2 === true) {
      //I AM PLAYER TWO ACTUALLY.
      //Load either my photo, or if that's null, load the emoji.
      p2Arr.forEach((ref) => {
        if (myFaces[ref.facesKey] === null) {
          this.load.image(ref.spriteLabel, ref.image);
        } else {
          this.textures.addBase64(ref.spriteLabel, myFaces[ref.facesKey]);
        }
      });
      //My opponent is player one, so load either their photos or emojis.
      p1Arr.forEach((ref) => {
        if (oppFaces[ref.facesKey] === null) {
          this.load.image(ref.spriteLabel, ref.image);
        } else {
          this.textures.addBase64(ref.spriteLabel, oppFaces[ref.facesKey]);
        }
      });
    }
    this.gameState.wantsNewGame = { p1: false, p2: false };
    this.gameState.roundTimer = 30; // resets timer after every round
    this.load.image("head", body2);
    this.load.image("body", body);

    this.load.image("p2Head", body);
    this.load.image("body2", body2);
    this.load.image("p2Head", p2HeadHappy);
    this.load.image("p2HeadShocked", p2HeadShocked);

    this.load.image("background", background);
    this.load.image("blueButton1", blueButton1);
    this.load.image("blueButton2", blueButton2);
    this.load.image("checkedBox", checkedBox);
    this.load.image("box", box);
    this.load.audio("bgMusic", enterTheWorm);
  }

  create() {
    p1Name = this.game.react.state.currentRoom.p1.username;
    p2Name = this.game.react.state.currentRoom.p2.username;
    const {
      opponents,
      opponentsArr,
      timer,
      roundsWon,
      whoWon,
    } = this.gameState;

    // Resets count of rounds won when in new game
    if (roundsWon.p1 === 3 || roundsWon.p2 === 3) {
      roundsWon.p1 = 0;
      roundsWon.p2 = 0;
    }

    //adding a background image, the 400 & 300 are the scale so no need to change that when we update the image
    // https://www.vecteezy.com/free-vector/grass >> Grass Vectors by Vecteezy
    let bg = this.add.image(400, 300, "background");
    bg.displayHeight = this.sys.game.config.height;
    bg.displayWidth = this.sys.game.config.width;

    this.gameState.body6 = this.physics.add.image(400, 125, "body2");
    this.gameState.body6.index = 5;

    this.gameState.body5 = this.physics.add.image(400, 125, "body2");
    this.gameState.body5.index = 4;

    this.gameState.body4 = this.physics.add.image(400, 125, "body2");
    this.gameState.body4.index = 3;

    this.gameState.body3 = this.physics.add.image(400, 125, "body2");
    this.gameState.body3.index = 2;

    this.gameState.body2 = this.physics.add.image(400, 125, "body2");
    this.gameState.body2.index = 1;

    this.gameState.body1 = this.physics.add.image(400, 125, "body2");
    this.gameState.body1.index = 0;

    this.gameState.head = this.physics.add.image(400, 125, "head");
    this.gameState.head.setVisible(false);
    this.gameState.p1HeadHappy = this.add.image(400, 125, "p1HeadHappy");
    this.gameState.p1HeadShocked = this.add.image(400, 125, "p1HeadShocked");
    this.gameState.p1HeadShocked.setVisible(false);
    this.gameState.p1HeadSad = this.add.image(400, 125, "p1HeadSad");
    this.gameState.p1HeadSad.setVisible(false);
    this.gameState.p1HeadAngry = this.add.image(400, 125, "p1HeadAngry");
    this.gameState.p1HeadAngry.setVisible(false);

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
    this.gameState.p2Head.setVisible(false);
    this.gameState.p2HeadHappy = this.add.image(600, 300, "p2HeadHappy");
    this.gameState.p2HeadShocked = this.add.image(600, 300, "p2HeadShocked");
    this.gameState.p2HeadShocked.setVisible(false);
    this.gameState.p2HeadSad = this.add.image(600, 300, "p2HeadSad");
    this.gameState.p2HeadSad.setVisible(false);
    this.gameState.p2HeadAngry = this.add.image(600, 300, "p2HeadAngry");
    this.gameState.p2HeadAngry.setVisible(false);

    //////Previously these two lines below were only triggered if using photos instead of emojis. Now they always trigger.
    this.gameState.head.setVisible(true); //
    this.gameState.p2Head.setVisible(true); //

    // console.log("C:myFaces", myFaces);
    // console.log("C:oppFaces", oppFaces);

    if (isP1 === true) {
      p1Arr.forEach((ref) => {
        if (myFaces[ref.facesKey]) {
          this.gameState[ref.spriteLabel].setDisplaySize(48, 48);
        }
      });
      p2Arr.forEach((ref) => {
        if (oppFaces[ref.facesKey]) {
          this.gameState[ref.spriteLabel].setDisplaySize(48, 48);
        }
      });
    } else if (isP2 === true) {
      p1Arr.forEach((ref) => {
        if (oppFaces[ref.facesKey]) {
          this.gameState[ref.spriteLabel].setDisplaySize(48, 48);
        }
      });
      p2Arr.forEach((ref) => {
        if (myFaces[ref.facesKey]) {
          this.gameState[ref.spriteLabel].setDisplaySize(48, 48);
        }
      });
    }

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
      // border: "solid",
      align: "center",
      padding: { top: 4 },
      backgroundColor: "#F5ED91",
    };
    const wordTileStyle3 = {
      font: "35px Arial",
      fill: "#007300",
      // border: "solid",
      align: "center",
      padding: { top: 4 },
      // backgroundColor: "#F5ED91",
    };

    const wordTileStyle2 = {
      font: "35px Arial",
      fill: "white",
      align: "center",
      padding: { top: 4 },
    };

    // create a text block for each part of the array HEREEEEEEEEEEEEEEEEEEEEEE
    opponentsArr.forEach((char, i) => {
      const n = i + 1;
      this.gameState.opponents[`opponent${n}`] = this.add.text(
        -50,
        -50,
        char,
        wordTileStyle2
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
      let num = parseInt(n, 10);
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

      thisLetter.on("dragstart", function (pointer) {
        this.body.enable = true;
        this.setTint(0xff0000);
        if (this.onSegment !== null) {
          const n = this.onSegment.split("ody")[1];
          const indexOfChar = n - 1;
          this.scene.gameState.wormWordArr.splice(indexOfChar, 1, " ");
          socket.emit("playerChangesLetter", {
            array: this.scene.gameState.wormWordArr,
            roomID: roomID,
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
            timer.p2 = 20;
            console.log(timer.p2);
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
            timer.p1 = 20;
            for (const objectKey in this.scene.gameState) {
              if (
                /p2Body\d/g.test(objectKey) === true &&
                this.scene.gameState[objectKey].hasLetter === false
              ) {
                const index = this.scene.gameState[objectKey].index;
                this.scene.gameState.wormWordArr.splice(index, 1, " ");
              }
            }
          }
          socket.emit("playerChangesLetter", {
            array: this.scene.gameState.wormWordArr,
            roomID: roomID,
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

    this.gameState.submitBtn = this.add.text(650, 25, "Submit", btnStyle);

    //adding a menu button & setting interactive
    this.menuButton = this.add.sprite(50, 585, "blueButton1").setInteractive();
    this.menuButton.setScale(0.5);
    this.menuText = this.add.text(0, 0, "Credits", {
      fontSize: "20px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.menuText, this.menuButton);

    // Permanent quit button
    this.lobbyBtn = this.add.sprite(750, 585, "blueButton1").setInteractive();
    this.lobbyBtn.setScale(0.5);
    this.lobbyText = this.add.text(0, 0, "Quit", {
      fontSize: "20px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);

    //THIS WAS PREVENTING THE LOBBY BUTTON FROM WORKING
    // this.lobbyBtn.on(
    //   "pointerdown",
    //   function (pointer) {
    //     this.lobbyBtn = this.add
    //       .sprite(750, 585, "blueButton2")
    //       .setInteractive();
    //     this.lobbyBtn.setScale(0.5);
    //     this.lobbyText = this.add.text(0, 0, "Lobby", {
    //       fontSize: "20px",
    //       fill: "#fff",
    //     });
    //     Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);
    //   }.bind(this)
    // );

    this.lobbyBtn.on(
      "pointerup",
      function (pointer) {
        this.lobbyText.destroy();
        this.lobbyBtn.tint = 0x0000b3;
        this.lobbyText = this.add.text(0, 0, "Sure?", {
          fontSize: "20px",
          fill: "#fff",
        });
        Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);

        if (!lobbyBtnIsDepressed) {
          lobbyBtnIsDepressed = true;
          setTimeout(() => {
            this.lobbyText.destroy();
            this.lobbyBtn.tint = 0xffffff;
            this.lobbyText = this.add.text(0, 0, "Quit", {
              fontSize: "20px",
              fill: "#fff",
            });
            Phaser.Display.Align.In.Center(this.lobbyText, this.lobbyBtn);
            lobbyBtnIsDepressed = false;
          }, 2500);
        } else {
          lobbyBtnIsDepressed = false;
          this.sys.game.destroy(true);
          socket.emit("quitRoom");
          setStateCallback("iHavePermissionToEnterRoom", false);
        }
      }.bind(this)
    );

    //adding menu button functionality, on click will take you to credits
    this.menuButton.on(
      "pointerup",
      function (pointer) {
        this.scene.start("Credits");
      }.bind(this)
    );

    const originalBtnY = this.gameState.submitBtn.y;

    this.gameState.submitBtn.on("pointerover", function (event) {
      this.setTint(0xff0000);
    });

    this.gameState.submitBtn.on("pointerout", function (event) {
      this.clearTint();
      this.y = originalBtnY;
    });

    this.gameState.submitBtn.on("pointerdown", function (event) {
      this.setTint(0xdf0101);
      this.y = this.y + 2;
    });

    this.gameState.submitBtn.on("pointerup", function (event) {
      this.clearTint();
      this.y = originalBtnY;

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
        console.log(
          `Just so you know, p1Name is now ${p1Name} and p2Name is ${p2Name}`
        );
        socket.emit("I submitted", {
          username: isP1 ? p1Name : p2Name,
          roomID,
        });
        this.scene.gameState.sendWord(
          wordArr,
          this.scene.game.react.state.socket,
          this.hasBeenPressed
        );
      }
    });

    this.gameState.sendWord = function (wordArr, socket, submitBtnPressed) {
      // if (submitBtnPressed === true) {
      const submittedWord = wordArr.filter((char) => char !== " ").join("");
      socket.emit("worm word submitted", { submittedWord, roomID });
      // }
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
      opponentName = isP1 === true ? p2Name : p1Name;
      console.log("opponentName is ", opponentName);
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
      this.awaitingApi = false;
      if (
        this.scores.currentPlayer !== undefined &&
        this.scores.opponent !== undefined
      ) {
        scene.time.delayedCall(1000, this.showRoundWinner, [
          this.scores,
          opponentName,
        ]);
        scene.gameState.scores = {};
      }
    };

    this.gameState.showRoundWinner = function (scoreObj, opponentName) {
      scene.gameState.countDown.paused = true;
      scene.gameState.timerText.destroy();
      scene.gameState.submitBtn.disableInteractive();

      if (scoreObj.currentPlayer === undefined) {
        scoreObj.currentPlayer = { points: 0, word: "" };
      }
      if (scoreObj.opponent === undefined) {
        scoreObj.opponent = { points: 0, word: "" };
      }

      if (scoreObj.currentPlayer.points > scoreObj.opponent.points) {
        scene.gameState.roundWinnerText = scene.add.text(
          150,
          200,
          [
            `You win with ${scoreObj.currentPlayer.word}!`,
            `What a great word!`,
          ],
          roundScoreStyle
        );
        const winner = isP1 === true ? "p1" : "p2";
        roundsWon[winner] += 1;
        socket.emit("update rounds", { roundsWon, roomID });
      } else if (scoreObj.currentPlayer.points < scoreObj.opponent.points) {
        scene.gameState.roundWinnerText = scene.add.text(
          100,
          200,
          [
            `Oh no, ${opponentName} won with ${scoreObj.opponent.word}!`,
            `I hate that word!`,
          ],
          roundScoreStyle
        );
      } else {
        scene.gameState.roundWinnerText = scene.add.text(
          50,
          200,
          [
            `A draw?!?! Now no-ones happy!`,
            `I think your word ${scoreObj.currentPlayer.word} was better`,
          ],
          roundScoreStyle
        );
        socket.emit("update rounds", { roundsWon, roomID });
      }
    };

    this.gameState.showFinalWinner = function (amIWinner) {
      if (this.roundWinnerText !== undefined) {
        this.roundWinnerText.destroy();
      }

      const thisPlayerName = isP1 ? p1Name : p2Name;
      const opponentName = isP1 ? p2Name : p1Name;

      this.newGameBtn.setVisible(true);
      this.newGameText.setVisible(true);
      this.quitBtn.setVisible(true);
      this.quitText.setVisible(true);

      if (amIWinner === true) {
        if (isP1 === true) {
          whoWon.p1 = true;
        } else if (isP2 === true) {
          whoWon.p2 = true;
        }
        this.finalWinnerText = scene.add.text(
          150,
          100,
          [`Well Done ${thisPlayerName}!`, `You Won!`],
          finalScoreStyle
        );
      } else {
        if (isP1 === true) {
          whoWon.p2 = true;
        } else if (isP2 === true) {
          whoWon.p1 = true;
        }
        this.finalWinnerText = scene.add.text(
          150,
          100,
          [`Oh no ${opponentName} Won!`, `I'm sorry. :(`],
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

    socket.on("start the game", function () {
      if (scene.gameState.countDown.paused === true) {
        // Stops this firing multiple times
        scene.gameState.startText = scene.add.text(300, 200, "GO!", {
          fontSize: "50px",
          color: "#28bb24",
          stroke: "white",
          strokeThickness: 3,
          fontFamily: "Arial",
        });
        scene.time.delayedCall(1000, function () {
          scene.gameState.startText.destroy();
        });
      }

      scene.gameState.updateRounds(scene.gameState.roundsWon);
      scene.gameState.submitBtn.setInteractive();
      for (const letter in scene.gameState.text) {
        scene.input.setDraggable(scene.gameState.text[letter]);
      }
      scene.gameState.countDown.paused = false;
      scene.gameState.gameStarted = true;
    });

    socket.on("new game request", function (opponentInfo) {
      scene.gameState.wantsNewGame[opponentInfo.player] = true;
      scene.gameState.rematchText = scene.add.text(
        100,
        400,
        [`Uh oh! ${opponentInfo.name} wants a re-match.`, `Do you?`],
        scoreStyle
      );
    });

    socket.on("start new game", function () {
      scene.scene.start("MainScene");
    });

    socket.on("set new rounds", function (newRounds) {
      scene.gameState.roundsWon = newRounds;
      scene.gameState.updateRounds(scene.gameState.roundsWon);

      if (newRounds.p1 === 3) {
        const didIWin = isP1 ? true : false;
        scene.time.delayedCall(
          2000,
          scene.gameState.showFinalWinner,
          [didIWin],
          scene.gameState
        );
      } else if (newRounds.p2 === 3) {
        const didIWin = isP1 ? false : true;
        scene.time.delayedCall(
          2000,
          scene.gameState.showFinalWinner,
          [didIWin],
          scene.gameState
        );
      } else {
        // Add countdown on screen

        scene.time.delayedCall(2000, function () {
          opponentsArr.forEach((el, i) => {
            opponentsArr[i] = " ";
          });
          whoWon.p1 = null;
          whoWon.p2 = null;
          scene.scene.start("MainScene");
        });
      }
    });

    socket.on("You submitted", function () {
      scene.gameState.awaitingApi = true;
      if (scene.gameState.submitText !== undefined) {
        scene.gameState.submitText.destroy();
      }
      scene.gameState.submitText = scene.add.text(
        175,
        100,
        `Nice! Just checking your word...`,
        {
          fontSize: "30px",
          color: "orange",
          strokeThickness: 3,
          stroke: "black",
          fontFamily: "Arial",
          align: "center",
        }
      );
      if (scene.gameState.roundTimer > 6) {
        scene.gameState.roundTimer = 6;
      }
      scene.time.delayedCall(1500, function () {
        scene.tweens.add({
          targets: scene.gameState.submitText,
          alpha: 0,
          duration: 500,
          ease: "Power 2",
        });
      });
    });

    socket.on("opponent submitted", function (opponentInfo) {
      scene.gameState.awaitingApi = true;
      if (scene.gameState.submitText !== undefined) {
        scene.gameState.submitText.destroy();
      }
      scene.gameState.submitText = scene.add.text(
        150,
        100,
        [`${opponentInfo.username} submitted a word!`, `Hurry!`],
        {
          fontSize: "30px",
          color: "orange",
          strokeThickness: 3,
          stroke: "black",
          fontFamily: "Arial",
          align: "center",
        }
      );
      if (scene.gameState.roundTimer > 6) {
        scene.gameState.roundTimer = 6;
      }
      scene.time.delayedCall(1500, function () {
        scene.tweens.add({
          targets: scene.gameState.submitText,
          alpha: 0,
          duration: 500,
          ease: "Power 2",
        });
      });
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
        this.gameState.newGameBtn = this.add.sprite(300, 350, "blueButton2");
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
          socket.emit("new game", roomID);
        } else {
          socket.emit("make new game request", {
            name: isP1 === true ? p1Name : p2Name,
            player: isP1 === true ? "p1" : "p2",
            roomID,
          });
          scene.gameState.rematchText = scene.add.text(
            100,
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
        this.sys.game.destroy(true);
        socket.emit("quitRoom");
        setStateCallback("iHavePermissionToEnterRoom", false);
      }.bind(this)
    );

    this.gameState.quitBtn.setVisible(false);
    this.gameState.quitText.setVisible(false);

    if (p1Name !== this.game.react.state.currentRoom.p1.username) {
      p1Name = this.game.react.state.currentRoom.p1.username;
    }

    if (p2Name !== this.game.react.state.currentRoom.p2.username) {
      p2Name = this.game.react.state.currentRoom.p2.username;
    }

    this.gameState.thisPlayerScore = this.add.text(
      5,
      85,
      `YOU: ${isP1 ? roundsWon.p1 : roundsWon.p2}`,
      {
        fontSize: "30px",
        color: "blue",
        strokeThickness: 3,
        fontFamily: "Arial",
      }
    );
    this.gameState.oppositionScore = this.add.text(
      5,
      150,
      `Awaiting opponent...`,
      {
        fontSize: "30px",
        color: "red",
        stroke: "black",
        strokeThickness: 3,
        fontFamily: "Arial",
      }
    );
    this.gameState.updateRounds = function (currentRounds) {
      this.gameState.thisPlayerScore.setText(
        `YOU: ${isP1 ? currentRounds.p1 : currentRounds.p2}`
      );
      this.gameState.oppositionScore.setText(
        `${
          isP1
            ? this.game.react.state.currentRoom.p2.username
            : this.game.react.state.currentRoom.p1.username
        }: ${isP1 ? currentRounds.p2 : currentRounds.p1}`
      );
    }.bind(this);

    this.gameState.formatTime = function (seconds) {
      // Adds left zeros to seconds
      const formattedSeconds = seconds.toString().padStart(2, "0");
      // Returns formatted time
      return `0:${formattedSeconds}`;
    };

    this.gameState.timerText = this.add.text(
      555,
      25,
      this.gameState.formatTime(this.gameState.roundTimer),
      {
        fontSize: "40px",
        color: "yellow",
        stroke: "black",
        strokeThickness: 3,
        fontFamily: "Arial",
      }
    );

    this.gameState.decrementTimer = function () {
      this.roundTimer -= 1;
      this.timerText.setText(this.formatTime(this.roundTimer));
      if (this.roundTimer === 5) {
        this.timerText
          .setStyle({
            fontSize: "40px",
            color: "#dd0000",
            stroke: "orange",
            strokeThickness: 5,
            fontFamily: "Arial",
          })
          .setX(375)
          .setY(200);
      }
      if (this.roundTimer < 6) {
        this.timerText.setFontSize(
          Number(this.timerText.style.fontSize.slice(0, 2)) + 10
        );
        this.timerText.x -= 10;
        this.timerText.y -= 4;
      }
    };

    this.gameState.countDown = this.time.addEvent({
      delay: 1000,
      callback: this.gameState.decrementTimer,
      callbackScope: this.gameState,
      loop: true,
      paused: true,
    });

    this.gameState.gameStarted = false;
    if (p1Name !== null && p2Name !== null) {
      socket.emit("both players ready", {
        roomID,
      });
    }
  }

  update() {
    //CHECK IF A PLAYER JUST QUIT/DISCONNECTED IN MIDDLE OF GAME.
    if (
      (p1Name && !this.game.react.state.currentRoom.p1.id) ||
      (p2Name && !this.game.react.state.currentRoom.p2.id)
    ) {
      scene.gameState.startText = scene.add.text(300, 200, "GAME ANNULLED!", {
        fontSize: "50px",
        color: "#28bb24",
        stroke: "white",
        strokeThickness: 3,
        fontFamily: "Arial",
      });
      setTimeout(() => {
        this.scene.start("MainScene");
      }, 3000);
    }

    p1Name = this.game.react.state.currentRoom.p1.username;
    p2Name = this.game.react.state.currentRoom.p2.username;
    opponentName = isP1 === true ? p2Name : p1Name;

    const {
      head,
      p1HeadShocked,
      p1HeadHappy,
      p1HeadAngry,
      p1HeadSad,
      timer,
      body1,
      body2,
      body3,
      body4,
      body5,
      body6,
      text,
      p2Head,
      p2HeadHappy,
      p2HeadShocked,
      p2HeadSad,
      p2HeadAngry,
      p2Body1,
      p2Body2,
      p2Body3,
      p2Body4,
      p2Body5,
      p2Body6,
      roundsWon,
      whoWon,
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
    p1HeadHappy.x = head.x;
    p1HeadHappy.y = head.y;
    p1HeadAngry.setVisible(false);

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
    p2HeadHappy.x = p2Head.x;
    p2HeadHappy.y = p2Head.y;
    p2HeadAngry.setVisible(false);

    if (roundsWon.p1 < roundsWon.p2) {
      p1HeadHappy.setVisible(false);
      p1HeadSad.setVisible(true);
      p1HeadSad.x = head.x;
      p1HeadSad.y = head.y;
    } else if (roundsWon.p1 > roundsWon.p2) {
      p2HeadHappy.setVisible(false);
      p2HeadSad.setVisible(true);
      p2HeadSad.x = p2Head.x;
      p2HeadSad.y = p2Head.y;
    } else if (roundsWon.p1 === roundsWon.p2) {
      p1HeadHappy.setVisible(true);
      p2HeadHappy.setVisible(true);
      p1HeadSad.setVisible(false);
      p2HeadSad.setVisible(false);
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
    }

    if (timer.p1 > 0) {
      timer.p1 -= 1;
      if (roundsWon.p1 < roundsWon.p2) {
        p1HeadSad.setVisible(false);
      } else {
        p1HeadHappy.setVisible(false);
      }

      p1HeadShocked.setVisible(true);
      p1HeadShocked.x = head.x;
      p1HeadShocked.y = head.y;
      if (timer.p1 === 0) {
        if (roundsWon.p1 < roundsWon.p2) {
          p1HeadSad.setVisible(true);
        } else {
          p1HeadHappy.setVisible(true);
        }
        p1HeadShocked.setVisible(false);
      }
    }
    if (timer.p2 > 0) {
      timer.p2 -= 1;
      if (roundsWon.p1 < roundsWon.p2) {
        p2HeadSad.setVisible(false);
      } else {
        p2HeadHappy.setVisible(false);
      }
      p2HeadShocked.setVisible(true);
      p2HeadShocked.x = p2Head.x;
      p2HeadShocked.y = p2Head.y;
      if (timer.p2 === 0) {
        if (roundsWon.p1 > roundsWon.p2) {
          p2HeadSad.setVisible(true);
        } else {
          p2HeadHappy.setVisible(true);
        }
        p2HeadShocked.setVisible(false);
      }
    }

    if (this.gameState.roundTimer === 0) {
      scene.gameState.countDown.paused = true;
      this.gameState.roundTimer = -1;
      if (this.gameState.awaitingApi === false) {
        this.gameState.showRoundWinner(
          this.gameState.scores,
          isP1 ? p2Name : p1Name
        );
      }
    }

    if (whoWon.p1 === true) {
      p1HeadHappy.setVisible(true);
      p1HeadAngry.setVisible(false);
      p1HeadSad.setVisible(false);
      p1HeadShocked.setVisible(true);
      p2HeadAngry.setVisible(true);
      p2HeadHappy.setVisible(false);
      p2HeadSad.setVisible(false);
      p2HeadShocked.setVisible(false);
    } else if (whoWon.p2 === true) {
      p1HeadHappy.setVisible(false);
      p1HeadAngry.setVisible(true);
      p1HeadSad.setVisible(false);
      p1HeadShocked.setVisible(true);
      p2HeadAngry.setVisible(false);
      p2HeadHappy.setVisible(true);
      p2HeadSad.setVisible(false);
      p2HeadShocked.setVisible(false);
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
