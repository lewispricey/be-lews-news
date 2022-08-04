const { fetchEndpoints } = require("../models/api")

exports.getApi = (req, res, next) => {
    fetchEndpoints()
    .then((endpointData) => res.status(200).send({endpoints: endpointData}))
    .catch((err) => next(err))
}