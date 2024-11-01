// Getting the element with the ID "cashMoneys" from the DOM
const usageCounter = document.getElementById("cashMoneys");

// Async function to fetch the usage count from an API endpoint
async function getUsage() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/v1/analytics/useCount");
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

// Immediately-invoked async function expression (IIFE)
(async () => {
  // Fetching the usage count asynchronously
  const usage = await getUsage();

  // Updating the inner text of the usageCounter element with the retrieved usage count
  usageCounter.innerText = usage;
})();