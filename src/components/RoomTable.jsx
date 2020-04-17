import React, { Component } from "react";
import styles from "./css/App.module.css";

class RoomTable extends Component {
  state = {
    rooms: [
      {
        roomName: "wormy room",
        roomID: 1,
        p1: { username: "benny", id: 12345 },
        p2: { username: null, id: null },
      },
      {
        roomName: "slithery room",
        roomID: 2,
        p1: { username: null, id: null },
        p2: { username: "linda", id: 6789 },
      },
      {
        roomName: "earthy room",
        roomID: 3,
        p1: { username: null, id: null },
        p2: { username: null, id: null },
      },
    ],
  };

  renderTableData = () => {
    console.log("inrendertable");
    const { rooms } = this.state;
    return rooms.map((room, index) => {
      const { roomID, roomName } = room;
      return (
        <tr key={room.roomID}>
          <td>{roomName}</td>
          <td>{roomID}</td>
          <td>{room.p1.username}</td>
          <td>{room.p2.username}</td>
          <td>
            <button
            // value={roomID}
            // onClick={(e) => {
            //   e.preventDefault();
            //   this.joinRoom(e.target.value);
            // }}
            >
              Join
            </button>
          </td>
        </tr>
      );
    });
  };

  renderTableHeader = () => {
    let header = Object.keys(this.state.rooms[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  };

  render() {
    return (
      <div>
        <h2 id="title">🐛 Pick a room you'd like to join 🐛</h2>
        <table className={styles.rooms}>
          <tbody>{this.renderTableHeader()}</tbody>
          {this.renderTableData()}
        </table>
      </div>
    );
  }
}

export default RoomTable;
