const {articleTest} = require("../endpoint-tests/articles")
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const { topicsTests } = require("../endpoint-tests/topics");
const { userTests } = require("../endpoint-tests/users");
const { commentsTests } = require("../endpoint-tests/comments");

beforeAll(() => seedDB(data))
afterAll(() => db.end())
articleTest
topicsTests
userTests
commentsTests