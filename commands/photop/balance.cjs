module.exports = {
  desc: "Checks your balance.",
  async code(bot, post, system, mongo) {
    post.text = post.content;
    
    const userid = post.author.id;

    await mongo.connect();
    const db = mongo.db("data");
    const coll = db.collection("users");
    const filter = { userid: userid };
    const doc = await coll.findOne(filter);
    const bal = doc?.balance;

    if (bal == null) post.chat(`Your balance is 0 cubes.`);
    else post.chat(`Your balance is ${bal} cubes.`);
  }
}
