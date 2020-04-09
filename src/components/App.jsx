import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";

//You can access the socket as `this.state.socket`.
//I (Chris) suggest that in this file, we use the socket for pre-game stuff, logging in kinda things,
//and then in MainScene.js, that's where we use the socket for in-game stuff, movement kinda things.

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: null, //This gets setStated as the socket from props from index.js.
      message: "",
      p1Chars: ["h", "i", "j", "k", "l", "m", "n"],
      p2Chars: ["a", "b", "c", "d", "e", "f", "g"],
      whichPlayerAmI: null,
      index: undefined,
      character: "",
      needUpdate: false,
      amILoggedIn: false,
      loginField: "",
      myUsername: "",
      isRoomFull: false,
      playersDetails: {
        p1: { username: null, id: null },
        p2: { username: null, id: null },
      },
    };
    // this.changeMyState = this.changeMyState.bind(this);
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
  }

  handleSubmitLetterChange = (event) => {
    event.preventDefault();
    if (this.state.whichPlayerAmI === "p1") {
      this.setState((currentState) => {
        const { index, character } = currentState;
        currentState.p1Chars.splice(index, 1, character);

        this.setState({ p1Chars: currentState.p1Chars });
        this.state.socket.emit("p1ArrayUpdate", {
          p1Chars: this.state.p1Chars,
        });
      });
    }
    if (this.state.whichPlayerAmI === "p2") {
      this.setState((currentState) => {
        const { index, character } = currentState;
        currentState.p2Chars.splice(index, 1, character);
        this.setState({ p2Chars: currentState.p2Chars });
        this.state.socket.emit("p2ArrayUpdate", {
          p2Chars: this.state.p2Chars,
        });
      });
    }
  };

  render() {
    if (this.state.socket) {
      this.state.socket.on("loginConf", (data) => {
        if (data.youCanEnter) {
          let whichPlayerAmI = null;

          if (this.state.socket.id === data.playersDetails.p1.id) {
            whichPlayerAmI = "p1";
          }
          if (this.state.socket.id === data.playersDetails.p2.id) {
            whichPlayerAmI = "p2";
          }

          this.setState({
            amILoggedIn: true,
            whichPlayerAmI,
            playersDetails: data.playersDetails,
          });
        } else {
          this.setState({ isRoomFull: true });
        }
      });

      this.state.socket.on("updatedP1Chars", (data) => {
        this.setState({ p1Chars: data.p1Chars });
      });
      this.state.socket.on("updatedP2Chars", (data) => {
        this.setState({ p2Chars: data.p2Chars });
      });
    }
    const {
      isRoomFull,
      whichPlayerAmI,
      p1Chars,
      p2Chars,
      myUsername,
      playersDetails,
      socket,
    } = this.state;

    return (
      <div>
        {this.state.amILoggedIn ? (
          <div>
            <ReactGameHolder socket={socket} />
            <p
              id="infoDisplay"
              style={{ color: "blue" }}
            >{`Welcome ${myUsername} to the game!`}</p>
            <p
              id="playersDisplay"
              style={{ color: "blue" }}
            >{`-------Player 1: ${
              playersDetails.p1.username
                ? playersDetails.p1.username
                : "waiting..."
            }-------Player 2: ${
              playersDetails.p2.username
                ? playersDetails.p2.username
                : "waiting..."
            }-------`}</p>
            {whichPlayerAmI === "p1"
              ? p2Chars.map((char) => {
                  return <p key={"x"}>{char}</p>;
                })
              : null}
            {whichPlayerAmI === "p2"
              ? p1Chars.map((char) => {
                  return <p key={"y"}>{char}</p>;
                })
              : null}
            <form onSubmit={this.handleSubmitLetterChange}>
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
            </form>
          </div>
        ) : isRoomFull ? (
          <p
            style={{ color: "blue" }}
          >{`Fuck! I'm so sorry ${this.state.myUsername} but the room is full!`}</p>
        ) : (
          <form>
            <input
              style={{ height: "45px", width: "250px" }}
              id="loginField"
              value={this.state.loginField}
              onChange={(e) => {
                this.setState({ loginField: e.target.value });
              }}
              placeholder="Welcome! Please enter your name."
            ></input>
            <button
              style={{ height: "50px", width: "100px" }}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                const myUsername = this.state.loginField;
                this.state.socket.emit("login", { username: myUsername });
                this.setState({ myUsername, loginField: "" });
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

// socket.on("news", (data) => {
//   this.setState({ message: data.hello });
//   // console.log(data);
// });

// socket.on("server update", (data) => {
//   this.setState({ message: data.hello });
//   // console.log(data);
// });
// socket.on("player1", (data) => {
//   this.setState({ isP1: data.p1 });
//   console.log("player1");
//   // console.log(this.state.isP1);
// });
// socket.on("player2", (data) => {
//   this.setState({ isP2: data.p2 });
//   console.log("player2");
//   // console.log(this.state.p2);
// });
