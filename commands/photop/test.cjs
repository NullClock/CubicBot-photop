module.exports = {
  desc: "Testing the new CubicBot system.", // Description of the functionality

  async code(bot, post, system) { // Async function taking in 'bot', 'post', and 'system' as parameters
    // Asking the author a question and awaiting their response
    const response = await system.ask(
      "are u mentally ok", // Prompt message
      post.author.name, // Author's name
      post // 'post' object
    );
    respose.text = response.content;

    // Checking the response text to determine the bot's reply
    if (response.text == "yes") {
      // If the response is "yes", the bot replies with "YAY"
      response.reply("YAY");
    } else if (response.text !== "yes") {
      // If the response is not "yes", the bot replies with "get better <3"
      response.reply("get better <3");
    }
  }
};
