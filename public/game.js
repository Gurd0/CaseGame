import { drawBackground } from "./gameFunctions/drawFuncs.js";
import { getObstaclePattern } from "./gameFunctions/obstaclePatterns.js";
import { toggleDeadModal } from "./modal.js";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// imports for spritess
let imageFrogFull = document.getElementById("frogSpritesFull");
let imageTruck = document.getElementById("largeTruck");
let imageBlueCar = document.getElementById("blueCar");
let imageOrangeCar = document.getElementById("orangeCar");
let imageGreenCar = document.getElementById("greenCar");
let imageLog3 = document.getElementById("log3");
let imageLog4 = document.getElementById("log4");
let imageLog6 = document.getElementById("log6");
let imageTurtle = document.getElementById("turtleSprites");

const grid = 48;
const gridGap = 10;
let level = 1;
let score = 0;
let gameOn = false;
let speedIncrease = level;
let canFroggerMove = false;
let time = 15;

// a simple sprite prototype function
function Sprite(props) {
  // shortcut for assigning all object properties to the sprite
  Object.assign(this, props);
}
Sprite.prototype.render = async function () {
  context.fillStyle = this.color;

  switch (this.shape) {
    case "frog":
      context.drawImage(
        imageFrogFull,
        32 * this.currentFrame + 32 * 3 * (this.rotation - 1),
        0,
        32,
        32,
        this.x,
        this.y,
        grid,
        grid
      );
      break;
    case "blueCar":
      context.drawImage(imageBlueCar, this.x, this.y, grid * 2, grid);
      break;
    case "orangeCar":
      context.drawImage(imageOrangeCar, this.x, this.y, grid * 2, grid);
      break;
    case "greenCar":
      context.drawImage(imageGreenCar, this.x, this.y, grid * 2, grid);
      break;
    case "truck":
      context.drawImage(imageTruck, this.x, this.y, grid * 3, grid);
      break;
    case "log3":
      context.drawImage(imageLog3, this.x, this.y, grid * 3, grid);
      break;
    case "log4":
      context.drawImage(imageLog4, this.x, this.y, grid * 4, grid);
      break;
    case "log6":
      context.drawImage(imageLog6, this.x, this.y, grid * 6, grid);
      break;
    case "turtle":
      context.drawImage(
        imageTurtle,
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
      break;
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
  if (gameOn) {
    time -= 1;
    document.getElementById("time").innerText = time;
    if (time === 0) {
      resetGame();
    }
  }
}

// Initial update to avoid delay

updateCountdown();
// a pattern describes each obstacle in the rows
const patterns = getObstaclePattern(grid);

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

  drawBackground(canvas, context, grid);

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
  toggleDeadModal(score, level);
  level = 1;
  score = 0;
  time = 15;

  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  (frogger.x = grid * 6), (frogger.y = grid * 13);
  frogger.currentFrame = 0;
  gameOn = false;
};
requestAnimationFrame(loop);
// start the game

export function gameStart() {
  gameOn = true;
  requestAnimationFrame(loop);
  //start time countdown
}
