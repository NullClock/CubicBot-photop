let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y"];

module.exports = {
  desc: "Pay someone money!",
  async code(bot, post, system, mongo) {
    let id = post.author.id;

    await mongo.connect();
    const db = mongo.db("data");
    const coll = db.collection("users");
    const doc = await coll.findOne({ userid: id });
    const bal = doc?.balance || 0;

    if (bal == null) post.chat("You don't have any money to give!");
    else {
      const who = await system.ask(
        "Tag who you want to pay",
        post.author.name,
        post
      );
      who.text = who.content;

      if (!who.text.includes("@")) { who.reply("Tag them, don't tell me their name! Please replay the command!"); return; }
      else {
        const a = who.text.replace("@", "");
        const ret = a.split("\"");
        const userid = a.replace('"' + ret[1] + '"', "");

        const filter = { userid: userid };
        const doc2 = await coll.findOne(filter) || null;
        const bal2 = doc2?.balance || 0;

        if (doc2 == null) {
          await coll.insertOne({ userid: userid, balance: 0 });
        }

        const howm = await system.ask(
          "How much money do you want to pay?",
          post.author.name,
          post
        );
        howm.text = howm.content;

        if (parseInt(howm.text) < 0) {
          howm.reply("You can't pay negative money!");
          return;
        } else if (userid == id) {
          post.chat("You can't pay yourself! (this used to just take all ur money as punishment but eh)");
          return;
        } else if (howm.text.includes(letters)) {
          post.chat("You can't pay money with letters!");
          return;
        } else if (bal >= parseInt(howm.text)) {
          const doc22 = await coll.findOne(filter);
          const bal22 = doc2?.balance || 0;

          coll.updateOne(filter, {
            $set: {
              balance: bal22 + parseInt(howm.text)
            }
          });

          coll.updateOne({ userid: id }, {
            $set: {
              balance: bal - parseInt(howm.text)
            }
          });

          post.chat(`You gave ${who.text} ${howm.text} cubes!`);
        } else post.chat("Not enough money.");
      }
    }
  }
}
