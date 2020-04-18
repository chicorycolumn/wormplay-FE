import React, { Component } from "react";
import styles from "./css/RoomTable.module.css";
import { render } from "@testing-library/react";

class RoomTable extends Component {
  constructor() {
    super();
    this.state = {};
    // this.setStateCallback = this.setStateCallback.bind(this);
  }

  renderTableData = (props) => {
    const { joinRoom, rooms } = props;
    return rooms.map((room, index) => {
      const { roomID, roomName } = room;
      return (
        <tr key={room.roomID}>
          <td>{roomName}</td>
          <td>{roomID}</td>
          <td>{room.p1.username}</td>
          <td>{room.p2.username}</td>
          <td>
            {(room.p1.username === null || room.p2.username === null) && (
              <button
                value={roomID}
                onClick={(e) => {
                  e.preventDefault();
                  joinRoom(e.target.value);
                }}
              >
                Join
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  renderTableHeader = (props) => {
    let headers = ["Room name", "Room ID", "Player 1", "Player 2"];

    return headers.map((name) => {
      return <th>{name.toUpperCase()}</th>;
    });
  };

  render() {
    return (
      <div>
        <h2 id="title">🐛 Pick a room you'd like to join 🐛</h2>
        <table className={styles.rooms}>
          <tbody>
            {" "}
            {this.renderTableHeader(this.props)}{" "}
            {this.renderTableData(this.props)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RoomTable;
