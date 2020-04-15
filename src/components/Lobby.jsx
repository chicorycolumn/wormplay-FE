import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import styles from "./css/Lobby.module.css";

import SidePanel from "./SidePanel.jsx";

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
          <div>
            <ReactGameHolder
              socket={socket}
              currentEmotion={currentEmotion}
              playersDetails={playersDetails}
              myUsername={myUsername}
            />
            <SidePanel
              socket={socket}
              playersDetails={playersDetails}
              currentEmotion={currentEmotion}
              myUsername={myUsername}
              emoObj={emoObj}
              iJustLoggedIn={iJustLoggedIn}
            />
          </div>
        ) : (
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
        )}
      </div>
    );
  }
}
