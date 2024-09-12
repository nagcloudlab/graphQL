

const { gql } = require('apollo-server')


// schema
const typeDefs = gql`

type Query {
    sessions(
    title: String
    room: String
    ): [Session]
    sessionById(id: ID!): Session,
    speakers: [Speaker]
    speakerById(id: ID!): Speaker
}

type Mutation{
    addNewSession(session: SessionInput): Session
    toggleFavoriteSession(id: ID!): Session
    deleteSession(id: ID!): Boolean
}

input SessionInput {
    title: String!
    description: String
    startsAt: String
    endsAt: String
    room: String
    day: String
    format: String
    track: String
    level: String
}

type Session {
    id: ID!
    title: String!
    description: String
    startsAt: String
    endsAt: String
    room: String
    day: String
    format: String
    track: String
    level: String,
    favorite: Boolean
    speakers: [Speaker]
}

type Speaker {
    id: ID!
    bio: String
    name: String
    sessions: [Session]
}

`

module.exports = typeDefs