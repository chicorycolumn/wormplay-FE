import React, { Component } from "react";
import Lobby from "./Lobby.jsx";
import styles from "./css/App.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";
// import { Router } from "@reach/router";
import RoomTable from "./RoomTable.jsx";
import genStyles from "./css/General.module.css";
import apple from "../assets/apple.png";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      amILoggedIn: false,
      socket: null, //Just FYI, this gets setStated as the socket from props from index.js. ~Chris
      message: "",
      whichPlayerAmI: null, //Remember to switch this back to null when I exit a room back into the lobby. To avoid the MFIR (Multiple Firing In React) problem. ~Chris
      index: undefined,
      character: "",
      needUpdate: false,
      loginField: "",
      myUsername: "",
      isRoomFull: false, //This should be setStated when a player exits a room back into the lobby, I think. ~Chris
      welcomeMessage: "",
      emoObj: [
        { name: "happy", action: "rush" },
        { name: "angry", action: "steal" },
        { name: "surprised", action: "drop" },
        { name: "sad", action: "time" },
      ],
      currentEmotion: { name: null, src: null },

      // currentRoomIAmIn: null,
      rooms: [],
    };
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  setStateCallback = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  componentDidMount() {
    this.setState({
      socket: this.props.socket,
    });
    if (this.props.goStraightToLobby) {
      this.props.socket.emit("login", { developmentCheat: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //*************** I MAY MOVE THIS TO LOBBY LATER ~Chris */
    // if (
    //   prevState.currentEmotion.name !== this.state.currentEmotion.name &&
    //   this.state.currentEmotion.name
    // ) {
    //   let infoDisplay = document.getElementById("infoDisplay");

    //   let newLi = document.createElement("li");
    //   newLi.style.margin = "8px";
    //   newLi.innerHTML =
    //     "You are so " +
    //     "<strong>" +
    //     `${this.state.currentEmotion.name}` +
    //     "</strong>" +
    //     ", my friend!";
    //   infoDisplay.appendChild(newLi);
    // }

    if (this.state.socket) {
      if (!this.state.amILoggedIn) {
        this.state.socket.on("connectionReply", (data) => {
          const { rooms, myUsername } = data;
          this.setState({ amILoggedIn: true, rooms, myUsername });
        });
      }
    }
  }

  render() {
    const {
      isRoomFull,
      whichPlayerAmI,
      socket,
      myUsername,
      rooms,
    } = this.state;

    const ul = document.getElementById("infoDisplay");
    if (ul) {
      if (ul.childElementCount > 6) {
        ul.removeChild(ul.childNodes[0]);
      }
    }
    return (
      <div id="largeContainer" className={genStyles.largeContainer}>
        {this.state.amILoggedIn ? (
          <div>
            <Lobby socket={socket} myUsername={myUsername} rooms={rooms} />
          </div>
        ) : isRoomFull ? (
          <p
            className={styles.lobbyInfoDisplay}
          >{`Fuck! I'm so sorry ${myUsername} but the room is full!`}</p>
        ) : (
          <div id="preGeorgine" className={genStyles.preGeorgine}>
            <img className={styles.appleGraphic} src={apple} />
            <form
              className={styles.loginForm}
              onSubmit={(e) => {
                e.preventDefault();
                if (this.state.loginField.length) {
                  const myUsername = this.state.loginField;
                  this.state.socket.emit("login", { username: myUsername });
                  this.setState({ loginField: "" });
                }
              }}
            >
              <input
                className={styles.loginField}
                id="loginField"
                maxlength="12"
                autocomplete="off"
                value={this.state.loginField}
                onChange={(e) => {
                  this.setState({ loginField: e.target.value });
                }}
                placeholder="Your name here!"
              ></input>
              <button className={styles.loginSubmitButton} type="submit">
                Let's worm!
              </button>
              <label className={styles.container}>
                {/* <p className={styles.disclaimer}> */}I accept that worms are
                beautiful misunderstood creatures. (optional)
                {/* </p> */}
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkmark}></span>
              </label>
            </form>
          </div>
        )}
      </div>
    );
  }
}
