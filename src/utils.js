import fs from "fs";
import { createRequire } from "module";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const config = {
  server: "https://photop.exotek.co/"
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function entryExists(collection, db, filter, mongo) {
  await mongo.connect();
  const dbo = mongo.db(db);
  const coll = dbo.collection(collection);
  const result = await coll.findOne(filter);
  if (result !== null) {
    return true;
  } else {
    return false;
  }
}

function commandList() {
  const cList = fs.readdirSync(__dirname + "/commands/photop/", "utf-8");
  for(let i = 0; i < cList.length; i++) {
    if (require(`../commands/photop/${cList[i]}`).desc === "[!DNI]") {
      cList[i] = undefined;
    } else {
      cList[i] = `${cList[i]} - ${require(`../commands/photop/${cList[i]}`).desc}`;
      cList[i] = "c!" + cList[i].replace(".cjs", '');
    }
  }
  return cList;
}

export {
  sleep,
  config,
  entryExists,
  commandList
}