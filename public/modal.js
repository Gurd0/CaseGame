import { gameStart } from "./game.js";
import {
  addEntryToLocalLeaderboard,
  updateLocalLeaderboard,
} from "./localLeaderboard.js";

// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let btnClose = document.getElementById("closeModal");
const runItBackBtn = document.getElementById("runItBack");
runItBackBtn.addEventListener("click", function () {
  removeDeadModal();
  gameStart();
});
const endOnSubmitBtn = document.getElementById("endOnSubmit");
endOnSubmitBtn.addEventListener("click", function () {
  endOnSubmit();
});

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

const openStartModal = () => {
  modal.style.display = "block";
};

export const toggleDeadModal = (score, level) => {
  document.getElementById("endScore").innerText = score;
  document.getElementById("endLevel").innerText = level;
  const dialog = document.getElementById("deadDialog");
  dialog.showModal();
};
const removeDeadModal = () => {
  const dialog = document.getElementById("deadDialog");
  dialog.close();
};

const resetModalInfo = () => {
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");

  username.value = "";
  email.value = "";
  phoneNumber = "";
};

const endOnSubmit = async () => {
  const score = document.getElementById("endScore").innerText;
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const phophoneNumberne = document.getElementById("phoneNumber");
  if (username.value.length < 3) {
    document.getElementById("errorMsg").innerText =
      "username needs 3+ characters";
  } else if (username.value.length > 15) {
    document.getElementById("errorMsg").innerText =
      "username needs to be less than 15 characters";
  } else {
    const b = JSON.stringify({
      version: 1,
      name: username.value,
      score: Number(score),
    });

    await fetch("https://atlantic-little-snipe.glitch.me/highscores", {
      method: "POST",
      headers: {
        "X-API-KEY":
          "qlTH2MemiUxmpXQ31OhZ3akdPqKO6RRqwD0ikPvYAGZQb1c6NuclVbK9VNU4XFKO",
        "Content-Type": "application/json",
      },
      body: b,
    }).then(() => {
      updateLeaderboard();
    });

    //update the local leaderboard
    addEntryToLocalLeaderboard(
      username.value,
      email.value,
      phoneNumber.value,
      Number(score)
    );
    updateLocalLeaderboard();

    resetModalInfo();
    removeDeadModal();
    openStartModal();
    gameStart();
  }
};
