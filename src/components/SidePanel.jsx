import React, { Component } from "react";
import styles from "./css/SidePanel.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";

export default class SidePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      photoSet: {
        happy: { src: null },
        angry: { src: null },
        sad: { src: null },
        surprised: { src: null },
      },
      currentComponent: null,
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
      currentComponent,
      currentRoom,
    } = this.props;
    this.setState({
      socket,

      myUsername,
      currentComponent,
      currentRoom,
    });
  }

  componentDidUpdate(prevProps, prevState) {
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
    if (this.state.currentComponent !== this.props.currentComponent) {
      this.setState({ currentComponent: this.props.currentComponent });
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

    console.log("SIDEPANEL says currentRoom is ", currentRoom);

    return (
      <div className={styles.rightPanelDisplay}>
        {this.state.iJustEnteredLobbyOrRoom &&
          this.props.currentComponent === "lobby" &&
          setTimeout(() => {
            console.log("gonna CALL face rec");
            this.setState({ iJustEnteredLobbyOrRoom: false });
            emotionRecFullFunction(
              this.props.setStateCallback,
              this.setStateCallbackToSidePanel
            );
          }, 1000)}
        {this.props.currentComponent === "lobby" && (
          <div className={styles.topbox}>
            <div id="videoContainer" className={styles.videoContainer}>
              <video id="video" className={styles.video} autoPlay muted></video>
              <canvas id="canvasPhoto" className={styles.canvasPhoto}></canvas>
            </div>
            <div className={styles.emojiHolder}>
              {emoObj &&
                emoObj.map((emoObj) => {
                  return (
                    <div
                      className={styles.emoHolder}
                      id={`${emoObj.name}Holder`}
                    >
                      <p className={styles.emoBars} id={`${emoObj.name}Bars`}>
                        □□□□
                      </p>
                      <img
                        src={`src/assets/${emoObj.name}Emoji.png`}
                        className={styles.emoEmoji}
                        id={`${emoObj.name}Image`}
                      />
                      <p
                        className={styles.emoLabel}
                        id={`${emoObj.name}Action`}
                      >
                        {emoObj.name.toUpperCase()}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {this.props.currentComponent === "game" && (
          <div className={styles.topbox}>
            {/* <div id="videoContainer" className={styles.videoContainer}>
              <video id="video" className={styles.video} autoPlay muted></video>
              <canvas id="canvasPhoto" className={styles.canvasPhoto}></canvas>
            </div> */}
            <div className={styles.emojiHolder}>
              {Object.keys(photoSet).map((label) => {
                return (
                  //*********** JAMES this is where I tried to set the webcam photo sources as
                  //pictures in the game sidebar, though I didn't spend much time finding out
                  //how to set source, so currently they don't display. *********************/
                  <div className={styles.emoHolder} id={`${emoObj.name}Holder`}>
                    {/* <p className={styles.emoBars} id={`${emoObj.name}Bars`}>□□□□</p> */}
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
        )}
        <div className={styles.midbox}>
          {this.state.currentComponent === "lobby" && (
            <div>
              <h2>{`Hey ${myUsername}!`}</h2>
              <p>
                Wormplay is a fast-paced competitive word game that combines
                scrabble and eye-hand coordination. You can take some pictures
                of yourself with your webcam above, which will personalise your
                worm! Don't worry though, this is completely optional. <br />
                When you're ready, click a room to enter, or create a new room.
                Don't forget - the words are always spelled from{" "}
                <strong>head to tail</strong>. <br /> Good luck, and happy
                worming!
              </p>
            </div>
          )}

          {this.state.currentComponent === "game" && (
            <div>
              <p id="youAre"></p>
              <p
                id="playersDisplay"
                className={styles.playersDisplay}
              >{`Player 1: ${
                currentRoom.p1.username ? currentRoom.p1.username : "waiting..."
              } - - - - - Player 2: ${
                currentRoom.p2.username ? currentRoom.p2.username : "waiting..."
              }`}</p>
              <ul id="infoDisplay" className={styles.infoDisplay}></ul>
              <div className={styles.bottombox}>
                {currentRoom.p1.username !== null &&
                currentRoom.p2.username !== null ? (
                  <div>
                    <p>
                      {currentRoom.p1.username + ": " + currentRoom.p1.score}
                    </p>
                    <p>
                      {currentRoom.p2.username + ": " + currentRoom.p2.score}
                    </p>
                  </div>
                ) : (
                  "waiting..."
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
