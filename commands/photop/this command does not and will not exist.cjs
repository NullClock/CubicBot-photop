module.exports = {
  desc: "[!DNI]", // Description of the functionality as "Do Not Include" in the command list

  async code(bot, post, system) { // Async function taking in 'bot', 'post', and 'system' as parameters
    post.chat("But it does.."); // Sending a message "But it does.." through the bot in a chat or messaging context
  }
}
