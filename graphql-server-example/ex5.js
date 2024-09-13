import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { defaultFieldResolver } from "graphql";
import { mapSchema, MapperKind } from "@graphql-tools/utils";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  # Define custom directive
  directive @uppercase on FIELD_DEFINITION

  # Define schema using the @uppercase directive
  type Query {
    hello: String @uppercase
  }
`;

const resolvers = {
    Query: {
        hello: () => "hello world",
    },
};

// Transformer function to handle @uppercase directive
export const upperDirectiveTransformer = (schema) => {

    return mapSchema(schema, {

        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {

            const directives = fieldConfig.astNode?.directives;

            if (directives) {

                const upperDirective = directives.find(
                    (directive) => directive.name.value === "uppercase"
                );

                if (upperDirective) {
                    const { resolve = defaultFieldResolver } = fieldConfig;
                    fieldConfig.resolve = async function (source, args, context, info) {
                        // Call the original resolver
                        const result = await resolve(source, args, context, info);
                        if (typeof result === "string") {
                            return result.toUpperCase();
                        }
                        return result;
                    };
                }
            }
            return fieldConfig;
        },
    });
};

// Create the executable schema
let schema = makeExecutableSchema({ typeDefs, resolvers });
// Apply the @uppercase directive transformation
schema = upperDirectiveTransformer(schema);

// Create and start Apollo Server
const server = new ApolloServer({
    schema,
});

// Start the server with the new Apollo Server v4 API
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
