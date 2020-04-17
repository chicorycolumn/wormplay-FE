import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import SidePanel from "./SidePanel.jsx";
import styles from "./css/Lobby.module.css";
import genStyles from "./css/General.module.css";

export default class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      happyData: { src: null },
      sadData: { src: null },
      angryData: { src: null },
      surprisedData: { src: null },
      shallIBotherLoadingTheGame: true, //TOGGLE THIS DURING DEVELOPMENT.
      socket: null,
      playersDetails: {
        p1: { username: null, id: null, score: 0 },
        p2: { username: null, id: null, score: 0 },
      },
      myUsername: "",
      iHavePermissionToEnterRoom: false, //DEVELOPMENT
      rooms: [],
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
      myUsername,
      iHavePermissionToEnterRoom,
      rooms,
    } = this.props;
    this.setState({
      socket,
      playersDetails,
      myUsername,
      iHavePermissionToEnterRoom,
      rooms,
    });
  }

  joinRoom = (roomID) => {
    this.state.socket.emit("joinRoom", { roomID });
  };

  quitRoom = () => {
    console.log("gonna try quitting room 3!");
    this.state.socket.emit("quitRoom");
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.playersDetails.p1.id !== this.props.playersDetails.p1.id ||
      this.state.playersDetails.p2.id !== this.props.playersDetails.p2.id
    ) {
      this.setState({ playersDetails: this.props.playersDetails });
    }

    if (this.state.socket) {
      this.state.socket.on("connectionRefused", () => {
        console.log(`Oh no! The room was full or something.`);
      });

      this.state.socket.on("youJoinedARoom", (data) => {
        console.log(`Seems like we successfully joined ${data.room.roomID}`);
        //A check to avoid MFIR.
        if (data.youCanEnter) {
          console.log("inside socket.on youJoinedARoom");
          if (data.youCanEnter) {
            let whichPlayerAmI = data.whichPlayerIsShe;

            let welcomeMessage =
              "Hey " +
              "<strong>" +
              `${data.playersDetails[`${whichPlayerAmI}`].username}` +
              "</strong>" +
              ", it's awesome you're here!";

            this.setState({
              whichPlayerAmI,
              playersDetails: data.playersDetails,
              welcomeMessage,
              iHavePermissionToEnterRoom: true,
              currentRoomIAmIn: data.room.roomID,
            });
          }
        }
      });

      this.state.socket.on("a player entered the game", (data) => {
        //A check, so that we only fire this fxn if the entering player is different or new. To avert MFIR.
        if (
          (this.state.whichPlayerAmI === "p1" &&
            data.enteringPlayerID !== this.state.playersDetails.p2.id) ||
          (this.state.whichPlayerAmI === "p2" &&
            data.enteringPlayerID !== this.state.playersDetails.p1.id)
        ) {
          console.log("inside socket.on a player entered the game");
          const { playersDetails } = data;

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
            playersDetails,
          });
        }
      });

      this.state.socket.on("a player left the game", (data) => {
        //A check, so that we only fire this fxn once per exiting player. To avert the MFIR problem.
        if (
          (this.state.whichPlayerAmI === "p1" &&
            data.leavingPlayerID === this.state.playersDetails.p2.id) ||
          (this.state.whichPlayerAmI === "p2" &&
            data.leavingPlayerID === this.state.playersDetails.p1.id)
        ) {
          console.log("inside socket.on a player left the game");
          const { playersDetails } = data;

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
            playersDetails,
          });
        }
      });
    }
  }
  render() {
    const {
      socket,
      playersDetails,
      myUsername,
      iHavePermissionToEnterRoom,
      rooms,
      happyData,
      sadData,
      surprisedData,
      angryData,
    } = this.state;

    if (iHavePermissionToEnterRoom) {
      console.log("gonna load GAME!");
    }

    let photoSet = {
      happy: happyData,
      sad: sadData,
      angry: angryData,
      surprised: surprisedData,
    };

    return (
      <div>
        {this.state.iHavePermissionToEnterRoom &&
        this.state.shallIBotherLoadingTheGame ? (
          <div id="georgine" className={genStyles.georgine}>
            <div id="leftPanel" className={genStyles.leftPanel}>
              <div id="phaserContainer">
                <ReactGameHolder
                  socket={socket}
                  playersDetails={playersDetails}
                  myUsername={myUsername}
                  photoSet={photoSet}
                />
              </div>
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              <SidePanel
                currentComponent="game"
                socket={socket}
                playersDetails={playersDetails}
                myUsername={myUsername}
                iHavePermissionToEnterRoom={iHavePermissionToEnterRoom}
                setStateCallback={this.setStateCallback}
              />
            </div>
          </div>
        ) : (
          <div id="georgine" className={genStyles.georgine}>
            <div id="leftPanel" className={genStyles.leftPanel}>
              <div>
                <h1
                  className={styles.heading}
                >{`Hello ${this.state.myUsername}, and welcome to the Wormplay lobby!`}</h1>

                <ul>
                  {rooms.map((room) => (
                    <li>
                      {room.roomName +
                        room.roomID +
                        room.p1.username +
                        room.p2.username}
                    </li>
                  ))}
                </ul>

                <button
                  className={styles.buttons}
                  onClick={(e) => {
                    e.preventDefault();
                    this.joinRoom(1);
                  }}
                >
                  ENTER ROOM 1
                </button>
              </div>
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              <SidePanel
                currentComponent="lobby"
                socket={socket}
                playersDetails={playersDetails}
                myUsername={myUsername}
                iHavePermissionToEnterRoom={iHavePermissionToEnterRoom}
                setStateCallback={this.setStateCallback}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
