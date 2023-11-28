const updateLocalLeaderboard = () => {
  let cookie = undefined;
  try {
    cookie = JSON.parse(document.cookie.split("=")[1]);
  } catch (error) {
    // There is no data in cookie yet. No handling needed tbh
  }

  const table = document.createElement("local-leaderboard");
  table.className = "mx-auto table-fixed";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Create table headers
  let headers = ["Rank", "Name", "Email", "Phonenumber", "Score"];
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

    // email
    cell = document.createElement("td");
    cell.textContent = item["email"];
    row.appendChild(cell);

    // phone
    cell = document.createElement("td");
    cell.textContent = item["phoneNumber"];
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

const elDeleteButton = document.getElementById("deleteLocalStorageButton");
elDeleteButton.addEventListener("click", () => {
  console.log("CLICK!");
  if (confirm("This will delete this information for good. Are you sure?")) {
    const cookieName = "localStorage";
    const cookieData = ""; // Manually set the data portion of the cookie to an empty string
    const cookieSameSitePolicy = ";SameSite=strict";
    const cookiePath = ";path=/";

    document.cookie =
      cookieName + "=" + cookieData + cookieSameSitePolicy + cookiePath;
    updateLocalLeaderboard();
  }
});
