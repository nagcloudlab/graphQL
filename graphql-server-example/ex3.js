/**
 * graphQL : Interface Type
 */


import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";



const typeDefs = `#graphql
# Define the Book interface
interface Book {
  title: String!
  author: String!
}

# Define the Textbook type that implements the Book interface
type Textbook implements Book {
  title: String!
  author: String!
  courses: [String!]!
}

# Define the ColoringBook type that implements the Book interface
type ColoringBook implements Book {
  title: String!
  author: String!
  colors: [String!]!
}

# Query type that returns a list of books (which can be either Textbook or ColoringBook)
type Query {
  books: [Book!]!
}

`;


const resolvers = {
    Book: {
        __resolveType(obj, context, info) {
            if (obj.courses) {
                return "Textbook";
            }

            if (obj.colors) {
                return "ColoringBook";
            }
            return null; // GraphQLError if none match
        },
    },
    Query: {
        books: () => [
            { title: "Calculus", author: "James Stewart", courses: ["Math 101", "Math 102"] }, // Textbook
            { title: "The Very Hungry Caterpillar", author: "Eric Carle", colors: ["red", "green", "blue"] }, // ColoringBook
        ],
    },
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    port: 4000,
});

console.log(`Server ready at ${url}`);