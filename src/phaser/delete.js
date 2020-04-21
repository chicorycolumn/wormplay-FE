isP1 = this.game.react.state.isP1;
isP2 = this.game.react.state.isP2;
p1Name = this.game.react.state.currentRoom.p1.username;
p2Name = this.game.react.state.currentRoom.p2.username;

//#################################

if (isP1 === true && this.game.react.state.currentRoom.p2.playerFaces) {
  console.log("will update p2 faces cos they just entered");
  oppFaces = this.game.react.state.currentRoom.p2.playerFaces;
} else if (isP2 === true && this.game.react.state.currentRoom.p1.playerFaces) {
  console.log("will update p1 faces cos they just entered");
  oppFaces = this.game.react.state.currentRoom.p1.playerFaces;
}

// const myFaces = playerFaces;

console.log("U:myFaces", myFaces);
console.log("U:oppFaces", oppFaces);

if (isP1 === true) {
  //I AM PLAYER ONE.
  //Load either my photo, or if that's null, load the emoji.
  if (myFaces.happyFace === null) {
    this.load.image("p1HeadHappy", p1HeadHappy);
  } else {
    this.textures.addBase64("p1HeadHappy", myFaces.happyFace);
  }
  if (myFaces.sadFace === null) {
    this.load.image("p1HeadSad", p1HeadSad);
  } else {
    this.textures.addBase64("p1HeadSad", myFaces.sadFace);
  }
  if (myFaces.angryFace === null) {
    this.load.image("p1HeadAngry", p1HeadAngry);
  } else {
    this.textures.addBase64("p1HeadAngry", myFaces.angryFace);
  }
  if (myFaces.shockedFace === null) {
    this.load.image("p1HeadShocked", p1HeadShocked);
  } else {
    this.textures.addBase64("p1HeadShocked", myFaces.shockedFace);
  }
  //For player two, load my opponent's either photos or emojis.
  if (oppFaces.happyFace === null) {
    this.load.image("p2HeadHappy", p2HeadHappy);
  } else {
    this.textures.addBase64("p2HeadHappy", oppFaces.happyFace);
  }
  if (oppFaces.sadFace === null) {
    this.load.image("p2HeadSad", p2HeadSad);
  } else {
    this.textures.addBase64("p2HeadSad", oppFaces.sadFace);
  }
  if (oppFaces.angryFace === null) {
    this.load.image("p2HeadAngry", p2HeadAngry);
  } else {
    this.textures.addBase64("p2HeadAngry", oppFaces.angryFace);
  }
  if (oppFaces.shockedFace === null) {
    this.load.image("p2HeadShocked", p2HeadShocked);
  } else {
    this.textures.addBase64("p2HeadShocked", oppFaces.shockedFace);
  }
} else if (isP2 === true) {
  //I AM PLAYER TWO ACTUALLY.
  //Load either my photo, or if that's null, load the emoji.
  if (myFaces.happyFace === null) {
    this.load.image("p2HeadHappy", p2HeadHappy);
  } else {
    this.textures.addBase64("p2HeadHappy", myFaces.happyFace);
  }
  if (myFaces.sadFace === null) {
    this.load.image("p2HeadSad", p2HeadSad);
  } else {
    this.textures.addBase64("p2HeadSad", myFaces.sadFace);
  }
  if (myFaces.angryFace === null) {
    this.load.image("p2HeadAngry", p2HeadAngry);
  } else {
    this.textures.addBase64("p2HeadAngry", myFaces.angryFace);
  }
  if (myFaces.shockedFace === null) {
    this.load.image("p2HeadShocked", p2HeadShocked);
  } else {
    this.textures.addBase64("p2HeadShocked", myFaces.shockedFace);
  }
  //My opponent is player one, so load either their photos or emojis.
  if (oppFaces.happyFace === null) {
    this.load.image("p1HeadHappy", p1HeadHappy);
  } else {
    this.textures.addBase64("p1HeadHappy", oppFaces.happyFace);
  }
  if (oppFaces.sadFace === null) {
    this.load.image("p1HeadSad", p1HeadSad);
  } else {
    this.textures.addBase64("p1HeadSad", oppFaces.sadFace);
  }
  if (oppFaces.angryFace === null) {
    this.load.image("p1HeadAngry", p1HeadAngry);
  } else {
    this.textures.addBase64("p1HeadAngry", oppFaces.angryFace);
  }
  if (oppFaces.shockedFace === null) {
    this.load.image("p1HeadShocked", p1HeadShocked);
  } else {
    this.textures.addBase64("p1HeadShocked", oppFaces.shockedFace);
  }
}
//##################################
this.load.image("head", body);
this.load.image("body", body);

this.load.image("p2Head", body2);
this.load.image("body2", body2);
this.load.image("p2Head", p2HeadHappy);
this.load.image("p2HeadShocked", p2HeadShocked);

///////////////////////////////

setTimeout(() => {
  p1Name = this.game.react.state.currentRoom.p1.username;
  p2Name = this.game.react.state.currentRoom.p2.username;
  const { opponents, opponentsArr, timer, roundsWon, whoWon } = this.gameState;

  // this.gameState.body6 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body6.index = 5;

  // this.gameState.body5 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body5.index = 4;

  // this.gameState.body4 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body4.index = 3;

  // this.gameState.body3 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body3.index = 2;

  // this.gameState.body2 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body2.index = 1;

  // this.gameState.body1 = this.physics.add.image(400, 125, "body2");
  // this.gameState.body1.index = 0;

  this.gameState.head = this.physics.add.image(400, 125, "head");
  this.gameState.head.setVisible(false);
  this.gameState.p1HeadHappy = this.add.image(400, 125, "p1HeadHappy");
  this.gameState.p1HeadShocked = this.add.image(400, 125, "p1HeadShocked");
  this.gameState.p1HeadShocked.setVisible(false);
  this.gameState.p1HeadSad = this.add.image(400, 125, "p1HeadSad");
  this.gameState.p1HeadSad.setVisible(false);
  this.gameState.p1HeadAngry = this.add.image(400, 125, "p1HeadAngry");
  this.gameState.p1HeadAngry.setVisible(false);

  // this.gameState.p2Body6 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body6.index = 5;
  // this.gameState.p2Body5 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body5.index = 4;
  // this.gameState.p2Body4 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body4.index = 3;
  // this.gameState.p2Body3 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body3.index = 2;
  // this.gameState.p2Body2 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body2.index = 1;
  // this.gameState.p2Body1 = this.physics.add.image(600, 300, "body");
  // this.gameState.p2Body1.index = 0;

  this.gameState.p2Head = this.physics.add.image(600, 300, "p2Head");
  this.gameState.p2Head.setVisible(false);
  this.gameState.p2HeadHappy = this.add.image(600, 300, "p2HeadHappy");
  this.gameState.p2HeadShocked = this.add.image(600, 300, "p2HeadShocked");
  this.gameState.p2HeadShocked.setVisible(false);
  this.gameState.p2HeadSad = this.add.image(600, 300, "p2HeadSad");
  this.gameState.p2HeadSad.setVisible(false);
  this.gameState.p2HeadAngry = this.add.image(600, 300, "p2HeadAngry");
  this.gameState.p2HeadAngry.setVisible(false);

  //////Previously these two lines below were only triggered if using photos instead of emojis. Now they always trigger.
  // this.gameState.head.setVisible(true); //
  // this.gameState.p2Head.setVisible(true); //
  ////////////////////////////////

  // const oppFaces = this.game.react.state.opponentPlayerFaces;
  // const myFaces = playerFaces;

  console.log("U2:myFaces", myFaces);
  console.log("U2:oppFaces", oppFaces);

  if (isP1 === true) {
    if (myFaces.happyFace) {
      this.gameState.p1HeadHappy.setDisplaySize(48, 48);
    }
    if (myFaces.sadFace) {
      this.gameState.p1HeadSad.setDisplaySize(48, 48);
    }
    if (myFaces.angryFace) {
      this.gameState.p1HeadAngry.setDisplaySize(48, 48);
    }
    if (myFaces.shockedFace) {
      this.gameState.p1HeadShocked.setDisplaySize(48, 48);
    }
    if (oppFaces.happyFace) {
      this.gameState.p2HeadHappy.setDisplaySize(48, 48);
    }
    if (oppFaces.sadFace) {
      this.gameState.p2HeadShocked.setDisplaySize(48, 48);
    }
    if (oppFaces.angryFace) {
      this.gameState.p2HeadSad.setDisplaySize(48, 48);
    }
    if (oppFaces.shockedFace) {
      this.gameState.p2HeadAngry.setDisplaySize(48, 48);
    }
  } else if (isP2 === true) {
    if (oppFaces.happyFace) {
      this.gameState.p1HeadHappy.setDisplaySize(48, 48);
    }
    if (oppFaces.sadFace) {
      this.gameState.p1HeadSad.setDisplaySize(48, 48);
    }
    if (oppFaces.angryFace) {
      this.gameState.p1HeadAngry.setDisplaySize(48, 48);
    }
    if (oppFaces.shockedFace) {
      this.gameState.p1HeadShocked.setDisplaySize(48, 48);
    }
    if (myFaces.happyFace) {
      this.gameState.p2HeadHappy.setDisplaySize(48, 48);
    }
    if (myFaces.sadFace) {
      this.gameState.p2HeadShocked.setDisplaySize(48, 48);
    }
    if (myFaces.angryFace) {
      this.gameState.p2HeadSad.setDisplaySize(48, 48);
    }
    if (myFaces.shockedFace) {
      this.gameState.p2HeadAngry.setDisplaySize(48, 48);
    }
  }
}, 1500);
