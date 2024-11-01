import { Client } from "lyon";

const client = await new Client({
  userid: "photop bot userid",
  token: "photop bot token",
  onReady() {
    console.log("CubicBot is ready to cube cubicals as if they were cubical cubics and cubing cubes.");
  }
});

export { client }
