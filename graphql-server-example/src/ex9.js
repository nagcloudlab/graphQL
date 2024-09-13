import gql from "graphql-tag";
import { GraphQLError } from "graphql";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginUsageReporting } from "@apollo/server/plugin/usageReporting";

// Define schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

// Mock database
const users = [{ id: "1", name: "John Doe", email: "john@example.com" }];

// Define resolvers
export const resolvers = {
  Query: {
    getUser: (parent, { id }, contextValue) => {
      // Check authentication
      if (!contextValue.user) {
        throw new GraphQLError(
          "You must be logged in to access this resource",
          {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          }
        );
      }

      const user = users.find((user) => user.id === id);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "USER_NOT_FOUND",
            invalidId: id,
          },
        });
      }
      return user;
    },
  },
  Mutation: {
    createUser: (parent, { name, email }) => {
      // Validate input
      if (!name || !email) {
        throw new GraphQLError("Name and email are required", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!validateEmail(email)) {
        throw new GraphQLError("Invalid email format", {
          extensions: {
            code: "EMAIL_VALIDATION_ERROR",
            invalidEmail: email,
          },
        });
      }

      const newUser = { id: String(users.length + 1), name, email };
      users.push(newUser);
      return newUser;
    },
  },
};

// Simple email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Custom error formatting
  formatError: (err) => {
    // Mask internal server errors for the client
    if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
      return new GraphQLError("Something went wrong");
    }
    return err; // Return all other errors as is
  },
  // Error logging plugin
  plugins: [
    ApolloServerPluginUsageReporting(), // Report errors to Apollo Studio
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            console.error("GraphQL Errors:", requestContext.errors);
          },
        };
      },
    },
  ],
});

// Start the Apollo Server
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    // Simulate authentication (user exists if token is 'valid-token')
    const token = req.headers.authorization || "";
    const user = token === "valid-token" ? { id: "1", name: "John Doe" } : null;
    return { user };
  },
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
