// gateway/index.js
import { ApolloServer } from "@apollo/server";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { startStandaloneServer } from "@apollo/server/standalone";

// Define the gateway, which will compose the two subgraphs
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "books", url: "http://localhost:4001/graphql" },
      { name: "authors", url: "http://localhost:4002/graphql" },
    ],
  }),
});

// Create Apollo Server instance for the gateway
const server = new ApolloServer({
  gateway,
  subscriptions: false, // Subscriptions are not supported in Apollo Federation
});

// Use startStandaloneServer to start the gateway
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Gateway ready at ${url}`);
