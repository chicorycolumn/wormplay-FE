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
    const observesCallback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        if (mutation.attributeName === "src") {
          let src = mutation.target.attributes.src.value;
          let name = mutation.target.attributes.label;
          console.log(name);
          // this.setState({ currentEmotion: { name, src } });

          // console.log(name, src);
          // setStateobservesCallback({ currentEmotion: { name, src } });
          //             this.setState({currentEmotion: {
          // name:
          //             }});
        }
        // if (mutation.type === "childList") {
        //   console.log("---A child node has been added or removed.");
        // } else if (mutation.type === "attributes") {
        //   console.log(
        //     "---The " + mutation.attributeName + " attribute was modified."
        //   );
        // }
      }
    };
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
    };
    this.observePhotoChange = this.observePhotoChange.bind(this);
    this.observesCallback = this.observesCallback.bind(this);
  }

  componentDidMount() {
    this.observePhotoChange();
    this.setState({ socket: this.props.socket });
  }

  observePhotoChange = () => {
    const targetNode = document.getElementById("canvasPhoto");

    if (!targetNode) {
      //The node we need does not exist yet. Wait 500ms and try again
      window.setTimeout(() => {
        this.observePhotoChange();
      }, 500);
      return;
    }

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // observesCallback function to execute when mutations are observed

    const observer = new MutationObserver(this.observesCallback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  };

  observesCallback = (mutationsList, observer) => {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "src") {
        let src = mutation.target.attributes.src.value;
        let name = mutation.target.attributes.label;
        this.setState({ currentEmotion: { name, src } });
      }
    }
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

    if (this.state.socket) {
      this.state.socket.on("loginConf", (data) => {
        //A check to avoid MFIR.
        if (!this.state.whichPlayerAmI) {
          console.log("inside socket.on loginConf");
          if (data.youCanEnter) {
            let whichPlayerAmI = null;

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
    console.log("inside render");
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
      if (ul.childElementCount > 7) {
        ul.removeChild(ul.childNodes[0]);
      }
    }

    return (
      <div>
        <p id="trythis">hello i am excited</p>
        {this.state.amILoggedIn ? (
          <div>
            {this.state.shallIBotherLoadingTheGame && (
              <ReactGameHolder
                socket={socket}
                faceValue={faceValue}
                currentEmotion={currentEmotion}
              />
            )}

            <div className={styles.rightPanelDisplay}>
              {/* ///////////////////////////// */}

              {this.state.iJustLoggedIn &&
                setTimeout(() => {
                  // DEVELOPMENT: THIS IS ONLY A BODGE. CHANGE TO BETTER FXN, defer eg.
                  this.setState({ iJustLoggedIn: false });
                  emotionRecFullFunction();
                }, 1000)}

              {/* ///////////////////////////// */}

              <div className={styles.topbox}>
                {/* // */}

                <div id="videoContainer" className={styles.videoContainer}>
                  <video
                    id="video"
                    className={styles.video}
                    autoPlay
                    muted
                  ></video>
                  {/* <div id="videoObscurer" className={styles.videoObscurer}>
                      comment me out to see the video
                    </div> */}
                  <canvas
                    id="canvasDetections"
                    className={styles.canvasDetections}
                  ></canvas>
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

                {/* // */}
              </div>
              <div className={styles.midbox}>
                {/* // */}

                {/* // */}

                {/* <p
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
                <ul id="infoDisplay" className={styles.infoDisplay}></ul> */}
              </div>
              <div className={styles.bottombox}>
                <p id="youAre"></p>
                {/* {playersDetails.p1.username !== null &&
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
                )} */}
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
