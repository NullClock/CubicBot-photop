// Selecting an element with the ID "cList" from the DOM
const cList = document.querySelector("#cList");

// Creating a new 'table' element
const table = document.createElement("table");

// Setting the initial structure for the table in its inner HTML
table.innerHTML = `
<thead>
  <tr>
    <th colspan="1">Command</th>
    <th colspan="1">Description</th>
  </tr>
</thead>
`;

// Appending the table to the 'cList' element
cList.append(table);

// Async function to fetch the command list from an API endpoint
async function getCommandList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/v1/commands/list");
    xhr.send();

    // Handling the response from the server
    xhr.onload = () => {
      if (xhr.status == 200) {
        // If the request is successful (status code 200), resolve with the response text
        resolve(xhr.responseText);
      } else {
        // If there's an error, reject with an object containing status and response text
        reject({ status: xhr.status, response: xhr.responseText });
      }
    }

    // Handling network errors
    xhr.onerror = (error) => {
      // Rejecting the promise with the error object for network-related issues
      reject(error);
    }
  });
}

// Calling the getCommandList function and processing the list of commands
getCommandList()
  .then(list => {
    const json = JSON.parse(list);

    // Iterating through each command in the list and adding it to the table's HTML content
    json.forEach(command => {
      table.innerHTML += `
        <tbody>
          <tr>
            <td>${command.split(" - ")[0]}</td>
            <td>${command.split(" - ")[1]}</td>
          </tr>
        </tbody>
      `;
    });
  });