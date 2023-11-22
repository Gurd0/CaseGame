const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const grid = 48;
const gridGap = 10;
let level = 1;
let score = 0;
let gameOn = false;
let speedIncrease = level;
let canFroggerMove = false;
let time = 15;
let imageRoad = document.getElementById("road");
let imageGrass = document.getElementById("grass");
let imageGravel = document.getElementById("gravel");
let imageSand = document.getElementById("sand");
// a simple sprite prototype function
function Sprite(props) {
  // shortcut for assigning all object properties to the sprite
  Object.assign(this, props);
}
Sprite.prototype.render = async function () {
  context.fillStyle = this.color;

  // draw a rectangle sprite
  if (this.shape === "rect") {
    // by using a size less than the grid we can ensure there is a visual space
    // between each row
    context.fillRect(this.x, this.y + gridGap / 2, this.size, grid - gridGap);
  }
  //draw image, and set size to the h and w of a grid
  else if (this.shape === "frog") {
    let image = document.getElementById("frogSpritesFull");

    context.drawImage(
      image,
      32 * this.currentFrame + 32 * 3 * (this.rotation - 1),
      0,
      32,
      32,
      this.x,
      this.y,
      grid,
      grid
    );
  } else if (this.shape === "blueCar") {
    let image = document.getElementById("blueCar");
    context.drawImage(image, this.x, this.y, grid * 2, grid);
  } else if (this.shape === "truck") {
    let image = document.getElementById("largTruck");

    context.drawImage(image, this.x, this.y, grid * 3, grid);
  } else if (this.shape === "orangeCar") {
    let image = document.getElementById("orangeCar");
    context.drawImage(image, this.x, this.y, grid * 2, grid);
  } else if (this.shape === "greenCar") {
    let image = document.getElementById("greenCar");
    context.drawImage(image, this.x, this.y, grid * 2, grid);
  } else if (this.shape === "truck") {
    let image = document.getElementById("largTruck");

    context.drawImage(image, this.x, this.y, grid * 3, grid);
  } else if (this.shape === "orangeCar") {
    let image = document.getElementById("orangeCar");
    context.drawImage(image, this.x, this.y, grid * 2, grid);
  } else if (this.shape === "greenCar") {
    let image = document.getElementById("greenCar");
    context.drawImage(image, this.x, this.y, grid * 2, grid);
  } else if (this.shape === "turtle") {
    let image = document.getElementById("turtleSprites");

    context.drawImage(
      image,
      64 * this.currentFrame,
      0,
      64,
      32,
      this.x,
      this.y,
      grid * 2,
      grid
    );
    if (!this.isAnimated) {
      animateTurtle(this);
    }
  }
  // draw a circle sprite. since size is the diameter we need to divide by 2
  // to get the radius. also the x/y position needs to be centered instead of
  // the top-left corner of the sprite
  else {
    context.beginPath();
    context.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2 - gridGap / 2,
      0,
      2 * Math.PI
    );
    context.fill();
  }
};
const animateTurtle = (obj) => {
  obj.isAnimated = true;
  window.setInterval(function () {
    /// call your function here
    if (obj.currentFrame === 0) obj.currentFrame = 1;
    else obj.currentFrame = 0;
  }, 900);
};
const frogger = new Sprite({
  x: grid * 6,
  y: grid * 13,
  currentFrame: 0,
  color: "greenyellow",
  rotation: 1, //1 up, 2 left, 3 down, 4 right
  size: grid,
  shape: "frog",
});
//updates timer
function updateCountdown() {
  time -= 1;
  document.getElementById("time").innerText = time;
  if (time === 0) {
    resetGame();
    //TODO stop game
  }
}

// Initial update to avoid delay
updateCountdown();
// a pattern describes each obstacle in the row
const patterns = [
  // end bank is safe
  null,

  // log
  {
    spacing: [2], // how many grid spaces between each obstacle
    color: "#c55843", // color of the obstacle
    size: grid * 4, // width (rect) / diameter (circle) of the obstacle
    shape: "rect", // shape of the obstacle (rect or circle)
    speed: 0.75, // how fast the obstacle moves and which direction
  },

  // turtle
  {
    spacing: [0, 2, 0, 2, 0, 2, 0, 4],
    color: "#de0004",
    size: grid,
    currentFrame: 0,
    shape: "turtle",
    isAnimated: false,
    speed: -1,
  },

  // long log
  {
    spacing: [2, 4],
    color: "#c55843",
    size: grid * 6,
    shape: "rect",
    speed: 1.5,
  },

  // log
  {
    spacing: [3, 5],
    color: "#c55843",
    size: grid * 3,
    shape: "rect",
    speed: 0.5,
  },

  // turtle
  {
    spacing: [0, 2],
    color: "#de0004",
    size: grid,
    shape: "turtle",
    currentFrame: 0,
    speed: -1.5,
  },

  // beach is safe
  null,

  // truck
  {
    spacing: [3, 8],
    color: "#c2c4da",
    size: grid * 3,
    shape: "truck",
    speed: -1,
  },

  // fast orange
  {
    spacing: [8, 10],
    color: "#c2c4da",
    size: grid * 2,
    shape: "orangeCar",
    speed: 1.5,
  },

  // car
  {
    spacing: [3, 3, 7],
    color: "#de3cdd",
    size: grid * 2,
    shape: "greenCar",
    speed: -0.75,
  },

  // blueCar
  {
    spacing: [3, 9, 7],
    color: "#0bcb00",
    size: grid * 2,
    shape: "blueCar",
    speed: 0.5,
  },

  // orangeCar
  {
    spacing: [4, 7],
    color: "#e5e401",
    size: grid * 2,
    shape: "greenCar",
    speed: -0.5,
  },

  // start zone is safe
  null,
];

// rows holds all the sprites for that row
const rows = [];
for (let i = 0; i < patterns.length; i++) {
  rows[i] = [];

  let x = 0;
  let index = 0;
  const pattern = patterns[i];

  // skip empty patterns (safe zones)
  if (!pattern) {
    continue;
  }

  // allow there to be 1 extra pattern offscreen so the loop is seamless
  // (especially for the long log)
  let totalPatternWidth =
    pattern.spacing.reduce((acc, space) => acc + space, 0) * grid +
    pattern.spacing.length * pattern.size;
  let endX = 0;
  while (endX < canvas.width) {
    endX += totalPatternWidth;
  }
  endX += totalPatternWidth;

  // populate the row with sprites
  while (x < endX) {
    rows[i].push(
      new Sprite({
        x,
        y: grid * (i + 1),
        index,
        ...pattern,
      })
    );

    // move the next sprite over according to the spacing
    const spacing = pattern.spacing;
    x += pattern.size + spacing[index] * grid;
    index = (index + 1) % spacing.length;
  }
}

// game loop
function loop() {
  if (gameOn) requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw road background
  context.fillStyle = "#252525";
  context.fillRect(0, grid, canvas.width, grid * 13);
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageRoad, grid * i, grid * 11, grid, grid);
    context.drawImage(imageRoad, grid * i, grid * 9, grid, grid);

    //context.drawImage(imageRoad, grid*i, grid*8, grid, grid)
  }
  // draw the game background
  // water
  context.fillStyle = "#000047";
  context.fillRect(0, grid, canvas.width, grid * 6);

  // draw the game background
  // water
  context.fillStyle = "#2faec4";
  context.fillRect(0, grid, canvas.width, grid * 6);

  // end bank
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageGrass, grid * i, grid * 1, grid, grid);
  }

  // beach
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageSand, grid * i, grid * 7, grid, grid);
  }

  // start zone
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageGravel, grid * i, grid * 13, grid, grid);
  }

  // update and draw obstacles
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    for (let i = 0; i < row.length; i++) {
      const sprite = row[i];
      // speed + speed pr level
      sprite.x += sprite.speed + (sprite.speed * (level * 2)) / 10;
      sprite.render();

      // loop sprite around the screen
      // sprite is moving to the left and goes offscreen
      if (sprite.speed < 0 && sprite.x < 0 - sprite.size) {
        // find the rightmost sprite
        let rightMostSprite = sprite;
        for (let j = 0; j < row.length; j++) {
          if (row[j].x > rightMostSprite.x) {
            rightMostSprite = row[j];
          }
        }

        // move the sprite to the next spot in the pattern so it continues
        const spacing = patterns[r].spacing;
        sprite.x =
          rightMostSprite.x +
          rightMostSprite.size +
          spacing[rightMostSprite.index] * grid;
        sprite.index = (rightMostSprite.index + 1) % spacing.length;
      }

      // sprite is moving to the right and goes offscreen
      if (sprite.speed > 0 && sprite.x > canvas.width) {
        // find the leftmost sprite
        let leftMostSprite = sprite;
        for (let j = 0; j < row.length; j++) {
          if (row[j].x < leftMostSprite.x) {
            leftMostSprite = row[j];
          }
        }

        // move the sprite to the next spot in the pattern so it continues
        const spacing = patterns[r].spacing;
        let index = leftMostSprite.index - 1;
        index = index >= 0 ? index : spacing.length - 1;
        sprite.x = leftMostSprite.x - spacing[index] * grid - sprite.size;
        sprite.index = index;
      }
    }
  }
  // draw frogger
  frogger.x += frogger.speed || 0;
  frogger.render();

  // check for collision with all sprites in the same row as frogger
  const froggerRow = (frogger.y / grid - 1) | 0;
  let collision = false;
  for (let i = 0; i < rows[froggerRow].length; i++) {
    let sprite = rows[froggerRow][i];

    // axis-aligned bounding box (AABB) collision check
    // treat any circles as rectangles for the purposes of collision
    if (
      frogger.x < sprite.x + sprite.size - gridGap &&
      frogger.x + grid - gridGap > sprite.x &&
      frogger.y < sprite.y + grid &&
      frogger.y + grid > sprite.y
    ) {
      collision = true;

      // reset frogger if got hit by car
      if (froggerRow > rows.length / 2) {
        document.getElementById("splat").play();
        resetGame();
      }
      // move frogger along with obstacle
      else {
        frogger.speed = sprite.speed + (sprite.speed * (level * 2)) / 10;
      }
    }
  }

  if (!collision) {
    // if fogger isn't colliding reset speed
    frogger.speed = 0;

    // frogger got to end bank (goal every 3 cols)
    const col = ((frogger.x + grid / 2) / grid) | 0;
    //TODO
    if (froggerRow === 0) {
      level = level + 1;
      score = score + (100 * time) / 10;
      time = 15;
      document.getElementById("time").innerText = time;
      document.getElementById("score").textContent = score;
      document.getElementById("level").innerText = level;
      (frogger.x = grid * 6), (frogger.y = grid * 13);

      // play win sound
      let random = Math.floor(Math.random() * 10);
      if (random < 5) {
        document.getElementById("win").play();
      } else if (random < 10) {
        document.getElementById("win2").play();
      } else {
        document.getElementById("experis").play();
      }
    }

    // reset frogger if not on obstacle in river
    if (froggerRow < rows.length / 2 - 1 && froggerRow !== 0) {
      document.getElementById("plop").play();
      resetGame();
    }
  }
}
const moveFrog = (x, y) => {
  canFroggerMove = true;
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  async function load() {
    let stop = false;
    for (var i = 0; i < 3; i++) {
      console.log(frogger.y);
      if (!stop && canFroggerMove) {
        if (frogger.currentFrame == 2) {
          frogger.currentFrame = 0;
        } else {
          frogger.currentFrame = frogger.currentFrame + 1;
        }
        frogger.x += x / 3;
        frogger.y += y / 3;
        //stop the frames so frog does not take a half step on reset
        if (frogger.y == 80) {
          stop = true;
          frogger.currentFrame = 0;
        }
      }

      await timer(50);
    }
  }
  load();
};
// listen to keyboard events to move frogger
document.addEventListener("keydown", function (e) {
  ////1 up, 2 right, 3 down, 4 left
  // left arrow key
  if (e.which === 37) {
    moveFrog(-grid, 0);
    frogger.rotation = 2;
  }
  // right arrow key
  else if (e.which === 39) {
    moveFrog(grid, 0);
    frogger.rotation = 4;
  }
  // up arrow key
  else if (e.which === 38) {
    moveFrog(0, -grid);
    frogger.rotation = 1;
  }
  // down arrow key
  else if (e.which === 40) {
    moveFrog(0, grid);
    frogger.rotation = 3;
  }

  // clamp frogger position to stay on screen
  frogger.x = Math.min(Math.max(0, frogger.x), canvas.width - grid);
  frogger.y = Math.min(Math.max(grid, frogger.y), canvas.height - grid * 2);
});

//add frogsound to spacebar
document.addEventListener("keydown", function (e) {
  if (e.which === 32) {
    document.getElementById("frogSound").play();
  }
});

const resetGame = () => {
  canFroggerMove = false;
  level = 1;
  score = 0;
  time = 15;
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  (frogger.x = grid * 6), (frogger.y = grid * 13);
  frogger.currentFrame = 0;
};
requestAnimationFrame(loop);
// start the game
let b = document.getElementById("gameToggle");
b.addEventListener("click", function () {
  gameStart;
});

function gameStart() {
  gameOn = true;
  requestAnimationFrame(loop);
  //start time countdown
  setInterval(updateCountdown, 1000);
}
