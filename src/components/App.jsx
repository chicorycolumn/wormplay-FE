import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/App.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      iJustLoggedIn: false,
      shallIBotherLoadingTheGame: true, //TOGGLE THIS DURING DEVELOPMENT.
      amILoggedIn: false, // HARDCODE AS TRUE TO SKIP LOGIN SCREEN.
      socket: null, //Just FYI, this gets setStated as the socket from props from index.js. ~Chris
      message: "",
      whichPlayerAmI: null, //Remember to switch this back to null when I exit a room back into the lobby. To avoid the MFIR (Multiple Firing In React) problem. ~Chris
      index: undefined,
      character: "",
      needUpdate: false,
      loginField: "",
      myUsername: "",
      isRoomFull: false, //This should be setStated when a player exits a room back into the lobby, I think. ~Chris
      playersDetails: {
        p1: { username: null, id: null, score: 0 }, //change all back to null after CSS work
        p2: { username: null, id: null, score: 666 }, //change all back to null after CSS work
      },
      welcomeMessage: "",
      emoObj: [
        { name: "happy", action: "rush" },
        { name: "angry", action: "steal" },
        { name: "surprised", action: "drop" },
        { name: "sad", action: "time" },
      ],
      currentEmotion: { name: null, src: null },
      currentRoomIAmIn: null,
    };
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  joinRoom = () => {
    console.log("gonna try joining room 3!");
    this.state.socket.emit("joinRoom", { roomID: 3 });
  };

  quitRoom = () => {
    console.log("gonna try quitting room 3!");
    this.state.socket.emit("quitRoom");
  };

  componentDidMount() {
    setTimeout(() => {
      this.joinRoom();
    }, 5000);

    this.setState({ socket: this.props.socket });
  }

  setStateCallback = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.welcomeMessage) {
      let infoDisplay = document.getElementById("infoDisplay");

      if (infoDisplay) {
        let newLi = document.createElement("li");
        newLi.style.margin = "8px";
        newLi.innerHTML = this.state.welcomeMessage;
        infoDisplay.appendChild(newLi);
      }

      this.setState({ welcomeMessage: "" });
    }

    if (
      prevState.currentEmotion.name !== this.state.currentEmotion.name &&
      this.state.currentEmotion.name
    ) {
      let infoDisplay = document.getElementById("infoDisplay");

      let newLi = document.createElement("li");
      newLi.style.margin = "8px";
      newLi.innerHTML =
        "You are so " +
        "<strong>" +
        `${this.state.currentEmotion.name}` +
        "</strong>" +
        ", my friend!";
      infoDisplay.appendChild(newLi);
    }

    if (this.state.socket) {
      this.state.socket.on("connectionReply", (data) => {
        console.log(`LOBBY DATA: ${data.rooms}`);
      });

      this.state.socket.on("connectionRefused", () => {
        console.log(`Oh no! The room was full or something.`);
      });

      this.state.socket.on("youJoinedARoom", (data) => {
        console.log(`Seems like we successfully joined ${data.room.roomID}`);
        //A check to avoid MFIR.
        if (data.youCanEnter) {
          console.log("inside socket.on youJoinedARoom");
          if (data.youCanEnter) {
            let whichPlayerAmI;

            if (this.state.socket.id === data.playersDetails.p1.id) {
              whichPlayerAmI = "p1";
            }
            if (this.state.socket.id === data.playersDetails.p2.id) {
              whichPlayerAmI = "p2";
            }

            let welcomeMessage =
              "Hey " +
              "<strong>" +
              `${data.playersDetails[`${whichPlayerAmI}`].username}` +
              "</strong>" +
              ", it's awesome you're here!";

            this.setState({
              amILoggedIn: true,
              whichPlayerAmI,
              playersDetails: data.playersDetails,
              welcomeMessage,
              iJustLoggedIn: true,
              currentRoomIAmIn: data.room.roomID,
            });
          } else {
            this.setState({ isRoomFull: true });
          }
        }
      });

      this.state.socket.on("a player entered the game", (data) => {
        //A check, so that we only fire this fxn if the entering player is different or new. To avert MFIR.
        if (
          (this.state.whichPlayerAmI === "p1" &&
            data.enteringPlayerID !== this.state.playersDetails.p2.id) ||
          (this.state.whichPlayerAmI === "p2" &&
            data.enteringPlayerID !== this.state.playersDetails.p1.id)
        ) {
          console.log("inside socket.on a player entered the game");
          const { playersDetails } = data;

          let infoDisplay = document.getElementById("infoDisplay");

          let newLi = document.createElement("li");
          newLi.style.margin = "8px";
          newLi.innerHTML =
            "Look out! Haha, cos " +
            "<strong>" +
            `${data.enteringPlayerUsername}` +
            "</strong>" +
            "'s here!";
          infoDisplay.appendChild(newLi);

          this.setState({
            playersDetails,
          });
        }
      });

      this.state.socket.on("a player left the game", (data) => {
        //A check, so that we only fire this fxn once per exiting player. To avert the MFIR problem.
        if (
          (this.state.whichPlayerAmI === "p1" &&
            data.leavingPlayerID === this.state.playersDetails.p2.id) ||
          (this.state.whichPlayerAmI === "p2" &&
            data.leavingPlayerID === this.state.playersDetails.p1.id)
        ) {
          console.log("inside socket.on a player left the game");
          const { playersDetails } = data;

          let infoDisplay = document.getElementById("infoDisplay");

          let newLi = document.createElement("li");
          newLi.style.margin = "8px";
          newLi.innerHTML =
            "Woah! Looks like " +
            "<strong>" +
            `${data.leavingPlayerUsername}` +
            "</strong>" +
            " bodged off!";
          infoDisplay.appendChild(newLi);

          this.setState({
            playersDetails,
          });
        }
      });
    }
  }

  render() {
    console.log("inside render in app.jsx");
    const {
      isRoomFull,
      whichPlayerAmI,
      playersDetails,
      socket,
      myUsername,
      emoObj,
      faceValue,
      currentEmotion,
    } = this.state;

    const ul = document.getElementById("infoDisplay");
    if (ul) {
      if (ul.childElementCount > 6) {
        ul.removeChild(ul.childNodes[0]);
      }
    }

    console.log(this.state.currentEmotion);
    return (
      <div>
        {this.state.amILoggedIn ? (
          <div>
            {this.state.shallIBotherLoadingTheGame && (
              <ReactGameHolder
                socket={socket}
                faceValue={faceValue}
                currentEmotion={currentEmotion}
                playersDetails={this.state.playersDetails}
              />
            )}

            <div className={styles.rightPanelDisplay}>
              {/* /////////////////THIS IS WHERE WE CALL THE FACE RECOGNITION. */}
              {this.state.iJustLoggedIn &&
                setTimeout(() => {
                  this.setState({ iJustLoggedIn: false });
                  emotionRecFullFunction(this.setStateCallback);
                }, 0)}
              {/* /////////////////*/}
              <div className={styles.topbox}>
                <div id="videoContainer" className={styles.videoContainer}>
                  {/* <div id="videoObscurer" className={styles.videoObscurer}>
                    video obscured for you
                  </div> */}
                  <video
                    id="video"
                    className={styles.video}
                    autoPlay
                    muted
                  ></video>

                  {/* <canvas
                    id="canvasDetections"
                    className={styles.canvasDetections}
                  ></canvas> */}
                  <canvas
                    id="canvasPhoto"
                    className={styles.canvasPhoto}
                  ></canvas>
                </div>
                <div className={styles.emojiHolder}>
                  {emoObj.map((emoObj) => {
                    return (
                      <div
                        className={styles.emoHolder}
                        id={`${emoObj.name}Holder`}
                      >
                        <p className={styles.emoBars} id={`${emoObj.name}Bars`}>
                          □□□□
                        </p>
                        <img
                          src={`src/assets/${emoObj.name}Emoji.png`}
                          className={styles.emoEmoji}
                          id={`${emoObj.name}Image`}
                        />
                        <p
                          className={styles.emoLabel}
                          id={`${emoObj.name}Action`}
                        >
                          {emoObj.action.toUpperCase()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.midbox}>
                <p id="youAre"></p>
                <p
                  id="playersDisplay"
                  className={styles.playersDisplay}
                >{`Player 1: ${
                  playersDetails.p1.username
                    ? playersDetails.p1.username
                    : "waiting..."
                } - - - - - Player 2: ${
                  playersDetails.p2.username
                    ? playersDetails.p2.username
                    : "waiting..."
                }`}</p>
                <ul id="infoDisplay" className={styles.infoDisplay}></ul>
              </div>
              <div className={styles.bottombox}>
                {playersDetails.p1.username !== null &&
                playersDetails.p2.username !== null ? (
                  <div>
                    <p>
                      {playersDetails.p1.username +
                        ": " +
                        playersDetails.p1.score}
                    </p>
                    <p>
                      {playersDetails.p2.username +
                        ": " +
                        playersDetails.p2.score}
                    </p>
                  </div>
                ) : (
                  "waiting..."
                )}
              </div>
            </div>
          </div>
        ) : isRoomFull ? (
          <p
            className={styles.lobbyInfoDisplay}
          >{`Fuck! I'm so sorry ${myUsername} but the room is full!`}</p>
        ) : (
          <form>
            <input
              className={styles.loginField}
              id="loginField"
              maxlength="12"
              autocomplete="off"
              value={this.state.loginField}
              onChange={(e) => {
                this.setState({ loginField: e.target.value });
              }}
              placeholder="Welcome! Please enter your name."
            ></input>
            <button
              className={styles.loginSubmitButton}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                if (this.state.loginField.length) {
                  const myUsername = this.state.loginField;
                  this.state.socket.emit("login", { username: myUsername });
                  this.setState({ myUsername, loginField: "" });
                }
              }}
            >
              Let's play!
            </button>
          </form>
        )}
      </div>
    );
  }
}
