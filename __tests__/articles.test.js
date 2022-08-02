const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const e = require("express");

beforeAll(() => seedDB(data))
afterAll(() => db.end())

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("STATUS:200 returns an object", async () => {
            const {body} = await request(app).get('/api/articles/1').expect(200)
            expect(typeof body).toBe("object")
        })
        test("STATUS:200 return object contains the required keys", async () => {
            const {body} = await request(app).get('/api/articles/1').expect(200)
            expect(body.hasOwnProperty("author")).toBe(true)
            expect(body.hasOwnProperty("title")).toBe(true)
            expect(body.hasOwnProperty("article_id")).toBe(true)
            expect(body.hasOwnProperty("body")).toBe(true)
            expect(body.hasOwnProperty("topic")).toBe(true)
            expect(body.hasOwnProperty("votes")).toBe(true)
            expect(body.hasOwnProperty("comment_count")).toBe(true)
        })
        test("STATUS:200 returns the expected values when given 1 as the parameter", async () => {
            const expectedOutput = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100
            }
            
            const {body} = await request(app).get('/api/articles/1')
            expect(body.article_id).toEqual(expectedOutput.article_id)
            expect(body.title).toEqual(expectedOutput.title)
            expect(body.topic).toEqual(expectedOutput.topic)
            expect(body.author).toEqual(expectedOutput.author)
            expect(body.body).toEqual(expectedOutput.body)
            expect(body.created_at).toEqual(expectedOutput.created_at)
            expect(body.votes).toEqual(expectedOutput.votes)
        })
        test("STATUS:200 return the correct comment count", async () => {
            const {body} = await request(app).get('/api/articles/1')
            expect(body.comment_count).toBe("11")
        })
        test("STATUS:404 when passed an articleID that does not exist in DB", async () => {
            const output = await request(app).get('/api/articles/100')
            expect(output.status).toBe(404)
        })
        test("STATUS:400 when passed an articleID of the wrong data type", async () => {
            const output = await request(app).get('/api/articles/banana')
            expect(output.status).toBe(400)
        })
    })
    describe("PATCH", () => {
        test("STATUS: 200 - responds with the updated article, votes increased when passed positive value", async () => {
            const expectedOutput = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 101
            }
    
            const output = await request(app).patch('/api/articles/1').send({inc_votes: 1})
            expect(output.status).toBe(200)
            expect(output.body).toEqual(expectedOutput)
        })
        test("STATUS: 200 - responds with the updated article, votes decreased when passed negative value", async () => {
            const expectedOutput = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 99
            }            
            const output = await request(app).patch('/api/articles/1').send({inc_votes: -2})
            expect(output.status).toBe(200)
            expect(output.body).toEqual(expectedOutput)
        })
        test("status: 400 - when not passed a inc_votes body", async () => {
            const output = await request(app).patch('/api/articles/1').send()
            expect(output.status).toBe(400)
            expect(output.body.msg).toEqual("invalid data type")
        })
        test("status: 400 - when passed an invalid inc_votes charactor", async () => {
            const output = await request(app).patch('/api/articles/1').send({inc_votes: "cat"})
            expect(output.status).toBe(400)
            expect(output.body.msg).toEqual("invalid data type")
        })
        test("status: 404 - when passed an article_id that does not exist", async () => {
            const output = await request(app).patch('/api/articles/100').send({inc_votes: 1})
            expect(output.status).toBe(404)
            expect(output.body.msg).toEqual("Requested ID not found")
        })
    })
})

describe("/api/articles", () => {
    describe("GET", () => {
        test("Status 200 - returns the correct number of article objects", async () => {
            const output = await request(app).get('/api/articles')
            expect(output.status).toBe(200)
            expect(output.body.articles.length).toBe(12)
        })
        test("Status 200 - return objects contain the expected propertys", async () => {
            const output = await request(app).get('/api/articles')
            const rtnArticles = output.body.articles
            rtnArticles.forEach((article) => {
                expect(article.hasOwnProperty("article_id")).toBe(true)
                expect(article.hasOwnProperty("title")).toBe(true)
                expect(article.hasOwnProperty("topic")).toBe(true)
                expect(article.hasOwnProperty("author")).toBe(true)
                expect(article.hasOwnProperty("body")).toBe(true)
                expect(article.hasOwnProperty("created_at")).toBe(true)
                expect(article.hasOwnProperty("comment_count")).toBe(true)
            })
        })
        test("Status 200 - return objects are sorted by newest date first", async () => {
            const output = await request(app).get('/api/articles')
            const rtnArticles = output.body.articles
            const idOrder = rtnArticles.map((article) => article.article_id)
            expect(idOrder).toEqual([3, 6,  2, 12, 5, 1, 9, 10, 4, 8, 11, 7])
        })
    })
})