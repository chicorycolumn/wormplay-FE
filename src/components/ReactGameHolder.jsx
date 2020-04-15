import React, { Component } from "react";
import PhaserGame from "../phaser/PhaserGameCreator";
import styles from "./css/App.module.css";

//You can access the socket as `this.state.socket`. But you shouldn't need it in this component.

export default class ReactGame extends Component {
  constructor() {
    super();
    this.state = {
      info: "This is the state that phaser's MainScene.js has access to.",
      socket: null,
      isP1: false,
      isP2: false,
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);
    if (this.props.socket.id === this.props.playersDetails.p1.id) {
      this.setState({
        socket: this.props.socket,
        isP1: true,
      });
    } else if (this.props.socket.id === this.props.playersDetails.p2.id) {
      this.setState({
        socket: this.props.socket,
        isP2: true,
      });
    }
  }

  //   shouldComponentUpdate() {return false}

  render() {
    return <div className={styles.test}></div>;
  }
}
