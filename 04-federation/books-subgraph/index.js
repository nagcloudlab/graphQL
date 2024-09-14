// books-subgraph/index.js
import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

// Define schema for the books subgraph
const typeDefs = gql`
  extend type Query {
    books: [Book]
  }

  type Book @key(fields: "id") {
    id: ID!
    title: String
    authorId: ID!
  }
`;

// Sample data for books
const books = [
  { id: "1", title: "The Awakening", authorId: "1" },
  { id: "2", title: "City of Glass", authorId: "2" },
];

// Resolvers for books
const resolvers = {
  Query: {
    books: () => books,
  },
  Book: {
    __resolveReference(book) {
      return books.find((b) => b.id === book.id);
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Use startStandaloneServer to start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`🚀 Books subgraph ready at ${url}`);
