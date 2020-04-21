import React, { Component } from "react";
import PhaserGame from "../phaser/PhaserGameCreator";
import styles from "./css/App.module.css";

//You can access the socket as `this.state.socket`. But you shouldn't need it in this component.

export default class ReactGame extends Component {
  constructor() {
    super();
    this.state = {
      opponentPlayerFaces: {
        happyFace: null,
        sadFace: null,
        angryFace: null,
        shockedFace: null,
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
      setStateCallback: () => {
        console.log("Haven't set SSC fxn in ReactGameHolder yet.");
      },
    };
  }

  componentDidMount() {
    this.game = new PhaserGame(this);

    this.setState({
      socket: this.props.socket,
      isP1: this.props.socket.id === this.props.currentRoom.p1.id,
      isP2: this.props.socket.id === this.props.currentRoom.p2.id,
      currentEmotion: this.props.currentEmotion,
      setStateCallback: this.props.setStateCallback,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("CDU of RGH, state", this.state.currentRoom);
    // console.log("CDU of RGH, props", this.props.currentRoom);

    if (this.state.socket) {
      this.state.socket.on("a player entered your game", (data) => {
        //A check, so that we only fire this fxn if the entering player is different or new. To avert MFIR.
        if (
          (this.state.socket.id === this.state.currentRoom.p1.id &&
            data.enteringPlayerID !== this.state.currentRoom.p2.id) ||
          (this.state.socket.id === this.state.currentRoom.p2.id &&
            data.enteringPlayerID !== this.state.currentRoom.p1.id)
        ) {
          console.log(
            "REACTGAMEHOLDER inside socket.on a player entered your game"
          );
          const { currentRoom } = data;

          this.setState({
            currentRoom,
            opponentPlayerFaces: data.enteringPlayer.playerFaces,
          });

          //set state of lobby with new currentRoom
          this.props.setStateCallback("currentRoom", currentRoom);

          this.game.destroy(true);
          setTimeout(() => {
            this.game = new PhaserGame(this);
          }, 2000); //Possible screw point.

          setTimeout(() => {
            console.log(
              "REACTGAMEHOLDER this.state.currentRoom",
              this.state.currentRoom
            );
          }, 1000); //Possible screw point.
        }
      });
    }

    if (
      Object.keys(this.state.opponentPlayerFaces).filter((emotion) => {
        this.state.opponentPlayerFaces[emotion] !==
          this.props.opponentPlayerFaces[emotion];
      }).length
    ) {
      this.setState({ opponentPlayerFaces: this.props.opponentPlayerFaces });
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
