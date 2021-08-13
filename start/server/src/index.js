import "dotenv/config.js";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema.js";
import { createStore } from "./utils.js";
import resolvers from "./resolvers.js";
import isEmail from "isemail";
import { LaunchAPI } from "./datasources/launch.js";
import { UserAPI } from "./datasources/user.js";

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;
    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
    `);
});
