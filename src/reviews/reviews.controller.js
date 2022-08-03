const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

async function reviewExists(req, res, next) {
   const review = await service.read(req.params.reviewId)
if (review) {
    res.locals.review = review
    return next();
}
return next({status:404, message: `Review cannot be found.`})

}

function propertyValidator(req, res, next) {
    const validProperties = [
        "review_id",
        "content",
        "score",
        "created_at",
        "updated_at",
        "critic_id",
        "movie_id",
        "critic"
    ]
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !validProperties.includes(field)
    );
  
    if (invalidFields.length > 1) {
      return next({
        status: 400,
        message: `Invalid fields: ${invalidFields.join(", ")}`,
      });
    }
    else if (invalidFields.length == 1) {
        return next({
            status: 400,
            message: `Invalid field: ${invalidFields}`,
          });
    }
    next();


}

async function destroy(req, res, next) {
    const {review} = res.locals
    await service.delete(review.review_id)
    res.sendStatus(204)
}

async function update(req,res,next) {
    const updatedReview = {
        ...req.body.data,
        review_id:req.params.reviewId
    }
    res.json({data:await service.update(updatedReview)})
}

module.exports = {
delete:[asyncErrorBoundary(reviewExists), destroy],
update:[asyncErrorBoundary(reviewExists), asyncErrorBoundary(propertyValidator), update]
};