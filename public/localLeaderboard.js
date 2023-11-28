export { updateLocalLeaderboard, addEntryToLocalLeaderboard };

const updateLocalLeaderboard = () => {
  let cookie = undefined;
  try {
    cookie = JSON.parse(document.cookie.split("=")[1]);
    cookie = cookie.slice(0, 10);
  } catch (error) {
    // There is no data in cookie yet. No handling needed tbh
  }

  const table = document.createElement("local-leaderboard");
  table.className = "mx-auto table-fixed";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Create table headers
  let headers = ["Rank", "Name", "Score"];
  const headerRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  //If cookie has no data, then set the headers then return
  if (cookie === undefined) {
    const container = document.getElementById("local-leaderboard-container");
    container.replaceChildren(table);
    return;
  }

  let rank = 0;

  // Populate table rows with data
  cookie.forEach((item) => {
    const row = document.createElement("tr");

    // rank
    let cell = document.createElement("td");
    cell.textContent = ++rank;
    row.appendChild(cell);

    // name
    cell = document.createElement("td");
    cell.textContent = item["name"];
    row.appendChild(cell);

    // score
    cell = document.createElement("td");
    cell.textContent = item["score"];
    row.appendChild(cell);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append the table to a container element
  const container = document.getElementById("local-leaderboard-container");
  container.replaceChildren(table);
};
updateLocalLeaderboard();

/**
 * Add a new entry to the local leaderboard
 * @param {*} name The name of the entry
 * @param {*} score The score of the entry
 * @returns Nothing
 */
function addEntryToLocalLeaderboard(name, email, phoneNumber, score) {
  let cookie = undefined;
  try {
    cookie = JSON.parse(document.cookie.split("=")[1]);
    console.log(cookie);
  } catch (error) {
    cookie = [];
  }

  cookie.push({
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    score: score,
  });

  // we only want the top 10 scores
  cookie.sort((a, b) => b.score - a.score);

  const cookieName = "localStorage";
  const cookieData = JSON.stringify(cookie);
  const cookieSameSitePolicy = ";SameSite=strict";
  const cookiePath = ";path=/";

  document.cookie =
    cookieName + "=" + cookieData + cookieSameSitePolicy + cookiePath;
}
