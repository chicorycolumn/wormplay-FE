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
      faceValue: false,
      currentEmotion: { name: null, src: null },
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);
    this.setState({
      socket: this.props.socket,
      currentEmotion: this.props.currentEmotion,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentEmotion.src !== this.props.currentEmotion.src) {
      this.setState({ currentEmotion: this.props.currentEmotion });
    }
  }

  //   shouldComponentUpdate() {return false}

  render() {
    return <div className={styles.test}></div>;
  }
}
