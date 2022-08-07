const request = require("supertest");
const app = require("../app.js");

exports.articleTest = describe("articlesTests", () => {

    describe("/api/articles/:article_id", () => {

        describe("GET", () => {
            test("STATUS:200 returns an object", async () => {
                const {body} = await request(app).get('/api/articles/1').expect(200)
                expect(typeof body).toBe("object")
            })
            test("STATUS:200 return object contains the required keys", async () => {
                const {body} = await request(app).get('/api/articles/1').expect(200)
                expect(body.article.hasOwnProperty("author")).toBe(true)
                expect(body.article.hasOwnProperty("title")).toBe(true)
                expect(body.article.hasOwnProperty("article_id")).toBe(true)
                expect(body.article.hasOwnProperty("body")).toBe(true)
                expect(body.article.hasOwnProperty("topic")).toBe(true)
                expect(body.article.hasOwnProperty("votes")).toBe(true)
                expect(body.article.hasOwnProperty("comment_count")).toBe(true)
            })
            test("STATUS:200 returns the expected values when given 1 as the parameter", async () => {
                const expectedOutput = {article: {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'cats',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100
                }}

                const {body} = await request(app).get('/api/articles/1')
                expect(body.article.article_id).toEqual(expectedOutput.article.article_id)
                expect(body.article.title).toEqual(expectedOutput.article.title)
                expect(body.article.topic).toEqual(expectedOutput.article.topic)
                expect(body.article.author).toEqual(expectedOutput.article.author)
                expect(body.article.body).toEqual(expectedOutput.article.body)
                expect(body.article.created_at).toEqual(expectedOutput.article.created_at)
                expect(body.article.votes).toEqual(expectedOutput.article.votes)
            })
            test("STATUS:200 return the correct comment count", async () => {
                const {body} = await request(app).get('/api/articles/1')
                expect(body.article.comment_count).toBe("11")
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
        describe("POST", () => {
            test("Status 201 - returns the new article with all propertys from the db", async () => {
                const newArticle = {
                    "author": "lurker",
                    "title": "The top 5 pokemon explained",
                    "body": "This is content about the top 5 pokemon ever to exist! Yep thats right a whole artile on them",
                    "topic": "paper"
                }   
                const {status, body} = await request(app).post('/api/articles').send(newArticle)
                expect(status).toBe(201)
                expect(body.article.author).toBe("lurker")
                expect(body.article.title).toBe(newArticle.title)
                expect(body.article.body).toBe(newArticle.body)
                expect(body.article.topic).toBe(newArticle.topic)
                expect(body.article.hasOwnProperty("article_id")).toBe(true)
                expect(body.article.hasOwnProperty("votes")).toBe(true)
                expect(body.article.hasOwnProperty("created_at")).toBe(true)
                expect(body.article.hasOwnProperty("comment_count")).toBe(true)
            })
            test("Status 400 - returns an error if any property is missing from the request", async () => {
                const newArticle = {
                    "author": "lurker",
                    "body": "This is content about the top 5 pokemon ever to exist! Yep thats right a whole artile on them",
                    "topic": "paper"
                }   
                const {status, body} = await request(app).post('/api/articles').send(newArticle)
                expect(status).toBe(400)
                expect(body).toEqual({msg:"Invalid Request"})
                
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
                expect(output.body.article.comment_count).toBe("2")
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