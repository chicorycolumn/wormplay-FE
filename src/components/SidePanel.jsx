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
      playersDetails: {
        p1: { username: null, id: null, score: 0 },
        p2: { username: null, id: null, score: 0 },
      },
      myUsername: "",
      iJustEnteredLobbyOrRoom: true,
      emoObj: [
        { name: "happy", action: "rush" },
        { name: "angry", action: "steal" },
        { name: "surprised", action: "drop" },
        { name: "sad", action: "time" },
      ],
    };
  }

  componentDidMount() {
    let { socket, playersDetails, myUsername, currentComponent } = this.props;
    console.log("gonna set state with ", myUsername);
    this.setState({
      socket,
      playersDetails,
      myUsername,
      currentComponent,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.currentEmotion.src !== this.props.currentEmotion.src) {
    //   this.setState({ currentEmotion: this.props.currentEmotion });
    // }
    if (
      this.state.playersDetails.p1.id !== this.props.playersDetails.p1.id ||
      this.state.playersDetails.p2.id !== this.props.playersDetails.p2.id
    ) {
      this.setState({ playersDetails: this.props.playersDetails });
    }
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
      playersDetails,
      myUsername,
      emoObj,
      photoSet,
    } = this.state;

    return (
      <div className={styles.rightPanelDisplay}>
        {this.state.iJustEnteredLobbyOrRoom &&
          this.props.currentComponent === "lobby" &&
          setTimeout(() => {
            console.log("gonna call face rec");
            this.setState({ iJustEnteredLobbyOrRoom: false });
            emotionRecFullFunction(this.props.setStateCallback);
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
                playersDetails.p1.username
                  ? playersDetails.p1.username
                  : "waiting..."
              } - - - - - Player 2: ${
                playersDetails.p2.username
                  ? playersDetails.p2.username
                  : "waiting..."
              }`}</p>
              <ul id="infoDisplay" className={styles.infoDisplay}></ul>
            </div>
          )}
        </div>
        <div className={styles.bottombox}>
          {playersDetails.p1.username !== null &&
          playersDetails.p2.username !== null ? (
            <div>
              <p>
                {playersDetails.p1.username + ": " + playersDetails.p1.score}
              </p>
              <p>
                {playersDetails.p2.username + ": " + playersDetails.p2.score}
              </p>
            </div>
          ) : (
            "waiting..."
          )}
        </div>
      </div>
    );
  }
}
