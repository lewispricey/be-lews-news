const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpointJSON = require("../endpoints.json")
 
exports.apiEndpoint = describe("articlesTests", () => {
    test("Status 200 - Responds with a JSON containing details on all endpoints", async () => {
        const output = await request(app).get('/api')
        expect(output.status).toBe(200)
        expect(output.body.endpoints).toEqual(endpointJSON)
    })
})