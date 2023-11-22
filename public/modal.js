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
const toggleDeadModal = (score, level) => {
  document.getElementById("endScore").innerText = score;
  document.getElementById("endLevel").innerText = level;
  const dialog = document.getElementById("deadDialog");
  dialog.showModal();
};

const endOnSubmit = () => {
  const score = document.getElementById("endScore").innerText;
  const username = document.getElementById("username");
  if (username.value.length < 3) {
    document.getElementById("errorMsg").innerText =
      "username needs 3+ characters";
  } else {
    const b = {
      version: 1,
      name: username.value,
      score: score,
    };

    fetch("https://atlantic-little-snipe.glitch.me/highscores", {
      method: "POST",
      headers: {
        "X-API-KEY":
          "qlTH2MemiUxmpXQ31OhZ3akdPqKO6RRqwD0ikPvYAGZQb1c6NuclVbK9VNU4XFKO",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(b),
    });
  }
};
