/**
 * graphQL : Custom Scalar Types
 */

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar for Date",
  serialize(value) {
    return value.getTime(); // Converts Date to timestamp for JSON
  },
  parseValue(value) {
    return new Date(value); // Converts JSON timestamp to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Handles hardcoded integers in queries
    }
    return null;
  },
});

const typeDefs = `#graphql

scalar Date

type Event {
  id: ID!
  date: Date!
}

type Query{
  events:[Event]
}

`;

const resolvers = {
  Date: dateScalar,
  Query: {
    events: () => [{ id: "1", date: new Date() }],
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
