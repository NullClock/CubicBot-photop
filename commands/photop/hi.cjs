module.exports = {
  desc: "Makes the bot say 'Hello!'", // Description of the code or its functionality
  async code(bot, post, system) { // Async function receiving parameters 'bot', 'post', and 'system'
    post.chat("Hello!"); // Executing a method 'chat' on the 'post' object to make the bot say 'Hello!'
  }
}