const request = require("supertest");
const app = require("../app.js");

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
    describe("PATCH", () => {
        test("Status 200 - Returns the comment with the likes increased when passed a positive number", async () => {
            const output = await request(app).patch('/api/comments/1').send({"inc_votes": 1})
            expect(output.status).toBe(200)
            expect(output.body.hasOwnProperty("comment")).toBe(true)
            expect(output.body.comment.votes).toBe(17)
        })
        test("Status 200 - Returns the comment with the likes decreased when passsed a negitive number", async () => {
            const output = await request(app).patch('/api/comments/1').send({"inc_votes": -1})
            expect(output.status).toBe(200)
            expect(output.body.hasOwnProperty("comment")).toBe(true)
            expect(output.body.comment.votes).toBe(16)
        })
        test("Status 400 - Returns invalid request when passed an invalid comment id", async () => {
            const output = await request(app).patch('/api/comments/steve').send({"inc_votes": -1})
            expect(output.status).toBe(400)
            expect(output.body.msg).toBe("Invalid Request")
        })
        test("Status 400 - Returns invalid request when passed an invalid body", async () => {
            const output = await request(app).patch('/api/comments/1').send({"inc_votes": "phil"})
            expect(output.status).toBe(400)
            expect(output.body.msg).toBe("Invalid Request")
        })
        test("Status 404 - Returns not found when passed a comment ID that does not exist", async () => {
            const output = await request(app).patch('/api/comments/1000').send({"inc_votes": 1})
            expect(output.status).toBe(404)
            expect(output.body.msg).toBe("Requested data not found")
        })
        
    })
    
})