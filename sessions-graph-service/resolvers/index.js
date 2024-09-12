
// const sessions = require('../data/sessions.json')
const _ = require('lodash')
const fetch = require('node-fetch')



module.exports = {

    Query: {
        sessions: (parent, args, context, info) => {
            //console.log(args);
            //return _.filter(sessions, args)
            let { sessionAPI } = context.dataSources;
            return sessionAPI.getSessions(args);
        },
        sessionById: (parent, { id }, context, info) => {
            // return _.filter(sessions, { id: parseInt(id) })[0]
            let { sessionAPI } = context.dataSources;
            return sessionAPI.getSessionById(id);
        },
        speakers: async (parent, args, context, info) => {
            // const response = await fetch(`http://localhost:8080/api/v1/speakers`)
            // const speakers = await response.json()
            // return speakers;
            let { speakerAPI } = context.dataSources;
            return speakerAPI.getSpeakers(args);
        },
        speakerById: async (parent, { id }, context, info) => {
            // const response = await fetch(`http://localhost:8080/api/v1/speakers/${id}`)
            // const speaker = await response.json()
            // return speaker;
            let { speakerAPI } = context.dataSources;
            return speakerAPI.getSpeakerById(id);
        }
    },
    Mutation: {
        addNewSession: (parent, { session }, context, info) => {
            // session.id = 12345;
            // sessions.push(session); // this is just an in-memory store
            // return session;
            let { sessionAPI } = context.dataSources;
            return sessionAPI.addSession(session);
        },
        toggleFavoriteSession: (parent, { id }, context, info) => {
            // const session = _.filter(sessions, { id: parseInt(id) })[0]
            // session.favorite = !session.favorite
            // return session
            let { sessionAPI } = context.dataSources;
            return sessionAPI.toggleFavoriteSession(id);
        },
        deleteSession: (parent, { id }, { dataSources }, info) => {
            // const sessionIndex = _.findIndex(sessions, { id: parseInt(id) })
            // if (sessionIndex === -1) {
            //     throw new Error(`Couldn't find session with id ${id}`)
            // }
            // sessions.splice(sessionIndex, 1)
            // return true
            let { sessionAPI } = dataSources;
            return sessionAPI.deleteSession(id);
        }
    },
    Speaker: {
        sessions: (speaker, args, context, info) => {
            // return sessions.filter(session => {
            //     return _.filter(session.speakers, { id: speaker.id }).length > 0
            // })
            let { sessionAPI } = context.dataSources;
            const sessions = sessionAPI.getSessions()
            return sessions.filter(session => {
                return _.filter(session.speakers, { id: speaker.id }).length > 0
            })
        }
    },
    Session: {
        speakers: async (parent, args, context, info) => {
            // const response = await fetch(`http://localhost:8080/api/v1/speakers`)
            // const speakers = await response.json()
            // const returns = speakers.filter((speaker) => {
            //     return _.filter(parent.speakers, { id: speaker.id }).length > 0;
            // });
            // return returns;
            let { speakerAPI } = context.dataSources;
            const speakers = await speakerAPI.getSpeakers();
            const returns = speakers.filter((speaker) => {
                return _.filter(session.speakers, { id: speaker.id }).length > 0;
            });
            return returns;
        }
    },
}