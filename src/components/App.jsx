import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/App.module.css";

//You can access the socket as `this.state.socket`.
//I suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things. ~Chris

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: null, //Just FYI, this gets setStated as the socket from props from index.js. ~Chris
      message: "",
      //THIS WAS FROM MOCK GAME.
      // p1Chars: ["h", "i", "j", "k", "l", "m", "n"],
      // p2Chars: ["a", "b", "c", "d", "e", "f", "g"],
      whichPlayerAmI: null, //Remember to switch this back to null when I exit a room back into the lobby. To avoid the MFIR (Multiple Firing In React) problem. ~Chris
      index: undefined,
      character: "",
      needUpdate: false,
      amILoggedIn: false,
      loginField: "",
      myUsername: "",
      isRoomFull: false, //This should be setStated when a player exits a room back into the lobby, I think. ~Chris
      playersDetails: {
        p1: { username: null, id: null },
        p2: { username: null, id: null },
      },
      welcomeMessage: "",
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

      //THIS WAS FROM MOCK GAME.
      // this.state.socket.on("updatedP1Chars", (data) => {
      //   this.setState({ p1Chars: data.p1Chars });
      // });
      // this.state.socket.on("updatedP2Chars", (data) => {
      //   this.setState({ p2Chars: data.p2Chars });
      // });

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
    }
  }

  //THIS WAS FROM MOCK GAME.
  // handleSubmitLetterChange = (event) => {
  //   event.preventDefault();

  //   let labelArray = ["p1", "p2"];
  //   labelArray.forEach((player) => {
  //     if (this.state.whichPlayerAmI === player) {
  //       this.setState((currentState) => {
  //         const { index, character } = currentState;
  //         currentState[`${player}Chars`].splice(index, 1, character);
  //         const newState = {};
  //         newState[`${player}Chars`] = currentState[`${player}Chars`];
  //         this.setState(newState);
  //         this.state.socket.emit(`${player}ArrayUpdate`, {
  //           p1Chars: this.state[`${player}Chars`],
  //         });
  //       });
  //     }
  //   });
  // };

  render() {
    const {
      isRoomFull,
      whichPlayerAmI,
      //THIS WAS FROM MOCK GAME.
      // p1Chars,
      // p2Chars,
      playersDetails,
      socket,
      myUsername,
    } = this.state;

    return (
      <div>
        {this.state.amILoggedIn ? (
          <div>
            <ReactGameHolder socket={socket} />
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
            {/* //THIS WAS FROM MOCK GAME. */}
            {/* {whichPlayerAmI === "p1"
            ? p2Chars.map((char) => {
                return <p key={"x"}>{char}</p>;
              })
            : null}
          {whichPlayerAmI === "p2"
            ? p1Chars.map((char) => {
                return <p key={"y"}>{char}</p>;
              })
            : null} */}
            {/* <form onSubmit={this.handleSubmitLetterChange}>
            <input
              type="number"
              min="0"
              max="6"
              onChange={(event) => {
                this.setState({ index: event.target.value });
              }}
            ></input>
            <input
              type="text"
              value={this.state.character}
              onChange={(event) => {
                this.setState({ character: event.target.value });
              }}
            ></input>
            <button>Submit</button>
          </form> */}
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
