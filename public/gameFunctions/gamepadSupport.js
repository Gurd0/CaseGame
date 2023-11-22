import {
  upClick,
  downClick,
  leftClick,
  rightClick,
  playFrogSound,
  resetGame,
} from "../game.js";

let released0 = true; // A-button
let released9 = true; // start
let released12 = true; // up
let released13 = true; // down
let released14 = true; // left
let released15 = true; // right

export function checkGamepad() {
  var gamepad = navigator.getGamepads()[0]; //get the first controller.
  if (gamepad && gamepad.connected) {
    //check if direction buttons (UP, DOWN, LEFT, RIGHT) was pressed
    // to check if other buttons(A,B,C,D,OK,Exit...) was pressed
    var buttons = gamepad.buttons;

    //check if a button was pressed
    if (buttons[12].pressed == true && released12) {
      released12 = false;
      upClick();
    } else if (buttons[13].pressed == true && released13) {
      released13 = false;
      downClick();
    } else if (buttons[14].pressed == true && released14) {
      released14 = false;
      leftClick();
    } else if (buttons[15].pressed == true && released15) {
      released15 = false;
      rightClick();
    } else if (buttons[0].pressed == true && released0) {
      released0 = false;
      playFrogSound();
    } else if (buttons[9].pressed == true && released9) {
      released9 = false;
      resetGame();
    }

    //check if a button was released
    if (buttons[12].pressed == false && !released12) {
      released12 = true;
    } else if (buttons[13].pressed == false && !released13) {
      released13 = true;
    } else if (buttons[14].pressed == false && !released14) {
      released14 = true;
    } else if (buttons[15].pressed == false && !released15) {
      released15 = true;
    } else if (buttons[0].pressed == false && !released0) {
      released0 = true;
    } else if (buttons[9].pressed == false && !released9) {
      released9 = true;
    }
  }
}
