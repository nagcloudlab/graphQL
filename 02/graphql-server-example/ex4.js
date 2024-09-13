/**
 * graphQL : Custom Scalar Types
 */


import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLScalarType, Kind } from "graphql";


const typeDefs = `#graphql

scalar Date
scalar Odd

type Event {
  id: ID!
  date: Date!
}

type Query{
  events(d:Date):[Event]
   echoOdd(odd: Odd!): Odd!
}

`;

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

const oddScalar = new GraphQLScalarType({
    name: 'Odd',
    description: 'Custom scalar for odd integers',
    serialize(value) {
        if (value % 2 !== 0) {
            return value;
        }
        throw new Error('Value must be an odd integer');
    },
    parseValue(value) {
        if (value % 2 !== 0) {
            return value;
        }
        throw new Error('Value must be an odd integer');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT && parseInt(ast.value, 10) % 2 !== 0) {
            return parseInt(ast.value, 10);
        }
        throw new Error('Value must be an odd integer');
    },
});




const resolvers = {
    Date: dateScalar,
    Odd: oddScalar,
    Query: {
        events: (p, args) => [
            console.log(args),
            { id: "1", date: new Date() },
            { id: "2", date: new Date() },
        ],
        echoOdd: (p, args) => {
            console.log(args);
            return args.odd;
        },
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