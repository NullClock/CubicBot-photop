const div = document.querySelector("#bailDiv");
const button = document.querySelector("#btn1");

let userid;
let user;
let code;

button.addEventListener("click", () => {
  userid = document.querySelector("#uid").value;
  user = document.querySelector("#uname").value;
  code = document.querySelector("#code").value;

  const xhr = new XMLHttpRequest();
  
  xhr.open("POST", "https://cubicbot.cubicdev.repl.co/api/v1/govt/removeViolation");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ userid, user, code }));

  xhr.onload = () => {
    if (xhr.responseText == "OK") {
      alert("Violation removed.");
    } else if (xhr.responseText == "BAD CODE") {
      alert("Invalid code..");
    } else {
      alert("The system had a fucko wucko uwu");
    }
  }
});