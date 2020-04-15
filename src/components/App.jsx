import React, { Component } from "react";
import Lobby from "./Lobby.jsx";
import styles from "./css/App.module.css";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      iJustLoggedIn: false,
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
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  componentDidMount() {
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
    console.log("inside render in app.jsx");
    const {
      isRoomFull,
      whichPlayerAmI,
      playersDetails,
      socket,
      myUsername,
      emoObj,
      currentEmotion,
      iJustLoggedIn,
    } = this.state;

    const ul = document.getElementById("infoDisplay");
    if (ul) {
      if (ul.childElementCount > 6) {
        ul.removeChild(ul.childNodes[0]);
      }
    }

    return (
      <div>
        {this.state.amILoggedIn ? (
          <div>
            <Lobby
              socket={socket}
              currentEmotion={currentEmotion}
              playersDetails={playersDetails}
              myUsername={myUsername}
              emoObj={emoObj}
              iJustLoggedIn={iJustLoggedIn}
            />
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
