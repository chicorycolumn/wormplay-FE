import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/Lobby.module.css";
import genStyles from "./css/General.module.css";

import SidePanel from "./SidePanel.jsx";

let exampleLobbyData = [
  {
    id: "gr8", //possible screw point
    roomName: "dragon team",
    passcode: "1234",
    p1: { username: "lenka", id: "33e" },
    p2: { username: "bazinski", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "team",
    passcode: "1234",
    p1: { username: "l", id: "33e" },
    p2: { username: "b", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "dragon",
    passcode: "1234",
    p1: { username: "a", id: "33e" },
    p2: { username: "i", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "DT",
    passcode: "1234",
    p1: { username: "en", id: "33e" },
    p2: { username: "az", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "eam",
    passcode: "1234",
    p1: { username: "ka", id: "33e" },
    p2: { username: "ki", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "drag",
    passcode: "1234",
    p1: { username: "ll", id: "33e" },
    p2: { username: "bb", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "dragon team",
    passcode: "1234",
    p1: { username: "lenka", id: "33e" },
    p2: { username: "bazinski", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "dream",
    passcode: "1234",
    p1: { username: "la", id: "33e" },
    p2: { username: "bi", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "dr",
    passcode: "1234",
    p1: { username: "le", id: "33e" },
    p2: { username: "ba", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "dragon team",
    passcode: "1234",
    p1: { username: "lenka", id: "33e" },
    p2: { username: "bazinski", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "drago",
    passcode: "1234",
    p1: { username: "lenk", id: "33e" },
    p2: { username: "bazin", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "doctor",
    passcode: "1234",
    p1: { username: "lenkanda", id: "33e" },
    p2: { username: "baz", id: "44r" },
  },
  {
    id: "gr8", //possible screw point
    roomName: "drm",
    passcode: "1234",
    p1: { username: "lea", id: "33e" },
    p2: { username: "bai", id: "44r" },
  },
];

export default class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      shallIBotherLoadingTheGame: true, //TOGGLE THIS DURING DEVELOPMENT.
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
  }

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
      iJustLoggedIn,
    } = this.state;

    return (
      <div>
        {this.state.shouldIEnterRoom &&
        this.state.shallIBotherLoadingTheGame ? (
          <div id="georgine" className={genStyles.georgine}>
            <div id="leftPanel" className={genStyles.leftPanel}>
              <ReactGameHolder
                socket={socket}
                currentEmotion={currentEmotion}
                playersDetails={playersDetails}
                myUsername={myUsername}
              />
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              <SidePanel
                socket={socket}
                playersDetails={playersDetails}
                currentEmotion={currentEmotion}
                myUsername={myUsername}
                emoObj={emoObj}
                iJustLoggedIn={iJustLoggedIn}
              />
            </div>
          </div>
        ) : (
          <div id="georgine" className={genStyles.georgine}>
            <div id="leftPanel" className={genStyles.leftPanel}>
              <div>
                <h1
                  className={styles.heading}
                >{`Hello ${this.state.myUsername}, and welcome to the lobby!`}</h1>
                <button
                  className={styles.buttons}
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ shouldIEnterRoom: true });
                  }}
                >
                  ENTOR
                </button>
              </div>
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              camera...
            </div>
          </div>
        )}
      </div>
    );
  }
}
