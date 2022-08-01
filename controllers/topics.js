const { fetchTopics } = require("../models/topics")


exports.getTopics = (req, res, next) => {
    // console.log("in controller...")
    fetchTopics()
    .then((topics) => {
        // console.log(topics)
        res.status(200).send(topics)
    })
    .catch((err) => {
        res.status(500).send("server error...")
    }) 
}