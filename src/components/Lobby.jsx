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
      goStraightToRoomOne: false,
      ridEventListener: () => {
        console.log("empty fxn instead of ridEventListener");
      },
      happyData: { src: null },
      sadData: { src: null },
      angryData: { src: null },
      surprisedData: { src: null },
      shallIBotherLoadingTheGame: true, //TOGGLE THIS DURING DEVELOPMENT.
      socket: null,
      myUsername: "",
      iHavePermissionToEnterRoom: false, //DEVELOPMENT
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
    console.log(">>KILL WEBCAM<<");
    this.state.ridEventListener();
    navigator.getUserMedia(
      { video: {} },
      (stream) => {
        console.log("***");
        video.srcObject = null; // red underlined but is actually okay.
        const tracks = stream.getTracks();
        console.log("LOBBY", tracks[0].enabled);
        tracks.forEach(function (track) {
          track.stop();
          track.enabled = false;
        });
        console.log("LOBBY", tracks[0].enabled);
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
    this.stopWebcam();
    setTimeout(() => {
      //THIS TIMEOUT IS A BODGE.
      this.state.socket.emit("joinRoom", { roomID });
    }, 1000);
  };

  quitRoom = () => {
    console.log("gonna try quitting room");
    this.state.socket.emit("quitRoom");
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.socket && this.state.goStraightToRoomOne) {
      this.state.socket.emit("joinRoom", { roomID: 1, developmentCheat: true });
    }

    if (this.state.socket) {
      this.state.socket.on("connectionRefused", () => {
        console.log(`Oh no! The room was full or something.`);
      });

      this.state.socket.on("lobbyUpdate", (data) => {
        console.log("gonna update lobby");
        this.setState({ rooms: data.rooms });
      });

      this.state.socket.on("youJoinedARoom", (data) => {
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
    this.state.socket.emit("create room", { roomName: newRoomName });
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
                  myUsername={myUsername}
                  photoSet={photoSet}
                  currentRoom={currentRoom}
                />
              </div>
            </div>
            <div id="rightPanel" className={genStyles.rightPanel}>
              <GameSidePanel
                socket={socket}
                myUsername={myUsername}
                iHavePermissionToEnterRoom={iHavePermissionToEnterRoom}
                setStateCallback={this.setStateCallback}
                photoSet={photoSet}
                currentRoom={currentRoom}
                stopWebcam={this.stopWebcam}
              />
            </div>
          </div>
        ) : (
          <>
            {!this.state.goStraightToRoomOne && (
              <div id="georgine" className={genStyles.georgine}>
                <div id="leftPanel" className={genStyles.leftPanel}>
                  <div>
                    <h1
                      className={styles.heading}
                    >{`${greeting} ${this.state.myUsername}, and welcome to the Wormplay lobby!`}</h1>

                    <h2 id="title">🐛 Create your own room... 🐛</h2>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        this.createNewRoom();
                      }}
                    >
                      <label>
                        New room name:{" "}
                        <input
                          value={this.state.newRoomName}
                          type="text"
                          onChange={(event) => {
                            this.handleInput(event.target.value);
                          }}
                        />
                        <button type="submit">Create room</button>
                      </label>
                    </form>
                    <RoomTable rooms={rooms} joinRoom={this.joinRoom} />
                  </div>
                </div>
                <div id="rightPanel" className={genStyles.rightPanel}>
                  <LobbySidePanel
                    socket={socket}
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
