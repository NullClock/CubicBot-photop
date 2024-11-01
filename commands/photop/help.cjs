module.exports = {
  desc: "Sends the command list",
  async code(bot, post, system) {
    const list = await system.commandList();
    let i = 0;

    list.forEach(async (command) => {
      i++;
      await wait(1000);
      post.chat(command);
    });
  }
}

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
