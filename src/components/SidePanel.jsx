import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/SidePanel.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";

export default class SidePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      socket: null,
      currentEmotion: { name: null, src: null },
      playersDetails: {
        p1: { username: null, id: null, score: 0 },
        p2: { username: null, id: null, score: 0 },
      },
      myUsername: "",
      shouldIEnterRoom: false,
      emoObj: null,
      iJustLoggedIn: false,
    };
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  setStateCallback = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  componentDidMount() {
    let {
      socket,
      playersDetails,
      currentEmotion,
      myUsername,
      emoObj,
      iJustLoggedIn,
    } = this.props;
    this.setState({
      socket,
      playersDetails,
      currentEmotion,
      myUsername,
      emoObj,
      iJustLoggedIn,
    });
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
  render() {
    const {
      socket,
      currentEmotion,
      playersDetails,
      myUsername,
      emoObj,
    } = this.state;

    return (
      <div className={styles.rightPanelDisplay}>
        {/* /////////////////THIS IS WHERE WE CALL THE FACE RECOGNITION. */}
        {this.state.iJustLoggedIn &&
          setTimeout(() => {
            this.setState({ iJustLoggedIn: false });
            emotionRecFullFunction(this.setStateCallback);
          }, 0)}
        {/* /////////////////*/}
        <div className={styles.topbox}>
          <div id="videoContainer" className={styles.videoContainer}>
            {/* <div id="videoObscurer" className={styles.videoObscurer}>
                          video obscured for you
                        </div> */}
            <video id="video" className={styles.video} autoPlay muted></video>

            {/* <canvas
                          id="canvasDetections"
                          className={styles.canvasDetections}
                        ></canvas> */}
            <canvas id="canvasPhoto" className={styles.canvasPhoto}></canvas>
          </div>
          <div className={styles.emojiHolder}>
            {emoObj &&
              emoObj.map((emoObj) => {
                return (
                  <div className={styles.emoHolder} id={`${emoObj.name}Holder`}>
                    <p className={styles.emoBars} id={`${emoObj.name}Bars`}>
                      □□□□
                    </p>
                    <img
                      src={`src/assets/${emoObj.name}Emoji.png`}
                      className={styles.emoEmoji}
                      id={`${emoObj.name}Image`}
                    />
                    <p className={styles.emoLabel} id={`${emoObj.name}Action`}>
                      {emoObj.action.toUpperCase()}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.midbox}>
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
