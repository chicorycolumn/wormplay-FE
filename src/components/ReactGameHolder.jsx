import React, { Component } from "react";
import PhaserGame from "../phaser/PhaserGameCreator";

export default class ReactGame extends Component {
  constructor() {
    super();
    this.state = {
      info: "This is the state that phaser's MainScene.js has access to.",
      socket: null,
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);
    this.setState({ socket: this.props.socket });
  }

  //   shouldComponentUpdate() {return false}

  render() {
    return <div id="inside-react-game-holder"></div>;
  }
}
