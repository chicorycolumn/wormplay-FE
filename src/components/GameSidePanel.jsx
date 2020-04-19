import React, { Component } from "react";
import styles from "./css/SidePanel.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";

export default class GameSidePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      photoSet: {
        happy: { src: null },
        angry: { src: null },
        sad: { src: null },
        surprised: { src: null },
      },

      socket: null,
      myUsername: "",
      iJustEnteredLobbyOrRoom: true,
      emoObj: [
        { name: "happy", action: "rush" },
        { name: "angry", action: "steal" },
        { name: "surprised", action: "drop" },
        { name: "sad", action: "time" },
      ],
      currentRoom: {
        roomID: null,
        roomName: null,
        p1: { id: null, username: null },
        p2: { id: null, username: null },
      },
    };
    this.setStateCallbackToSidePanel = this.setStateCallbackToSidePanel.bind(
      this
    );
  }

  setStateCallbackToSidePanel = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  componentDidMount() {
    let {
      socket,

      myUsername,

      currentRoom,
    } = this.props;
    this.setState({
      socket,

      myUsername,

      currentRoom,
    });
    const infoDisplay = document.getElementById("infoDisplay");
    if (infoDisplay) {
      let newLi = document.createElement("li");
      newLi.style.margin = "8px";
      newLi.innerHTML =
        "Ding ding! " +
        "<strong>" +
        this.props.myUsername +
        "</strong>" +
        " (that's you) just entered!";

      infoDisplay.appendChild(newLi);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.socket) {
      this.state.socket.on("a player entered your game", (data) => {
        //A check, so that we only fire this fxn if the entering player is different or new. To avert MFIR.
        if (
          (this.state.socket.id === this.state.currentRoom.p1.id &&
            data.enteringPlayerID !== this.state.currentRoom.p2.id) ||
          (this.state.socket.id === this.state.currentRoom.p2.id &&
            data.enteringPlayerID !== this.state.currentRoom.p1.id)
        ) {
          console.log("inside socket.on a player entered your game");
          const { currentRoom } = data;

          let infoDisplay = document.getElementById("infoDisplay");

          let newLi = document.createElement("li");
          newLi.style.margin = "8px";
          newLi.innerHTML =
            "Look out! Haha, cos " +
            "<strong>" +
            `${data.enteringPlayerUsername}` +
            "</strong>" +
            "'s here!";
          infoDisplay.appendChild(newLi);

          this.setState({
            currentRoom,
          });
        }
      });

      this.state.socket.on("a player left your game", (data) => {
        //A check, so that we only fire this fxn once per exiting player. To avert the MFIR problem.
        if (
          (this.state.socket.id === this.state.currentRoom.p1.id &&
            data.leavingPlayerID === this.state.currentRoom.p2.id) ||
          (this.state.socket.id === this.state.currentRoom.p2.id &&
            data.leavingPlayerID === this.state.currentRoom.p1.id)
        ) {
          console.log("inside socket.on a player left your game");
          const { currentRoom } = data;

          let infoDisplay = document.getElementById("infoDisplay");

          let newLi = document.createElement("li");
          newLi.style.margin = "8px";
          newLi.innerHTML =
            "Woah! Looks like " +
            "<strong>" +
            `${data.leavingPlayerUsername}` +
            "</strong>" +
            " bodged off!";
          infoDisplay.appendChild(newLi);

          this.setState({
            currentRoom,
          });
        }
      });
    }

    // if (prevState.currentEmotion.src !== this.props.currentEmotion.src) {
    //   this.setState({ currentEmotion: this.props.currentEmotion });
    // }
    // if (
    //   this.state.currentRoom.p1.id !== this.props.currentRoom.p1.id ||
    //   this.state.currentRoom.p2.id !== this.props.currentRoom.p2.id
    // ) {
    //   this.setState({ currentRoom: this.props.currentRoom });
    // }
    if (this.state.myUsername !== this.props.myUsername) {
      this.setState({ myUsername: this.props.myUsername });
    }
  }
  render() {
    const {
      socket,
      currentEmotion,
      currentRoom,
      myUsername,
      emoObj,
      photoSet,
    } = this.state;

    return (
      <div className={styles.rightPanelDisplay}>
        <div className={styles.topbox}>
          <div className={styles.emojiHolder}>
            {Object.keys(photoSet).map((label) => {
              return (
                //*********** JAMES this is where I tried to set the webcam photo sources as
                //pictures in the game sidebar, though I didn't spend much time finding out
                //how to set source, so currently they don't display. *********************/
                <div className={styles.emoHolder} id={`${emoObj.name}Holder`}>
                  <img
                    src={photoSet[label].src}
                    className={styles.emoEmoji}
                    id={`${label}Photo`}
                  />
                  <p className={styles.emoLabel} id={`${label}Action`}>
                    {label.toUpperCase()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.midbox}>
          <div>
            <p
              className={styles.roomsDisplay}
            >{`Room: ${this.state.currentRoom.roomName}`}</p>
            <div className={styles.playerNamesBox}>
              <p className={styles.playersDisplay}>{`Player 1: ${
                currentRoom.p1.username ? currentRoom.p1.username : "waiting..."
              }`}</p>
              <p className={styles.playersDisplay}>{`Player 2: ${
                currentRoom.p2.username ? currentRoom.p2.username : "waiting..."
              }`}</p>
            </div>

            <ul id="infoDisplay" className={styles.infoDisplay}></ul>
          </div>
        </div>
        <div className={styles.bottombox}>
          {currentRoom.p1.username !== null &&
          currentRoom.p2.username !== null ? (
            <div>
              <p>{currentRoom.p1.username + ": " + currentRoom.p1.score}</p>
              <p>{currentRoom.p2.username + ": " + currentRoom.p2.score}</p>
            </div>
          ) : (
            "waiting..."
          )}
        </div>
      </div>
    );
  }
}
