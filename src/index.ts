import { importSchema } from "graphql-import";
import resolvers from "./resolvers";
import { GraphQLServer } from "graphql-yoga";

const typeDefs = importSchema("./src/schema/schema.graphql");

// server initialization
const server = new GraphQLServer({
  typeDefs: "./src/schema/schema.graphql",
  resolvers,
  context: req => ({ ...req })
});

// configuration for graphql yoga
const options = {
  port: process.env.PORT || 4000,
  endpoint: process.env.GQL_ENDPOINT || "/",
  subscriptions: process.env.SUBSCRIPTION || "/",
  playground: process.env.PLAYGROUND || "/"
};

// start the server
server.start(options, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
