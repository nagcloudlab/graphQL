/**
 * graphQL : Union Type
 */

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
# Define a union type that can return either a Book or an Author
union SearchResult = Book | Author

# Define the Book type
type Book {
  title: String!
  pages: Int!
}

# Define the Author type
type Author {
  name: String!
  booksWritten: Int!
}

# Query type that returns a list of SearchResult
type Query {
  search(contains: String): [SearchResult!]
}

`;

const resolvers = {
  SearchResult: {
    __resolveType(obj, contextValue, info) {
      if (obj.name) {
        return "Author";
      }
      if (obj.title) {
        return "Book";
      }
      return null; // GraphQLError if none match
    },
  },
  Query: {
    search: () => [
      { title: "The Great Gatsby", pages: 218 }, // Book
      { name: "F. Scott Fitzgerald", booksWritten: 5 }, // Author
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
