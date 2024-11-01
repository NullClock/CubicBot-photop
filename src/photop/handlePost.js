import { mongo } from "../../index.js";
import { client } from "../../client.js";
import { entryExists, commandList } from "../utils.js";
import { createRequire } from "module";
import { HfInference } from "@huggingface/inference";
import fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let require = createRequire(import.meta.url);

function getCommand(name) {
  const data = require("../../commands/photop/"+name+".cjs");
  return data;
}

function getGroupCommand(name) {
  const data = require("../../commands/group_commands/"+name+".cjs");
  return data;
}

function checkCommand(name) {
  let fileExists = fs.existsSync(`${__dirname}/../../commands/photop/${name}.cjs`);
  if (fileExists) {
    return true;
  } else {
    return false;
  }
}

function checkGroupCommand(name) {
  let fileExists = fs.existsSync(`${dirname}/../../commands/group_commands/${name}.cjs`);
  if (fileExists) {
    return true;
  } else {
    return false;
  }
}

async function handlePost(post) {
  post.text = post.content;
  post.author = await post.author();
  const command = post.text.split("c!")[1];
  if (!checkCommand(command)) return;
  const violationLevelLimit = getCommand(command).violationLevelLimit || 10;
  await mongo.connect();
  const db = mongo.db("analytics");
  const db2 = mongo.db("govt");
  const coll = db.collection("usage");
  const coll2 = db2.collection("violations");
  const filter = { is: "useCount" };
  const filter2 = { command: command };
  const filter3 = { userid: post.author.id };
  const doc = await coll.findOne(filter);
  const doc2 = await coll.findOne(filter2);
  const doc3 = await coll2.findOne(filter3);
  const updateDoc = {
    $set: {
      value: doc.value + 1
    }
  };
  if (doc2 !== null) {
    await coll.updateOne(filter2, {
      $set: {
        count: doc2.count + 1
      }
    });
  } else {
    await coll.insertOne({ command: command, count: 1 });
  };

  if (doc3 !== null) {
    if (doc3?.level >= violationLevelLimit) {
      post.chat(`You are prohibited from using this command because you have a level ${doc3?.level} violation.`);
      post.disconnect();
      return;
    }
  }
  
  await coll.updateOne(filter, updateDoc);
  await getCommand(command).code(
    client,
    post,
    {
      ask,
      entryExists,
      HfInference,
      fs,
      botPost,
      commandList
    },
    mongo
  );

  post.onChat(async (chat) => {
    chat.text = chat.content;
    if (chat.text.toLowerCase() == "replay") {
      // await getCommand(command).code(
      //   client,
      //   post,
      //   {
      //     ask,
      //     entryExists,
      //     HfInference,
      //     fs,
      //     botPost,
      //     commandList
      //   },
      //   mongo
      // );
      handlePost(post);
    }
  });
}

function botPost(text) {
  client.post(text);
}

async function ask(prompt, userToAsk, post) {
  return new Promise((resolve, reject) => {
    post.chat(prompt);
    post.onChat(async (chat) => {
      chat.text = chat.content;
      chat.author = await chat.author();

      if (chat.author.name == userToAsk) {
        resolve(chat);
      } else if (userToAsk == null) {
        resolve(chat);
      }
    });
  });
}

export { handlePost };
