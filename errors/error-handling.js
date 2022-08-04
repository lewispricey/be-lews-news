exports.customError = (err, req, res, next) => {
        if(err.status) res.status(err.status).send({msg: err.msg})
        next(err)
}

exports.standardError = (err, req, res, next) => {
    res.status(400).send({msg: "Invalid Request"})
}