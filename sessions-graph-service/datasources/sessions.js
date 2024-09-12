const { DataSource } = require('apollo-datasource');

const sessions = require('../data/sessions.json')
const _ = require('lodash')


class SessionAPI extends DataSource {

    constructor() {
        super();
    }
    initialize(config) { }

    getSessions(args) {
        return _.filter(sessions, args);
    }

    getSessionById(id) {
        const session = _.filter(sessions, { id: parseInt(id) });
        return session[0]
    }

    addSession(session) {
        session.id = 12345
        sessions.push(session) // insert...
        return session
    }

    deleteSession(id) {
        const idx = sessions.findIndex(session => session.id === Number.parseInt(id))
        sessions.splice(idx, 1)
        return true
    }

    toggleFavoriteSession(id) {
        const session = _.filter(sessions, { id: parseInt(id) })[0];
        session.favorite = !session.favorite
        return session
    }


}

module.exports = SessionAPI