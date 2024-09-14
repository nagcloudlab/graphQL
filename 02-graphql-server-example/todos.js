
// graphql : introduction

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { createClient } from 'redis';
import mysql from 'mysql2/promise';

const redisClient = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();


// Create the connection to database
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'todosdb',
});


const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String
    completed: Boolean
  }

  type Query {
    todos(limit:Int!): [Todo]
  }
`;


const resolvers = {
    Query: {
        todos: async () => {

            // check if data is in cache ( redis )
            const cachedData = await redisClient.get('todos');
            if (cachedData) {
                console.log('Data from cache');
                const todos = JSON.parse(cachedData);
                return todos;
            }

            // fetch data from db ( mysql )
            const [rows] = await connection.execute('SELECT * FROM todos');
            const todos = rows.map(row => ({ ...row, id: row.id }));

            // store data in cache with 1 min expiry
            await redisClient.set('todos', JSON.stringify(todos), 'EX', 10);

            console.log('Data from db');
            return todos;

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