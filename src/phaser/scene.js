import Phaser from "phaser";
import logoImg from "../assets/logo.png";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.gameState = {};
  }

  // The functions below should be broken down into seperate functions for optimisation
  //These functions create the circle and make it move randomly

  preload() {}
  create() {
    this.gameState.circle = this.add.circle(390, 290, 50, 0x0000ff);
    // the Count variables control distance to go
    this.gameState.circle.xCount = 0;
    this.gameState.circle.yCount = 0;
    // xd and xy variables are the velocity of movement
    this.gameState.circle.xd = 0;
    this.gameState.circle.yd = 0;
    // the moving variables control direction
    this.gameState.circle.movingRight = true;
    this.gameState.circle.movingDown = true;
  }
  update() {
    //This if statement will trigger if the circle has nowhere to go
    if (
      this.gameState.circle.xCount === 0 &&
      this.gameState.circle.yCount === 0
    ) {
      // This generates a random distance along the x and y axis for circle to go
      this.gameState.circle.xCount = Math.floor(Math.random() * 400);
      this.gameState.circle.yCount = Math.floor(Math.random() * 300);
      // This randomly decides which direction the circle will move in
      if (Math.round(Math.random()) === 1) {
        this.gameState.circle.movingRight = false;
      } else {
        this.gameState.circle.movingRight = true;
      }
      if (Math.round(Math.random()) === 1) {
        this.gameState.circle.movingDown = false;
      } else {
        this.gameState.circle.movingDown = true;
      }
    }
    // this updates the velocity of the circle based on distance to go and direction for the x axis  and reduces the xCount or distance remaining
    if (this.gameState.circle.xCount > 0) {
      if (this.gameState.circle.movingRight === true) {
        this.gameState.circle.xd = 1;
      } else {
        this.gameState.circle.xd = -1;
      }
      this.gameState.circle.xCount--;
    } else {
      this.gameState.circle.xd = 0;
    }
    // this updates the velocity of the circle based on distance to go and direction for the y axis and reduces the yCount or distance remaining
    if (this.gameState.circle.yCount > 0) {
      if (this.gameState.circle.movingDown === true) {
        this.gameState.circle.yd = 1;
      } else {
        this.gameState.circle.yd = -1;
      }
      this.gameState.circle.yCount--;
    } else {
      this.gameState.circle.yd = 0;
    }
    //This updates the new location of the circle
    this.gameState.circle.x += this.gameState.circle.xd;
    this.gameState.circle.y += this.gameState.circle.yd;

    //this makes it so when the circle goes off one edge of the map it appears at the opposite.
    //this is tied to height and width of the canvas but is not linked by a variable.
    //refactor to link to a variable for dynamic sizing
    if (this.gameState.circle.x >= 810) {
      this.gameState.circle.x = -10;
    } else if (this.gameState.circle.x <= -10) {
      this.gameState.circle.x = 810;
    }

    if (this.gameState.circle.y >= 610) {
      this.gameState.circle.y = -10;
    } else if (this.gameState.circle.y <= -10) {
      this.gameState.circle.y = 610;
    }
  }
}

export default playGame;
