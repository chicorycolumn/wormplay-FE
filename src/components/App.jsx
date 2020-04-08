import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends React.Component {
  state = {
    message: "",
    endpoint: "http://localhost:4001",
    p1Chars: ["", "", "", "", "", "", ""],
    p2Chars: ["", "", "", "", "", "", ""],
    isP1: false,
    isP2: false,
  };

  componentDidMount() {
    console.log("incomponentdidmount");
    const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);
    console.log(socket, "socket");

    socket.on("news", (data) => {
      this.setState({ message: data.hello });
      console.log(data);
    });

    socket.on("server update", (data) => {
      this.setState({ message: data.hello });
      console.log(data);
    });
  }

  render() {
    const { endpoint } = this.state;
    console.log(this.state.message, "state");
    return (
      <div>
        <p>hello</p>

        <br></br>
        <p>{this.state.message}</p>
        <button
          onClick={(event) => {
            const socket = socketIOClient(endpoint);
            socket.emit("my other event", { my: "james" });
          }}
        >
          click me
        </button>
      </div>
    );
  }
}

export default App;
