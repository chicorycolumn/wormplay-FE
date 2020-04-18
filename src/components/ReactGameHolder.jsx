import React, { Component } from "react";
import PhaserGame from "../phaser/PhaserGameCreator";
import styles from "./css/App.module.css";

//You can access the socket as `this.state.socket`. But you shouldn't need it in this component.

export default class ReactGame extends Component {
  constructor() {
    super();
    this.state = {
      photoSet: {
        happy: { src: null },
        angry: { src: null },
        sad: { src: null },
        surprised: { src: null },
      },
      info: "This is the state that phaser's MainScene.js has access to.",
      socket: null,
      currentEmotion: { name: null, src: null },
      currentRoom: {
        roomID: null,
        roomName: null,
        p1: { id: null, username: null },
        p2: { id: null, username: null },
      },
      isP1: false,
      isP2: false,
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);

    this.setState({
      socket: this.props.socket,
      isP1: this.props.socket.id === this.props.currentRoom.p1.id,
      isP2: this.props.socket.id === this.props.currentRoom.p2.id,
      currentEmotion: this.props.currentEmotion,
      photoSet: this.props.photoSet,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(this.state.photoSet).filter((emotion) => {
        this.state.photoSet[emotion].src !== this.props.photoSet[emotion].src;
      }).length
    ) {
      this.setState({ photoSet: this.props.photoSet });
    }

    if (
      this.state.currentRoom.p1.id !== this.props.currentRoom.p1.id ||
      this.state.currentRoom.p2.id !== this.props.currentRoom.p2.id
    ) {
      this.setState({ currentRoom: this.props.currentRoom });
    }
  }

  //   shouldComponentUpdate() {return false}

  render() {
    return <div className={styles.test}></div>;
  }
}
