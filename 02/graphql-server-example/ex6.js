import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

// Mock database
const db = {
    User: {
        findByPk: (id) => ({ id, name: "John Doe", email: "john@example.com" }),
    },
};

// Define schema
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    currentUser: User
  }
`;

// Define resolvers
const resolvers = {
    Query: {
        currentUser: (parent, args, contextValue) => {
            if (!contextValue.user) {
                throw new Error("You must be logged in");
            }
            return contextValue.db.User.findByPk(contextValue.user.id);
        },
    },
};

// Log resolver timings plugin
const logTimingPlugin = {
    async requestDidStart() {
        console.log("Request started");
        return {
            executionDidStart() {
                console.log("Execution started");
                return {
                    willResolveField({ info }) {
                        const start = Date.now();
                        return (error, result) => {
                            const duration = Date.now() - start;
                            console.log(`Resolved ${info.fieldName} in ${duration}ms`);
                        };
                    },
                };
            },
        };
    },
};

// Create Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [logTimingPlugin],
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        const user = token === "valid-token" ? { id: 1 } : null;
        return { user, db };
    },
});

console.log(`🚀  Server ready at: ${url}`);