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
      currentEmotion: { name: null, src: null },
      playersDetails: {
        p1: { username: null, id: null, score: 0 },
        p2: { username: null, id: null, score: 0 },
      },
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
        currentEmotion: this.props.currentEmotion,
      });
    } else if (this.props.socket.id === this.props.playersDetails.p2.id) {
      this.setState({
        socket: this.props.socket,
        isP2: true,
        currentEmotion: this.props.currentEmotion,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentEmotion.src !== this.props.currentEmotion.src) {
      this.setState({ currentEmotion: this.props.currentEmotion });
    }
    if (
      this.state.playersDetails.p1.id !== this.props.playersDetails.p1.id ||
      this.state.playersDetails.p2.id !== this.props.playersDetails.p2.id
    ) {
      this.setState({ playersDetails: this.props.playersDetails });
    }
  }

  //   shouldComponentUpdate() {return false}

  render() {
    return <div className={styles.test}></div>;
  }
}
