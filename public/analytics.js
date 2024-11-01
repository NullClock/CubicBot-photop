// Selecting the element with the ID "analytics" from the DOM
const analytics = document.querySelector("#analytics");

// Function to handle form submission
function submit(elem) {
  (async () => {
    // Retrieving the value of the commandName input field and formatting the command
    const commandA = document.querySelector("#commandName").value;
    const command = commandA.replace("c!", "");

    try {
      // Retrieving the usage count for the specified command
      const usage = await getCommandUsageCount(command);

      // Updating the analytics element with the command and its usage count
      analytics.innerHTML = `${command}: ${usage}<br>`;
    } catch (e) {
      // Handling errors when the service is unavailable or the command doesn't exist
      analytics.innerHTML = `Service unavailable or command "${command}" does not exist.<br>`;
    }
  })();
}

// Async function to fetch the usage count for a specific command
async function getCommandUsageCount(command) {
  return new Promise((resolve, reject) => {
    // Creating a new XMLHttpRequest object to make a GET request to the analytics endpoint
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/v1/analytics/command/" + command);
    xhr.send();

    // Handling the response from the server
    xhr.onload = () => {
      if (xhr.status == 200) {
        // If the request is successful (status code 200), resolve with the response text
        resolve(xhr.responseText);
      } else {
        // If there's an error, reject with an error message
        reject("Analytics Error: Service unavailable or command not found.");
      }
    }

    // Handling network errors
    xhr.onerror = () => {
      // Rejecting the promise with an error message for network-related issues
      reject("Analytics Error: Service unavailable or command not found.");
    }
  });
}