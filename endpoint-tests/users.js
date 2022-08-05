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
    })
})
