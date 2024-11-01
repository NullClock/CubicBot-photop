module.exports = {
  desc: "Wanna shut somebody up?", // Description of the functionality

  async code(bot, post, system) { // Async function taking in 'bot', 'post', and 'system' as parameters
    // Asking the author for the target person to "mouth shut" and awaiting their response
    const who = await system.ask(
      "Who should I mouth shur?", // Prompt message
      post.author.name, // Author's name
      post // 'post' object
    );
    who.text = who.content;
    who.author = await who.author();

    // Posting an image to the target person's post to "shut them up"
    bot.post(`${who.text}`, { // Posting to the target person
      images: [__dirname + "/../../img/shut.jpg"] // Image used to "shut them up"
    });
  }
};
