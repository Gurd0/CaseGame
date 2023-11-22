let imageRoad = document.getElementById("road");
let imageGoal = document.getElementById("goal");
let imageGravel = document.getElementById("gravel");
let imageSand = document.getElementById("sand");
let imageWater = document.getElementById("water");

export function drawBackground(canvas, context, grid) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw road background
  context.fillStyle = "#252525";
  context.fillRect(0, grid, canvas.width, grid * 13);
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageRoad, grid * i, grid * 11, grid, grid);
    context.drawImage(imageRoad, grid * i, grid * 9, grid, grid);
  }

  // draw the game background
  // water
  context.fillStyle = "#000047";
  context.fillRect(0, grid, canvas.width, grid * 6);

  // draw the game background
  // water
  for (let i = 0; i < 13; i++) {
    for (let x = 2; x < 7; x++) {
      context.drawImage(imageWater, grid * i, grid * x, grid, grid);
    }
  }

  // end bank
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageGoal, grid * i, grid * 1, grid, grid);
  }

  // beach
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageSand, grid * i, grid * 7, grid, grid);
  }

  // start zone
  for (let i = 0; i < 13; i++) {
    context.drawImage(imageGravel, grid * i, grid * 13, grid, grid);
  }
}
