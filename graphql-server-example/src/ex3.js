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
    __resolveType(obj) {
      if (obj.courses) {
        return "Textbook"; // If the object has 'courses', it's a Textbook
      }
      if (obj.colors) {
        return "ColoringBook"; // If the object has 'colors', it's a ColoringBook
      }
      return null; // Return null if no valid type is found
    },
  },
  Query: {
    books: () => [
      {
        title: "Advanced Math",
        author: "John Doe",
        courses: ["Math 101", "Math 102"],
      }, // Textbook
      {
        title: "Color the Sky",
        author: "Jane Doe",
        colors: ["Red", "Blue", "Yellow"],
      }, // ColoringBook
    ],
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
