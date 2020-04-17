import React, { Component } from "react";
import Lobby from "./Lobby.jsx";
import styles from "./css/App.module.css";
import genStyles from "./css/General.module.css";
import apple from "../assets/apple.png";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      amILoggedIn: false, //DEVELOPMENT
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
      currentRoomIAmIn: null,
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
    this.setState({ socket: this.props.socket });
  }

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
          this.setState({ amILoggedIn: true, rooms: data.rooms });
        });
      }
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
            <Lobby
              socket={socket}
              playersDetails={playersDetails}
              myUsername={myUsername}
              rooms={rooms}
            />
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
                  this.setState({ myUsername, loginField: "" });
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
                placeholder="Welcome! Please enter your name..."
              ></input>
              <button className={styles.loginSubmitButton} type="submit">
                Let's worm!
              </button>
              <label className={styles.container}>
                I accept that worms are beautiful misunderstood creatures.
                (optional)
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
