const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeAll(() => seedDB(data))
afterAll(() => db.end())

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("STATUS:200 returns an object", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe("object")
            })
        })
        test("STATUS:200 return object contains the required keys", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                expect(body.hasOwnProperty("author")).toBe(true)
                expect(body.hasOwnProperty("title")).toBe(true)
                expect(body.hasOwnProperty("article_id")).toBe(true)
                expect(body.hasOwnProperty("body")).toBe(true)
                expect(body.hasOwnProperty("topic")).toBe(true)
                expect(body.hasOwnProperty("votes")).toBe(true)
            })
        })
        test("STATUS:200 returns the expected values when given 1 as the parameter", () => {
            const expectedOutput = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100
            }
            
            return request(app)
            .get('/api/articles/1')
            .then(({body}) => {
                expect(body).toEqual(expectedOutput)
            })
        })
        test("STATUS:404 when passed an articleID that does not exist in DB", () => {
            return request(app)
            .get('/api/articles/100')
            .expect(404)
        })
        test("STATUS:400 when passed an articleID of the wrong data type", () => {
            return request(app)
            .get('/api/articles/banana')
            .expect(400)
        })
    })
    describe("PATCH", () => {
        test("STATUS: 200 - responds with the updated article, votes increased when passed positive value", () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 1})
            .set('Accept', 'application/json')
            .expect(200)
            .then(({body}) => {
                expect(body.votes).toBe(101)
            })
        })
        test("STATUS: 200 - responds with the updated article, votes decreased when passed negative value", () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: -1})
            .set('Accept', 'application/json')
            .expect(200)
            .then(({body}) => {
                expect(body.votes).toBe(100)
            })
        })
        test("status: 400 - when not passed a inc_votes body", () => {
            return request(app)
            .patch('/api/articles/1')
            .send()
            .set('Accept', 'application/json')
            .expect(400)
        })
        test("status: 404 - when passed an invalid inc_votes charactor", () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: "cat"})
            .set('Accept', 'application/json')
            .expect(400)
        })
        test("status: 404 - when passed an article_id that does not exist", () => {
            return request(app)
            .patch('/api/articles/100')
            .send({inc_votes: 1})
            .set('Accept', 'application/json')
            .expect(404)
        })
    })
})

