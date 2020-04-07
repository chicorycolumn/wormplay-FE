import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import img from "../assets/circle.png";
import head from "../assets/head-smaller.png";

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.gameState = {};
  }

  // The functions below should be broken down into seperate functions for optimisation
  //These functions create the circle and make it move randomly

  preload() {
    // this.load.image("head", img);
    this.load.image("head", head);
  }

  create() {
    this.gameState.head7 = this.physics.add.image(400, 150, "head");
    this.gameState.head6 = this.physics.add.image(400, 125, "head");
    this.gameState.head5 = this.physics.add.image(400, 125, "head");
    this.gameState.head4 = this.physics.add.image(400, 125, "head");
    this.gameState.head3 = this.physics.add.image(400, 125, "head");
    this.gameState.head2 = this.physics.add.image(400, 125, "head");
    this.gameState.head = this.physics.add.image(400, 125, "head");

    //variables for destination
    this.gameState.head.xDest = 400;
    this.gameState.head.yDest = 150;
    this.gameState.head.count = 0;
    this.gameState.head.body.collideWorldBounds = true;
  }
  update() {
    const { head, head2, head3, head4, head5, head6, head7 } = this.gameState;

    if (head.count === 0) {
      head.xDest = Math.floor(Math.random() * 800);
      head.yDest = Math.floor(Math.random() * 600);
      this.physics.moveTo(head, head.xDest, head.yDest, 60, 60, 60);

      head.count = 300;
    }
    head.rotation = this.physics.accelerateTo(
      head,
      head.xDest,
      head.yDest,
      60,
      60,
      60
    );
    this.physics.moveTo(head2, head.x, head.y, 60, 750, 750);
    this.physics.moveTo(head3, head2.x, head2.y, 60, 750, 750);
    this.physics.moveTo(head4, head3.x, head3.y, 60, 750, 750);
    this.physics.moveTo(head5, head4.x, head4.y, 60, 750, 750);
    this.physics.moveTo(head6, head5.x, head5.y, 60, 750, 750);
    this.physics.moveTo(head7, head6.x, head6.y, 60, 750, 750);
    if (head.count > 0) {
      head.count--;
    }
  }
}

export default playGame;
