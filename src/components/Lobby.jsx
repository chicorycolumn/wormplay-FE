import React, { Component } from "react";
import ReactGameHolder from "./ReactGameHolder.jsx";
import GameSidePanel from "./GameSidePanel.jsx";
import LobbySidePanel from "./LobbySidePanel.jsx";
import styles from "./css/Lobby.module.css";
import genStyles from "./css/General.module.css";
import RoomTable from "./RoomTable.jsx";

export default class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
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
      currentRoom: {
        roomID: null,
        roomName: null,
        p1: { id: null, username: null },
        p2: { id: null, username: null },
      },
    };
    this.setStateCallback = this.setStateCallback.bind(this);
  }

  setStateCallback = (key, object) => {
    let newState = {};
    newState[key] = object;
    this.setState(newState);
  };

  stopWebcam = () => {
    console.log("gonna stop webcam");
    this.state.ridEventListener();
    navigator.getUserMedia(
      { video: {} },
      (stream) => {
        video.srcObject = null; // red underlined but is actually okay.
        const tracks = stream.getTracks();
        console.log("tracks", tracks);
        tracks.forEach(function (track) {
          track.stop();
          track.enabled = false;
        });
      },
      (err) => console.error(err)
    );
  };

  componentDidMount() {
    let {
      socket,

      myUsername,

      rooms,
    } = this.props;
    this.setState({
      socket,

      myUsername,

      rooms,
    });
  }

  joinRoom = (roomID) => {
    this.stopWebcam();
    // console.log(roomID, "roomid");
    console.log("in joinroom function");
    this.state.socket.emit("joinRoom", { roomID });
  };

  quitRoom = () => {
    console.log("gonna try quitting room 3!");
    this.state.socket.emit("quitRoom");
  };

  componentDidUpdate(prevProps, prevState) {
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
            console.log("congrats");
            let whichPlayerAmI = data.whichPlayerIsShe;

            let welcomeMessage =
              "Hey " +
              "<strong>" +
              `${data.room[`${whichPlayerAmI}`].username}` +
              "</strong>" +
              ", it's awesome you're here!";

            console.log("data.room", data.room);

            this.setState({
              whichPlayerAmI,
              welcomeMessage,
              iHavePermissionToEnterRoom: true,
              currentRoom: data.room,
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

                <RoomTable rooms={rooms} joinRoom={this.joinRoom} />
                {/* 
                <button
                  className={styles.buttons}
                  onClick={(e) => {
                    e.preventDefault();
                    this.joinRoom(1);
                  }}
                >
                  ENTER ROOM 1
                </button> */}
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
      </div>
    );
  }
}
