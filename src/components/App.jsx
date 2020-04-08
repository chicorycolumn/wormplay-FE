import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends React.Component {
  state = {
    message: "",
    endpoint: "http://localhost:4001",
    p1Chars: ["h", "i", "j", "k", "l", "m", "n"],
    p2Chars: ["a", "b", "c", "d", "e", "f", "g"],
    isP1: false,
    isP2: false,
    index: undefined,
    character: "",
    needUpdate: false,
  };

  componentDidMount() {
    console.log("incomponentdidmount");
    const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);
    // console.log(socket, "socket");

    socket.on("news", (data) => {
      this.setState({ message: data.hello });
      // console.log(data);
    });

    socket.on("server update", (data) => {
      this.setState({ message: data.hello });
      // console.log(data);
    });
    socket.on("player1", (data) => {
      this.setState({ isP1: data.p1 });
      console.log("player1");
      // console.log(this.state.isP1);
    });
    socket.on("player2", (data) => {
      this.setState({ isP2: data.p2 });
      console.log("player2");
      // console.log(this.state.p2);
    });
    socket.on("updatedP1Chars", (data) => {
      this.setState({ p1Chars: data.p1Chars });
    });
    socket.on("updatedP2Chars", (data) => {
      this.setState({ p2Chars: data.p2Chars });
    });
    // if (this.state.needUpdate === true) {
    //   socket.emit("p1ArrayUpdate", { p1Chars: this.state.p1Chars });
    //   this.setState({ needUpdate: false });
    // }
  }

  handleSubmit = (event) => {
    const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);
    event.preventDefault();
    if (this.state.isP1 === true) {
      this.setState((currentState) => {
        const { index, character } = currentState;
        currentState.p1Chars.splice(index, 1, character);
        console.log(currentState.p1Chars);
        this.setState({ p1Chars: currentState.p1Chars });
        socket.emit("p1ArrayUpdate", { p1Chars: this.state.p1Chars });
      });
    }
    if (this.state.isP2 === true) {
      this.setState((currentState) => {
        const { index, character } = currentState;
        currentState.p2Chars.splice(index, 1, character);
        this.setState({ p2Chars: currentState.p2Chars });
        socket.emit("p2ArrayUpdate", { p2Chars: this.state.p2Chars });
      });
    }
  };

  render() {
    const { endpoint, isP1, isP2, p1Chars, p2Chars } = this.state;
    console.log(this.state, "state");
    return (
      <div>
        <p>hello</p>
        {isP1
          ? p2Chars.map((char) => {
              return <p key={"x"}>{char}</p>;
            })
          : null}
        {isP2
          ? p1Chars.map((char) => {
              return <p key={"y"}>{char}</p>;
            })
          : null}
        <form onSubmit={this.handleSubmit}>
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
    );
  }
}

export default App;
