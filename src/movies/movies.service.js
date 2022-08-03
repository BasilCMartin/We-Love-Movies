const knex = require("../db/connection")
const mapProperties = require('../utils/map-properties')

const addCritic = mapProperties({
    critic_id:"critic.critic_id",
    preferred_name:"critic.preferred_name",
    surname:"critic.surname",
    organization_name:"critic.organization_name",
    created_at:"critic.created_at",
    updated_at:"critic.updated_at"
})

function list() {
    return knex("movies").select("*").groupBy("movies.movie_id")
}

function isShowingList() {
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({"mt.is_showing": true})
    .groupBy("m.movie_id")
}

function read(movie_id) {
    return knex("movies")
    .select("*")
    .where({movie_id})
    .first()
}

function readMovieTheaters(movie_id) {
    return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("mt.*", "t.*")
    .where({"mt.movie_id": movie_id})
}

function readMovieReviews(movie_id) {
    return knex("reviews as r")
    .join("critics as c", "r.critic_id","c.critic_id")
    .select("r.*", "c.*")
    .where({"r.movie_id": movie_id})
    .then((reviews)=> {
        return reviews.map((review=>
            addCritic(review)))
    })
}
module.exports = {
    list,
    isShowingList,
    read,
    readMovieTheaters,
    readMovieReviews
}