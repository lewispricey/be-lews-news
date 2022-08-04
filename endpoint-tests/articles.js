const request = require("supertest");
const app = require("../app.js");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
 
exports.articleTest = describe("articlesTests", () => {
    
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
                    topic: 'cats',
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
                    topic: 'cats',
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
                    topic: 'cats',
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
                expect(output.body.msg).toEqual("Invalid Request")
            })
            test("status: 400 - when passed an invalid inc_votes charactor", async () => {
                const output = await request(app).patch('/api/articles/1').send({inc_votes: "cat"})
                expect(output.status).toBe(400)
                expect(output.body.msg).toEqual("Invalid Request")
            })
            test("status: 404 - when passed an article_id that does not exist", async () => {
                const output = await request(app).patch('/api/articles/100').send({inc_votes: 1})
                expect(output.status).toBe(404)
                expect(output.body.msg).toEqual("Requested data not found")
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
                    expect(article.hasOwnProperty("created_at")).toBe(true)
                    expect(article.hasOwnProperty("comment_count")).toBe(true)
                })
            })
            test("Status 200 - return objects are sorted by newest date first when not passed a sort or order query", async () => {
                const output = await request(app).get('/api/articles')
                const rtnArticles = output.body.articles
                const idOrder = rtnArticles.map((article) => article.article_id)
                expect(idOrder).toEqual([3, 6,  2, 12, 5, 1, 9, 10, 4, 8, 11, 7])
            })
            test("Status 200 - returns objects sorted oldest first when passed a order=asc query", async () => {
                const output = await request(app).get('/api/articles?order=asc')
                expect(output.status).toBe(200)
                const rtnArticles = output.body.articles
                const idOrder = rtnArticles.map((article) => article.article_id)
                expect(idOrder).toEqual([7, 11, 8, 4, 10, 9, 1, 5, 12,  2, 6, 3])
            })
            test("Status 200 - returns objects sorted by the passed sort_by query", async () => {
                const output = await request(app).get('/api/articles?sort_by=article_id')
                expect(output.status).toBe(200)
                const rtnArticles = output.body.articles
                const idOrder = rtnArticles.map((article) => article.article_id)
                expect(idOrder).toEqual([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
            })
            test("Status 200 - returns articles with the requested topic when passed topic as an optional query", async () =>{
                const output = await request(app).get('/api/articles?topic=cats')
                expect(output.status).toBe(200)
                const rtnArticles = output.body.articles
                const idOrder = rtnArticles.map((article) => article.article_id)
                expect(idOrder).toEqual([5, 1])
            })
            test("Status 400 - returns error when passed an order that isnt asc or desc", async () =>{
                const output = await request(app).get('/api/articles?order=steve')
                expect(output.status).toBe(400)
                expect(output.body.msg).toBe("Invalid Request")
            })
            test("Status 400 - returns error when passed a sort_by query thats column doesnt exist in the db", async () =>{
                const output = await request(app).get('/api/articles?sort_by=phil')
                expect(output.status).toBe(400)
                expect(output.body.msg).toBe("Invalid Request")
            })
            test("Status 404 - returns error when passed a topic query that doesnt match any results", async () =>{
                const output = await request(app).get('/api/articles?topic=david')
                expect(output.status).toBe(404)
                expect(output.body.msg).toBe("Requested data not found")
            })
        })
    })
    
    describe("/api/articles/:article_id/comments", () => {
        
        describe("GET", () => {
            test("Status 200 - returns the correct number of comment objects", async () => {
                const output = await request(app).get('/api/articles/1/comments')
                expect(output.status).toBe(200)
                expect(output.body.comments.length).toBe(11)
            })
            test("Status 200 - returned comment objects contain the expected keys", async () => {
                const output = await request(app).get('/api/articles/1/comments')
                const comments = output.body.comments
                comments.forEach((comment) => {
                    expect(output.status).toBe(200)
                    expect(comment.hasOwnProperty("comment_id")).toBe(true)
                    expect(comment.hasOwnProperty("votes")).toBe(true)
                    expect(comment.hasOwnProperty("created_at")).toBe(true)
                    expect(comment.hasOwnProperty("author")).toBe(true)
                    expect(comment.hasOwnProperty("body")).toBe(true)
                })
            })
            test("Status 200 - returns an empty array when the article exists but there are no comments", async () => {
                const output = await request(app).get('/api/articles/2/comments')
                expect(output.body.comments).toEqual([])
            })
            test("Status 400 - returns error when passed an ID that is not a number", async () => {
                const output = await request(app).get('/api/articles/banana/comments')
                expect(output.status).toBe(400)
                expect(output.body.msg).toEqual("Invalid Request")
            })
            test("Status 404 - returns error when passed an ID that doesn't exist in the db", async () => {
                const output = await request(app).get('/api/articles/100/comments')
                expect(output.status).toBe(404)
                expect(output.body.msg).toEqual("Requested data not found")
            })
        })
        
        describe("POST", () => {
            test("STATUS 201 - Responds with the expected body & username in the response object", async () => {
                const newComment = {username: "rogersop", body: "this is a test comment from Jest"}
                const output = await request(app).post("/api/articles/2/comments").send(newComment)
                const rtnComment = output.body.newComment
                expect(output.status).toBe(201)
                expect(rtnComment.author).toBe("rogersop")
                expect(rtnComment.body).toBe("this is a test comment from Jest")            
            })
            test("STATUS 201 - Response object contains a comment_id & created_at property", async () => {
                const newComment = {username: "rogersop", body: "this is another test comment would you belive it!"}
                const output = await request(app).post("/api/articles/2/comments").send(newComment)
                const rtnComment = output.body.newComment
                expect(output.status).toBe(201)
                expect(rtnComment.hasOwnProperty("comment_id")).toBe(true)
                expect(rtnComment.hasOwnProperty("created_at")).toBe(true)
                expect(rtnComment.body).toBe("this is another test comment would you belive it!") 
            })
            test("STATUS 200 - the two new comments exist in the DB and are linked to the correct article", async () => {
                const output = await request(app).get("/api/articles/2")
                expect(output.body.comment_count).toBe("2")
            })
            test("Status 400 - when the post request is missing a username", async () => {
                const newComment = {body: "this comment is a fail!"}
                const output = await request(app).post("/api/articles/2/comments").send(newComment)
                expect(output.status).toBe(400)
                expect(output.body.msg).toBe("Invalid Request")
            })
            test("Status 404 - when the post request contains a username not currently in the DB", async () => {
                const newComment = {username: "notAUser", body: "this comment is a fail!"}
                const output = await request(app).post("/api/articles/2/comments").send(newComment)
                expect(output.status).toBe(404)
                expect(output.body.msg).toBe("Requested data not found")
            })
            test("Status 400 - when the post request is missing a body/comment", async () => {
                const newComment = {username: "rogersop"}
                const output = await request(app).post("/api/articles/2/comments").send(newComment)
                expect(output.status).toBe(400)
                expect(output.body.msg).toBe("Invalid Request")
            })
            test("Status 404 - when passed an article_id parameter that doesn't exist", async () => {
                const newComment = {username: "rogersop", body: "this comment is a fail!"}
                const output = await request(app).post("/api/articles/100/comments").send(newComment)
                expect(output.status).toBe(404)
                expect(output.body.msg).toBe("Requested data not found")
            })
        })
    })
})