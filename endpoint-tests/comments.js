const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

exports.commentsTests = describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("Status 204 - Returns no body when passed a valid comment_id", async () => {
            const output = await request(app).delete('/api/comments/10')
            expect(output.status).toBe(204)
            expect(output.body).toEqual({})
        })
        test("Status 204 - Item is removed from the DB", async () => {
            const output = await request(app).delete('/api/comments/11')
            expect(output.status).toBe(204)
            expect(output.body).toEqual({})
            const {body} = await request(app).get('/api/articles/3')
            expect(body.article.comment_count).toBe("0")
        })
        test("Status 404 - Returns error when requested ID is valid but does not exist in the DB", async () => {
            const output = await request(app).delete('/api/comments/1100')
            expect(output.status).toBe(404)
            expect(output.body.msg).toEqual("Requested data not found")
        })
        test("Status 400 - Returns error when requested ID is invalid", async () => {
            const output = await request(app).delete('/api/comments/banana')
            expect(output.status).toBe(400)
            expect(output.body.msg).toEqual("Invalid Request")
        })
    })
})