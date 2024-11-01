module.exports = {
  desc: "Reads your knock knock jokes.", // Description of the functionality

  async code(bot, post, system) {
    const author = post.author.name; // Getting the author's name from the 'post' object

    // Asking the author "Who's there?" and awaiting their response
    const who = await system.ask("Who's there?", author, post);
    who.text = who.content;

    // Checking if a response was received
    if (who?.text) {
      // If a response was received, construct the follow-up question using the response
      const whowho = await system.ask(`${who.text} who?`, author, post);
      whowho.text = whowho.content;

      // Checking if a response to the follow-up question was received
      if (whowho?.text) {
        // If a response was received, reply with "lol" as the punchline
        whowho.reply("lol");
      }
    }
  }
}
