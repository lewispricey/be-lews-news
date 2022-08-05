const request = require("supertest");
const app = require("../app.js");
const endpointJSON = require("../endpoints.json")
 
exports.apiEndpoint = describe("articlesTests", () => {
    test("Status 200 - Responds with a JSON containing details on all endpoints", async () => {
        const output = await request(app).get('/api')
        expect(output.status).toBe(200)
        expect(output.body.endpoints).toEqual(endpointJSON)
    })
})