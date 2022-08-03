const service = require("./movies.service")
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

async function list(req, res, next) {

    let isShowing = req.query.is_showing
    if(isShowing) {
        res.json({data: await service.isShowingList()})
    } else 
    res.json({data: await service.list()})
}

async function read(req, res, next) {
    const movieId = req.params.movieId
res.json({data: await service.read(movieId)})
}

async function movieValidator(req, res, next) {
    const movie = await service.read(req.params.movieId)
    if(!movie) {
        return next({status: 404, message:"No such movie ID exists"})
    } 
   else next()
}

async function readMovieTheaters(req, res, next) {
    const movieId = req.params.movieId
    res.json({data: await service.readMovieTheaters(movieId)})
}

async function readMovieReviews(req, res, next) {
    const movieId = req.params.movieId
    res.json({data: await service.readMovieReviews(movieId)})
}

module.exports = {
    list,
    read:[asyncErrorBoundary(movieValidator), asyncErrorBoundary(read)],
    readMovieTheaters:[asyncErrorBoundary(movieValidator), asyncErrorBoundary(readMovieTheaters)],
    readMovieReviews:[asyncErrorBoundary(movieValidator), asyncErrorBoundary(readMovieReviews)]
}