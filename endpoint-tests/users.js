const request = require("supertest");
const app = require("../app.js");

exports.userTests = describe("/api/users", () => {
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
