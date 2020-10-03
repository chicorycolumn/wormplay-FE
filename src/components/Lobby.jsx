import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import GameSidePanel from "./GameSidePanel.jsx";
import LobbySidePanel from "./LobbySidePanel.jsx";
import styles from "./css/Lobby.module.css";
import genStyles from "./css/General.module.css";
import RoomTable from "./RoomTable.jsx";
import { greetings } from "../refObjs";
const greeting = greetings[Math.floor(Math.random() * 10)];

export default class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      opponentPlayerFaces: {
        happyData: null,
        sadData: null,
        angryData: null,
        shockedData: null,
      },
      goStraightToRoomOne: false,
      ridEventListener: () => {
        console.log("empty fxn instead of ridEventListener");
      },
      happyData: null,
      sadData: null,
      angryData: null,
      surprisedData: null,
      imageBufferToSend: null,
      shallIBotherLoadingTheGame: true, //TOGGLE THIS DURING DEVELOPMENT.
      socket: null,
      myUsername: "",
      iHavePermissionToEnterRoom: false,
      rooms: [],
      newRoomName: "",
      currentRoom: {
        roomID: null,
        roomName: null,
        p1: { id: null, username: null },
        p2: { id: null, username: null },
      },
      whichPlayerAmI: null,
    };
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  setStateCallback = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  stopWebcam = () => {
    // const video = document.getElementById("video");

    this.state.ridEventListener();
    navigator.getUserMedia(
      { video: {} },
      (stream) => {
        video.srcObject = null; // red underlined but is actually okay.
        const tracks = stream.getTracks();

        tracks.forEach(function (track) {
          track.stop();
          track.enabled = false;
        });
      },
      (err) => console.error(err)
    );
  };

  componentDidMount() {
    let { socket, myUsername, goStraightToRoomOne, rooms } = this.props;
    this.setState({
      socket,
      goStraightToRoomOne,
      myUsername,
      rooms,
    });
  }

  joinRoom = (roomID) => {
    ////////////
    let playerFacesToServer = {};
    playerFacesToServer.happyFace = this.state.happyData;
    playerFacesToServer.sadFace = this.state.sadData;
    playerFacesToServer.angryFace = this.state.angryData;
    playerFacesToServer.shockedFace = this.state.surprisedData;

    this.stopWebcam();
    setTimeout(() => {
      //THIS TIMEOUT IS A BODGE.
      this.state.socket.emit("joinRoom", { roomID, playerFacesToServer });
    }, 1000);
  };

  quitRoom = () => {
    console.log("gonna try quitting room");
    this.state.socket.emit("quitRoom");
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log("CDU of Lobby", this.state.currentRoom);
    // console.log("CDU of Lobby, props", this.props.currentRoom);
    if (this.state.socket && this.state.goStraightToRoomOne) {
      this.state.socket.emit("joinRoom", { roomID: 1, developmentCheat: true });
    }

    if (this.state.socket) {
      if (prevState.imageBufferToSend !== this.state.imageBufferToSend) {
        console.log("gonna send image buffer on", this.state.socket);
        this.state.socket.emit("image from client", {
          buf: this.state.imageBufferToSend,
        });
      }

      this.state.socket.on("connectionRefused", () => {
        console.log(`Oh no! The room was full or something.`);
      });

      this.state.socket.on("lobbyUpdate", (data) => {
        console.log("gonna update lobby");
        this.setState({ rooms: data.rooms });
      });

      this.state.socket.on("youJoinedARoom", (data) => {
        console.log(data.room);
        console.log(`Seems like we successfully joined ${data.room.roomID}`);
        //A check to avoid MFIR.
        if (data.youCanEnter) {
          if (data.youCanEnter) {
            let whichPlayerAmI = data.whichPlayerIsShe;

            let welcomeMessage =
              "Hey " +
              "<strong>" +
              `${data.room[`${whichPlayerAmI}`].username}` +
              "</strong>" +
              ", it's awesome you're here!";

            this.setState({
              whichPlayerAmI,
              welcomeMessage,
              iHavePermissionToEnterRoom: true,
              currentRoom: data.room,
            });
          }
        }
      });
    }
  }

  handleInput = (input) => {
    console.log("handling input");
    const { newRoomName } = this.state;
    this.setState({ newRoomName: input });
    // this.state.socket.emit("create room", { roomName: newRoomName });
  };

  createNewRoom = () => {
    console.log("increateroom");
    console.log(this.state.newRoomName, "new room name");
    const { newRoomName } = this.state;
    let playerFacesToServer = {};
    playerFacesToServer.happyFace = this.state.happyData;
    playerFacesToServer.sadFace = this.state.sadData;
    playerFacesToServer.angryFace = this.state.angryData;
    playerFacesToServer.shockedFace = this.state.surprisedData;
    this.state.socket.emit("create room", {
      roomName: newRoomName,
      playerFacesToServer,
    });
  };

  render() {
    const {
      socket,
      myUsername,
      iHavePermissionToEnterRoom,
      rooms,
      happyData,
      sadData,
      surprisedData,
      angryData,
      currentRoom,
    } = this.state;

    // let photoSet = {
    //   happy: happyData,
    //   sad: sadData,
    //   angry: angryData,
    //   surprised: surprisedData,
    // };
    return (
      <div>
        {this.state.iHavePermissionToEnterRoom &&
        this.state.shallIBotherLoadingTheGame ? (
          <div
            id="georgine"
            className={`${genStyles.rounded2} ${genStyles.shadow2} ${genStyles.georgine}`}
          >
            <div id="leftPanel" className={genStyles.leftPanel}>
              <div id="phaserContainer">
                <ReactGameHolder
                  socket={socket}
                  myUsername={myUsername}
                  // photoSet={photoSet}
                  currentRoom={currentRoom}
                  setStateCallback={this.setStateCallback}
                  opponentPlayerFaces={this.state.opponentPlayerFaces}
                />
              </div>
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              <GameSidePanel
                socket={socket}
                myUsername={myUsername}
                iHavePermissionToEnterRoom={iHavePermissionToEnterRoom}
                setStateCallback={this.setStateCallback}
                // photoSet={photoSet}
                currentRoom={currentRoom}
                stopWebcam={this.stopWebcam}
              />
            </div>
          </div>
        ) : (
          <>
            {!this.state.goStraightToRoomOne && (
              <div
                id="georgine"
                className={`${genStyles.rounded2} ${genStyles.shadow2} ${genStyles.georgine}`}
              >
                <div id="leftPanel" className={genStyles.leftPanel}>
                  <div>
                    <h1 className={styles.heading}>{`${greeting} `}</h1>
                    <h1
                      className={styles.heading2}
                    >{`${this.state.myUsername}`}</h1>
                    <h1 className={styles.heading}>{`!`}</h1>

                    <h2 id="title" className={styles.lobbySubheading}>
                      🐛 Join a room, or create your own! 🐛
                    </h2>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        this.createNewRoom();
                      }}
                    >
                      <label>
                        <input
                          className={styles.newRoomField}
                          value={this.state.newRoomName}
                          maxlength="12"
                          autocomplete="off"
                          type="text"
                          placeholder="New room (name optional)"
                          onChange={(event) => {
                            this.handleInput(event.target.value);
                          }}
                        />
                        <button
                          className={`${styles.newRoomButton} ${styles.tooltip}`}
                          type="submit"
                        >
                          {/* ✔️ */}
                          🦋
                          <span className={styles.tooltiptext}>
                            Create room!
                          </span>
                        </button>
                      </label>
                    </form>
                    <br />
                    <RoomTable rooms={rooms} joinRoom={this.joinRoom} />
                  </div>
                </div>
                <div id="rightPanel" className={genStyles.rightPanel}>
                  <LobbySidePanel
                    testVariable="hello"
                    socket={socket || this.props.socket}
                    myUsername={myUsername}
                    iHavePermissionToEnterRoom={iHavePermissionToEnterRoom}
                    setStateCallback={this.setStateCallback}
                    rooms={rooms}
                    currentRoom={currentRoom}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}
