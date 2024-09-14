// authors-subgraph/index.js
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

// Define schema for the authors subgraph
const typeDefs = gql`
  extend type Query {
    authors: [Author]
  }

  type Author @key(fields: "id") {
    id: ID!
    name: String
  }
`;

// Sample data for authors
const authors = [
  { id: "1", name: "Kate Chopin" },
  { id: "2", name: "Paul Auster" },
];

// Resolvers for authors
const resolvers = {
  Query: {
    authors: () => authors,
  },
  Author: {
    __resolveReference(author) {
      return authors.find((a) => a.id === author.id);
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Use startStandaloneServer to start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
});

console.log(`🚀 Authors subgraph ready at ${url}`);
