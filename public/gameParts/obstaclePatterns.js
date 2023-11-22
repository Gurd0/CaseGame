export function getObstaclePattern(grid) {
  return [
    // end bank is safe
    null,

    // log
    {
      spacing: [2], // how many grid spaces between each obstacle
      color: "#c55843", // color of the obstacle
      size: grid * 4, // width (rect) / diameter (circle) of the obstacle
      shape: "log4", // shape of the obstacle (rect or circle)
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
      speed: -0.9,
    },

    // long log
    {
      spacing: [2, 4],
      color: "#c55843",
      size: grid * 6,
      shape: "log6",
      speed: 1.5,
    },

    // log
    {
      spacing: [3, 5],
      color: "#c55843",
      size: grid * 3,
      shape: "log3",
      speed: 0.5,
    },

    // turtle
    {
      spacing: [0, 2],
      color: "#de0004",
      size: grid,
      shape: "turtle",
      currentFrame: 0,
      speed: -1.2,
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
}
