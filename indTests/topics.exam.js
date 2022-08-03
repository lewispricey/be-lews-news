const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

// beforeAll(() => seedDB(data))
// afterAll(() => db.end())
exports.topicsTests = describe("topicTests", () => {
    describe("/api/topics", () => {
        describe("GET", () => {
            test("returns code 200 - OK", () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
            })
            test("returns an array", () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(Array.isArray(body)).toBe(true)
                })
            })
            test("returns the correct number of items from DB", () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(body.length).toBe(3)
                })
            })
            test("items are returned with the propertys slug & description", () => {
                return request(app)
                .get('/api/topics')
                .then(({body}) => {            
                    expect(body.map((topic) => {
                        return topic.hasOwnProperty("description") && topic.hasOwnProperty("slug")
                    })).toEqual([true, true, true])
                })
            })
        })
    })
})


