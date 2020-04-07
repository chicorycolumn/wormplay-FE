create() {
this.gameState.head = this.add.image(400, 150, "head");

    // this.tweens.add({
    //   targets: head,
    //   y: 450,
    //   duration: 2000,
    //   ease: "Power2",
    //   yoyo: true,
    //   loop: -1,
    // });

    // the Count variables control distance to go
    this.gameState.head.xCount = 0;
    this.gameState.head.yCount = 0;
    // xd and xy variables are the velocity of movement
    this.gameState.head.xd = 0;
    this.gameState.head.yd = 0;
    // the moving variables control direction
    this.gameState.head.movingRight = true;
    this.gameState.head.movingDown = true;

}
update() {
//This if statement will trigger if the circle has nowhere to go
if (this.gameState.head.xCount === 0 && this.gameState.head.yCount === 0) {
// This generates a random distance along the x and y axis for circle to go
this.gameState.head.xCount = Math.floor(Math.random() _ 400);
this.gameState.head.yCount = Math.floor(Math.random() _ 300);
// This randomly decides which direction the circle will move in
if (Math.round(Math.random()) === 1) {
this.gameState.head.movingRight = false;
} else {
this.gameState.head.movingRight = true;
}
if (Math.round(Math.random()) === 1) {
this.gameState.head.movingDown = false;
} else {
this.gameState.head.movingDown = true;
}
}
// this updates the velocity of the circle based on distance to go and direction for the x axis and reduces the xCount or distance remaining
if (this.gameState.head.xCount > 0) {
if (this.gameState.head.movingRight === true) {
this.gameState.head.xd = 2;
} else {
this.gameState.head.xd = -2;
}
this.gameState.head.xCount--;
} else {
this.gameState.head.xd = 0;
}
// this updates the velocity of the circle based on distance to go and direction for the y axis and reduces the yCount or distance remaining
if (this.gameState.head.yCount > 0) {
if (this.gameState.head.movingDown === true) {
this.gameState.head.yd = 2;
} else {
this.gameState.head.yd = -2;
}
this.gameState.head.yCount--;
} else {
this.gameState.head.yd = 0;
}
//This updates the new location of the circle
this.gameState.head.x += this.gameState.head.xd;
this.gameState.head.y += this.gameState.head.yd;
//this makes it so when the circle goes off one edge of the map it appears at the opposite.
//this is tied to height and width of the canvas but is not linked by a variable.
//refactor to link to a variable for dynamic sizing
if (this.gameState.head.x >= 810) {
this.gameState.head.x = -10;
} else if (this.gameState.head.x <= -10) {
this.gameState.head.x = 810;
}
if (this.gameState.head.y >= 610) {
this.gameState.head.y = -10;
} else if (this.gameState.head.y <= -10) {
this.gameState.head.y = 610;
}
}
