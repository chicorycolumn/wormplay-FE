_April 9th_

Chris here, just to point out that there is now just one socket created in this whole repo. It's created in src/index.js, and is made available in all the other components.

### SEPARATION

I suggest that we start to think about separating out all the socket functions, so we don't have a million in one file.

How about this separation:

**Pre-Game** socket functions - like socket.on("login"...), socket.on("player left the game"...)
We can keep these in the react component **App.jsx**.

**In-Game** socket functions - like socket.on("movement"...), socket.on("drop letter on worm"...)
We can keep these in the phaser component **MainScene.js**.

### THE CHAIN

To clarify -

**index.js** invokes **App.jsx** which invokes **ReactGameHolder.jsx** which invokes **PhaserGameCreator.js** which finally invokes **MainScene.js**.

And this is how the socket is created just once, in index.js, and then passed all down the chain, so all componenents have access to the very same one socket object.

### IF YOU WANT TO PASS DATA FROM REACT TO PHASER

If you get some data in **App.jsx**, first you must pass it on props to **ReactGameHolder.jsx** - you'll find the invocation near the beginning of the render statement inside App.jsx.

Then inside **ReactGameHolder.jsx** you need to set that data from props to state.

And so now, inside the phaser component **MainScene.js**, you can access that data no problem! That's because I've given MainScene.js access to ReactGameHolder.jsx's state, as _this.game.react.state_.
