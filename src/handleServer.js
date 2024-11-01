import { commandList } from "./utils.js";
 
export async function handleServer(app, express, mongo, bot) {
  app.use(express.static("public")); 
  app.use(express.json()); 

  
  app.get("/api/v1/analytics/useCount", async (req, res) => {
    await mongo.connect();
    const db = mongo.db("analytics");
    const coll = db.collection("usage");
    const doc = await coll.findOne({ is: "useCount" });
    
    res.send(doc.value.toString());
  });

  
  app.get("/api/v1/analytics/command/:commandname", async (req, res) => {
    await mongo.connect();
    const db = mongo.db("analytics");
    const coll = db.collection("usage");
    const command = req.params.commandname;
    const doc = await coll.findOne({ command: command });
    
    if (doc !== null) {
      res.send(doc.count.toString());
    } else {
      res.status(404).send("Command not found");
    }
  });

  app.get("/api/v1/commands/list", (req, res) => {
    const commands = commandList();
    
    res.json(commands);
  });
  
  app.post("/api/v1/dragon/joinGroup", (req, res) => {
    const groupInv = req.body.groupInv;
    let urlObj;
    
    if (!groupInv.startsWith("https://app.photop.live/?j=")) {
      res.status(400).send("Code 400: Invalid invite!");
      urlObj = null;
    } else {
      urlObj = new URL(groupInv).searchParams;
      bot.joinGroup({ code: urlObj.get("j") });
    }
  });

  app.post("/api/v1/govt/assignViolation", async (req, res) => {
    const user = req.body.user;
    const userid = req.body.userid;
    const violation = req.body.violation;
    const level = req.body.level;
    const bail = req.body.bail;
    const code = req.body.code;
    const rcode = JSON.parse(process.env.govtCode1);
    await mongo.connect();
    const db = mongo.db("govt");
    const coll = db.collection("violations");

    await coll.insertOne({
      userid: userid,
      user: user,
      violation: violation,
      level: level,
      bail: bail
    });

    if (rcode.includes(code)) {
      bot.post(`@${user} has been assigned a level ${level} violation. Reason: ${violation}; Cost of de-criminalization: ${bail} Cubes`);
      res.send("OK");
    } else {
      res.status(401).send("BAD CODE");
    }
  });

  app.post("/api/v1/govt/removeViolation", async (req, res) => {
    const user = req.body.user;
    const userid = req.body.userid;
    const code = req.body.code;
    const rcode = JSON.parse(process.env.govtCode1);
    await mongo.connect();
    const db = mongo.db("govt");
    const coll = db.collection("violations");

    if (rcode.includes(code)) {
      await coll.deleteOne({ userid: userid });
      bot.post(`@${user} 's violation has been removed successfully!`);
      res.send("OK");
    } else {
      res.status(401).send("BAD CODE");
    }
  });
  
  app.listen(3655, () => {
    console.log("CubicBot cubed a cubic server for cubic EXTRA cubicals!!");
  });
}
