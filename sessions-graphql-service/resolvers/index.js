
const sessions = require('../data/sessions.json')
const _ = require('lodash')
const fetch = require('node-fetch')



module.exports = {

    Query: {
        sessions: (parent, args, { dataSources }, info) => {
            //console.log(args);
            return _.filter(sessions, args)
        },
        sessionById: (parent, { id }, { dataSources }, info) => {
            return _.filter(sessions, { id: parseInt(id) })[0]
        },
        speakers: async (parent, args, { dataSources }, info) => {
            const response = await fetch(`http://localhost:8080/api/v1/speakers`)
            const speakers = await response.json()
            return speakers;
        },
        speakerById: async (parent, { id }, { dataSources }, info) => {
            const response = await fetch(`http://localhost:8080/api/v1/speakers/${id}`)
            const speaker = await response.json()
            return speaker;
        }
    },
    Mutation: {
        addNewSession: (parent, { session }, { dataSources }, info) => {
            session.id = 12345;
            sessions.push(session); // this is just an in-memory store
            return session;
        },
        toggleFavoriteSession: (parent, { id }, { dataSources }, info) => {
            const session = _.filter(sessions, { id: parseInt(id) })[0]
            session.favorite = !session.favorite
            return session
        },
        deleteSession: (parent, { id }, { dataSources }, info) => {
            const sessionIndex = _.findIndex(sessions, { id: parseInt(id) })
            if (sessionIndex === -1) {
                throw new Error(`Couldn't find session with id ${id}`)
            }
            sessions.splice(sessionIndex, 1)
            return true
        }
    },
    Speaker: {
        sessions: (speaker, args, { dataSources }, info) => {
            return sessions.filter(session => {
                return _.filter(session.speakers, { id: speaker.id }).length > 0
            })
        }
    },
    Session: {
        speakers: async (parent, args, { dataSources }, info) => {
            const response = await fetch(`http://localhost:8080/api/v1/speakers`)
            const speakers = await response.json()
            const returns = speakers.filter((speaker) => {
                return _.filter(parent.speakers, { id: speaker.id }).length > 0;
            });
            return returns;
        }
    },
}