import React, { Component } from "react";
import styles from "./css/SidePanel.module.css";
import { emotionRecFullFunction } from "../../public/emotion-rec.js";
import angry from "../assets/angryEmoji.png";
import happy from "../assets/happyEmoji.png";
import sad from "../assets/sadEmoji.png";
import surprised from "../assets/surprisedEmoji.png";
// Have to load in emoji pics here for Webpack compatibility
const emojiPics = { angry, happy, sad, surprised }; // To reference later in map function

export default class LobbySidePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      trivialVariable: "oo",
      // photoSet: {
      //   happy: { src: null },
      //   angry: { src: null },
      //   sad: { src: null },
      //   surprised: { src: null },
      // },
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.socket) {
      //********************** */
      let cb = this.setStateCallbackToSidePanel;

      this.state.socket.on("image", function (info) {
        console.log(">>>image");
        for (let i = 0; i < 1; i++) {
          if (info.image) {
            // console.log("cb", cb);
            // console.log(info.buffer);
            var img = new Image();
            img.src = "data:image/jpeg;base64," + info.buffer;
            var ctx = document.getElementById("testCanvas").getContext("2d");

            setTimeout(() => {
              ctx.drawImage(img, 0, 0);
              console.log("bounced image", img);
            }, 3000);

            // cb("trivialVariable", "boo");
          }
        }
      });
      //********************** */
    }

    if (this.state.myUsername !== this.props.myUsername) {
      this.setState({ myUsername: this.props.myUsername });
    }

    if (this.state.iJustEnteredLobbyOrRoom) {
      console.log("gonna CALL face rec");
      this.setState({ iJustEnteredLobbyOrRoom: false });
      emotionRecFullFunction(
        this.props.setStateCallback,
        this.setStateCallbackToSidePanel
      );
    }
  }
  render() {
    const {
      socket,
      currentEmotion,
      currentRoom,
      myUsername,
      emoObj,
      // photoSet,
    } = this.state;

    return (
      <div className={styles.rightPanelDisplay}>
        <div className={styles.topbox}>
          <div id="videoContainer" className={styles.videoContainer}>
            <video id="video" className={styles.video} autoPlay muted></video>
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
                      src={emojiPics[emoObj.name]}
                      className={styles.emoEmoji}
                      id={`${emoObj.name}Image`}
                      alt={emoObj.name}
                    />
                    <p className={styles.emoLabel} id={`${emoObj.name}Action`}>
                      {emoObj.name.toUpperCase() === "SURPRISED"
                        ? "SHOCKED"
                        : emoObj.name.toUpperCase()}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        <div className={styles.midboxLobby}>
          <div>
            <p className={styles.instructions}>
              {/* ********************* */}
              {/* <canvas id="testCanvas"></canvas>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  socket.emit("send me image");
                }}
              >
                IMAGE
              </button> */}
              {/* ********************* */}
              Pull a face and we'll capture your emotion! This is optional and{" "}
              <strong>personalises</strong> your worm!
              <br />
              <br />
              Wormplay is a fast-paced competitive <strong>
                word game
              </strong>{" "}
              that combines scrabble and coordination. Remember - words are
              always spelled
              <strong> head to tail</strong>.
              <br />
              <br />
              When you're ready, click a room to enter, or create a new room.
              <br />
              <br />
              Good luck, and happy worming!
            </p>
          </div>
        </div>
      </div>
    );
  }
}
