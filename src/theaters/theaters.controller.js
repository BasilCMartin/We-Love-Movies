const service = require("./theaters.service");

async function list(req, res, next) {
    res.json({ data: await service.list() })
}

module.exports = {
    list
}