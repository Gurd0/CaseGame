import { gameStart } from "./game.js";

// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let btnClose = document.getElementById("closeModal");

// When the user clicks on <span> (x), close the modal
btnClose.onclick = function () {
  modal.style.display = "none";
  gameStart();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    gameStart();
  }
};
