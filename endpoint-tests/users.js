const request = require("supertest");
const app = require("../app.js");

exports.userTests = describe("userTests", () => {
    describe("/api/users", () => {
        describe("GET", () => {
            test("Status 200 - returns an array of objects with the required keys", async () => {
                const {body} = await request(app).get('/api/users').expect(200)
                body.users.forEach((user) => {
                    expect(typeof user).toBe("object")
                    expect(user.hasOwnProperty("username")).toBe(true)
                    expect(user.hasOwnProperty("name")).toBe(true)
                    expect(user.hasOwnProperty("avatar_url")).toBe(true)
                })
            })
            test("Status 200 - returns the correct amount of user objects back", async () => {
                const {body} = await request(app).get('/api/users').expect(200)
                expect(body.users.length).toBe(4)
            })
        })
        describe("POST", () => {
            test("Status 201 - responds with created", async () => {
                const newUser = {username: "test username", avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", name:"test name"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(201)
                expect(body.user.hasOwnProperty("username")).toBe(true)
                expect(body.user.hasOwnProperty("avatar_url")).toBe(true)
                expect(body.user.hasOwnProperty("name")).toBe(true)
            })
            test("Status 201 - New user is added to the db", async () => {
                const newUser = {username: "lewisp", avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", name:"lewis"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(201)

                const output = await request(app).get('/api/users/lewisp')
                expect(output.status).toBe(200)
                expect(output.body.user.name).toBe("lewis")
            })
            test("Status 400 - error when post request is missing a username property", async () => {
                const newUser = {avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", name:"lewis"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(400)
                expect(body.msg).toBe("Invalid Request")
            })
            test("Status 400 - error when post request is missing a avatar_url property", async () => {
                const newUser = {username: "steve", name:"lewis"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(400)
                expect(body.msg).toBe("Invalid Request")
            })
            test("Status 400 - error when post request is missing a name property", async () => {
                const newUser = {username: "steve", avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(400)
                expect(body.msg).toBe("Invalid Request")
            })
            test("Status 400 - when the username already exists in the db", async () => {
                const newUser = {username: "lewisp", avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", name:"lewis"}
                const {status, body} = await request(app).post("/api/users").send(newUser)
                expect(status).toBe(400)
                expect(body.msg).toBe("Invalid Request")
            })
        })
    })
    
    describe("/api/users/:username", () => {
        describe("GET", () => {
            test("Status 200 - returns a user object containing a username, avatar_url & name", async () =>{
                const output = await request(app).get('/api/users/rogersop')
                expect(output.status).toBe(200)
                expect(output.body.user.hasOwnProperty("username")).toBe(true)
                expect(output.body.user.username).toBe("rogersop")
                expect(output.body.user.hasOwnProperty("avatar_url")).toBe(true)
                expect(output.body.user.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24394918?s=400&v=4")
                expect(output.body.user.hasOwnProperty("name")).toBe(true)
                expect(output.body.user.name).toBe("paul")
            })
            test("Status 404 - returns a 'data not found' msg when passed a username that does not exist in the DB", async () => {
                const output = await request(app).get('/api/users/lewis')
                expect(output.status).toBe(404)
                expect(output.body.msg).toBe("Requested data not found")
            })
            test("Status 404 - returns a 'data not found' msg when passed a number as username", async () => {
                const output = await request(app).get('/api/users/101')
                expect(output.status).toBe(404)
                expect(output.body.msg).toBe("Requested data not found")
            })
        })
        describe("PATCH", () => {
            test("Status 200 - returns a user object", async () => {
                const userUpdate = {avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                const {status, body} = await request(app).patch("/api/users/icellusedkars").send(userUpdate)
                expect(status).toBe(200)
                expect(body.user.hasOwnProperty("username")).toBe(true)
                expect(body.user.hasOwnProperty("name")).toBe(true)
                expect(body.user.hasOwnProperty("avatar_url")).toBe(true)
            })
            test("Status 200 - item is updated in the db", async () => {
                const userUpdate = {avatar_url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                const {status, body} = await request(app).patch("/api/users/rogersop").send(userUpdate)
                expect(status).toBe(200)
                expect(body.user.avatar_url).toBe("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
            })
            test("Status 400 - when passed a body with no avatar_url", async () => {
                const userUpdate = {}
                const {status, body} = await request(app).patch("/api/users/icellusedkars").send(userUpdate)
                expect(status).toBe(400)
                expect(body).toEqual({msg:"Invalid Request"})
            })
        })
    })
})