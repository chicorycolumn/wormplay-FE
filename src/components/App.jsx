import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/App.module.css";
import ReactGame from "./ReactGameHolder.jsx";
// import ReactGameHolder from "./ReactGameHolder";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: null, //Just FYI, this gets setStated as the socket from props from index.js. ~Chris
      message: "",
      whichPlayerAmI: null, //Remember to switch this back to null when I exit a room back into the lobby. To avoid the MFIR (Multiple Firing In React) problem. ~Chris
      index: undefined,
      character: "",
      needUpdate: false,
      amILoggedIn: false, // Change back to false after adding georgine css.
      loginField: "",
      myUsername: "",
      isRoomFull: false, //This should be setStated when a player exits a room back into the lobby, I think. ~Chris
      playersDetails: {
        p1: { username: null, id: null },
        p2: { username: null, id: null },
      },
      welcomeMessage: "",
      roomNumber: "",
    };
    // this.changeMyState = this.changeMyState.bind(this);
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.welcomeMessage) {
      let infoDisplay = document.getElementById("infoDisplay");

      if (infoDisplay) {
        infoDisplay.innerHTML += this.state.welcomeMessage;
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
              "<p>" +
              "oh hey " +
              "<strong>" +
              data.playersDetails[`${whichPlayerAmI}`].username +
              "</strong>" +
              "! it's so awesome you're here" +
              "</p>";

            this.setState({
              amILoggedIn: true,
              whichPlayerAmI,
              playersDetails: data.playersDetails,
              welcomeMessage,
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

          infoDisplay.innerHTML +=
            "<p>" +
            "look out! haha, cos " +
            "<strong>" +
            data.enteringPlayerUsername +
            "</strong>" +
            "'s here!" +
            "</p>";

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
          infoDisplay.innerHTML +=
            "<p>" +
            "woah! looks like " +
            "<strong>" +
            data.leavingPlayerUsername +
            "</strong>" +
            " bodged off!" +
            "</p>";
          this.setState({
            playersDetails,
          });
        }
      });

      this.state.socket.on("connectToRoom", (data) => {
        const info = data;

        if (this.state.roomNumber === "") {
          this.setState({ roomNumber: info });
        }
      });

      this.resetState = () => {};
    }
  }

  render() {
    const {
      isRoomFull,
      whichPlayerAmI,
      playersDetails,
      p1,
      username,
      socket,
      myUsername,
      roomNumber,
      resetState,
    } = this.state;

    console.log(this.state, "state");
    return (
      <div>
        <p>{roomNumber}</p>

        {this.state.amILoggedIn ? (
          <div>
            {/* <div className={styles.georgine}> */}
            <ReactGameHolder socket={socket} />
            {/* <div className={styles.rotisserie}></div>
            </div> */}

            <div id="infoDisplay" className={styles.infoDisplay}></div>

            <p
              id="playersDisplay"
              className={styles.playersDisplay}
            >{`- - - - - Player 1: ${
              playersDetails.p1.username
                ? playersDetails.p1.username
                : "waiting..."
            } - - - - - Player 2: ${
              playersDetails.p2.username
                ? playersDetails.p2.username
                : "waiting..."
            } - - - - - `}</p>
          </div>
        ) : isRoomFull ? (
          <ReactGameHolder socket={socket} />
        ) : (
          // <p
          //   className={styles.lobbyInfoDisplay}
          // >{`Fuck! I'm so sorry ${myUsername} but the room is full!`}</p>
          <form>
            <input
              className={styles.loginField}
              id="loginField"
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
