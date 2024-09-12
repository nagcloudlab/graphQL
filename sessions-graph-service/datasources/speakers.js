const { RESTDataSource } = require('apollo-datasource-rest');


class SpeakerAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = "http://localhost:8080/api/v1/speakers"
    }
    async getSpeakers() {
        const data = await this.get(`/`)
        return data;
    }

    async getSpeakerById(id) {
        const data = await this.get(`/${id}`)
        return data;
    }
}

module.exports = SpeakerAPI