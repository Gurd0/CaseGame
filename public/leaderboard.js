// Fetch data from the URL
const updateLeaderboard = () => {
  fetch(
    "https://atlantic-little-snipe.glitch.me/highscores?_limit=10&_sort=score&_order=desc"
  )
    .then((response) => response.json()) // Parse the JSON data
    .then((data) => {
      // Create the table dynamically
      const table = document.createElement("leaderboard");
      table.className = "mx-auto";
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Create table headers
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement("tr");
      headers.forEach((header) => {
        switch (header) {
          case "version":
            header = "Rank";
            break;
          case "name":
            header = "Name";
            break;
          case "score":
            header = "Score";
            break;
          default:
            // Other fields should not be displayed
            return;
        }
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      let rank = 0;
      // Populate table rows with data
      data.forEach((item) => {
        const row = document.createElement("tr");
        headers.forEach((header) => {
          if (header === "id") return;
          const cell = document.createElement("td");
          if (header === "version") {
            cell.textContent = ++rank;
          } else {
            cell.textContent = item[header];
          }
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);

      // Append the table to a container element
      const container = document.getElementById("leaderboard-container");
      container.replaceChildren(table);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
updateLeaderboard();
