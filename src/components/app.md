import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class App extends Component {
constructor() {
super();
this.state = {
manchester: [],
endpoint: "https://wormplayserver.herokuapp.com/",
};
}

componentDidMount() {
console.log("incomponentdidmount");
const { endpoint } = this.state;

    const socket = socketIOClient(endpoint);

    socket.on("FromAPI", (data) =>
      this.setState({
        manchester: data.current.temp_f,
      })
    );

}

render() {
console.log(this.state.manchester, "manchester");
const { manchester } = this.state;
return (
<div style={{ textAlign: "center" }}>
{manchester ? (
<p>The temperature in Manchester is: {this.state.manchester} °F</p>
) : (
<p>Loading...</p>
)}
</div>
);
}
}

export default App;
