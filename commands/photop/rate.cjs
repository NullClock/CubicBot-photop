module.exports = {
  desc: "Rates something from 1% to 100%.",
  async code(bot, post, system, mongo) {
    const what = await system.ask(
      "What would you like me to rate?",
      post.author.name,
      post
    );
    what.text = what.content;

    post.chat("I rate " + what.text + " a " + rate(what.text) + "%.");
  }
}

function rate(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
  }
  return (Math.abs(hash) % 100) + 1;
}
