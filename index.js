import { client } from "./client.js";
import { handlePost } from "./src/photop/handlePost.js";
import { handleServer } from "./src/handleServer.js";
import { createRequire } from "module";
// import { Octokit } from "@octokit/rest";
import express from "express";
import Quotes from "quotesy";
import "dotenv/config";

console.log("THIS IS BROKEN BECAUSE OF AN NPM MODULE UPDATE");

const app = express();
const date = new Date(changeTZ("GMT") - 18000000);
const require = createRequire(import.meta.url);

// not working anymore but ok
const CSTRING = "<mongo conn string>"; // REPLACE THIS!!

const { MongoClient, ServerApiVersion } = require("mongodb");
const mongo = new MongoClient(CSTRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

// const octokit = new Octokit({
//   auth: "nuh uh uh freaky"
// });

await handleServer(app, express, mongo, client);
//await initCommands();

client.onPost(async (post) => {
  try {
    await handlePost(post);
  } catch(e) {
    console.log("New error: " + e)
  }
});

setInterval(async () => {
  let filter = {
    is: "date",
    for: "qotd"
  };
  
  const db = mongo.db("data");
  const coll = db.collection("misc");
  const uRes = await coll.findOne(filter);
  const resp = uRes.date;
  const dateD = date.getDate();
  const dD = parseInt(resp.split(";")[1]);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const quote = Quotes.random();

  if (dateD > dD && hour > 1 && minute > 25) {
    const quote2 = `"${quote.text}" - ${quote.author}`;
    client.post(quote2);

    await coll.updateOne(filter, {
      $set: {
        date: `${date.getMonth() + 1};${dateD};${date.getFullYear()}`
      }
    });
  }
}, 3600000);

// setInterval(() => {
//   octokit.rest.actions.reRunWorkflow({
//     owner: "NullClock",
//     repo: "CubicBot",
//     run_id: "7776511665"
//   });

//   process.exit(1);
// }, 108900000);

function changeTZ(timezone) {
  var date = new Date();
  var invdate = new Date(date.toLocaleString('en-US', {
    timeZone: timezone
  }));
  
  var diff = date.getTime() - invdate.getTime();
  return new Date(date.getTime() - diff);
}

export { mongo }
