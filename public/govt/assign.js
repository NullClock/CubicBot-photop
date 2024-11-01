const div = document.querySelector("#bailDiv");
const button = document.querySelector("#btn1");

let userid;
let user;
let vreason;
let vlevel;
let vbail;
let code;

button.addEventListener("click", () => {
  userid = document.querySelector("#uid").value;
  user = document.querySelector("#uname").value;
  vreason = document.querySelector("#vreason").value;
  vlevel = document.querySelector("#vlevel").value;
  vbail = document.querySelector("#vbail").value;
  code = document.querySelector("#code").value;
  
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "https://cubicbot.cubicdev.repl.co/api/v1/govt/assignViolation");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ userid, user, violation: vreason, level: vlevel, bail: vbail, code }));
  
  xhr.onload = () => {
    if (xhr.status == 200) {
      alert("Violation assigned.");
    } else if (xhr.status == 401) {
      alert("Invalid code..");
    } else {
      alert("The system had a fucko wucko uwu");
    }
  }
});