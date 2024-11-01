module.exports = {
  desc: "Allows you to gamble with others.",
  violationLevelLimit: 2,
  async code(bot, post, system, mongo) {
    await play(bot, post, system, mongo);
  }
}

async function play(bot, post, system, mongo) {
  let randB = Math.floor(Math.random() * 6);
  let rand = randB == 0 ? 1 : randB;

  const inpt = await system.ask(
    "Pick a number from 1 to 6. (roll a dice!)",
    post.author.name,
    post
  );
  const roll = parseInt(inpt.text);

  if (roll > 6) {
    inpt.reply(`Since when did a dice have more than 6 sides? Ending session..`);
    post.disconnect();
    return;
  } else if (roll == rand) {
    inpt.reply(`You rolled a ${roll} and the dice rolled a ${rand}! You won 5 cubes!`);

    await mongo.connect();
    const db = mongo.db("data");
    const coll = db.collection("users");
    const filter = { userid: inpt.author.id };
    const doc = await coll.findOne(filter);

    if (doc !== null) {
      const bal = doc.balance;
      const add = bal + 5 || 5;

      await coll.updateOne(filter, { $set: { balance: add } });
    } else {
      await coll.insertOne({
        userid: post.author.id,
        balance: 5
      });
    }
  } else if (roll !== rand) {
    inpt.reply(`You rolled a ${roll} and the dice rolled a ${rand}! You lost!`);

    
  }
}
