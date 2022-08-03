const {articleTest} = require("../indTests/articles.exam")
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { topicsTests } = require("../indTests/topics.exam");
const { userTests } = require("../indTests/users.exam");

beforeAll(() => seedDB(data))
afterAll(() => db.end())
articleTest
topicsTests
userTests