/** @fileoverview Фильтрация списка отзывов */


'use strict';

/* jslint browser: true */
/* ESLint browser: true */


/** @enum {number} */
var Filter = {
  'ALL': 'all',
  'RECENT': 'reviews-recent',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad',
  'POPULAR': 'reviews-popular'
};


/**
 * @param {Array.<Object>} filteredReviews
 * @param {Filter} filter
 * @return {Array.<Object>}
 */
var getFilteredReviews = function(filteredReviews, filter) {
  var reviewsToFilter = filteredReviews.slice(0);
  var currentDate = new Date();
  var outsideDate = currentDate.setDate(currentDate.getDate() - 14);

  switch (filter) {
    case Filter.ALL:
      break;

    case Filter.RECENT:
      reviewsToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      return reviewsToFilter.filter(function(review) {
        return new Date(review.date) > outsideDate;
      });

    case Filter.GOOD:
      var goodReviews = reviewsToFilter.filter(function(review) {
        return review.rating > 2;
      });
      return goodReviews.sort(function(a, b) {
        return b.rating - a.rating;
      });

    case Filter.BAD:
      var badReviews = reviewsToFilter.filter(function(review) {
        return review.rating < 3;
      });
      return badReviews.sort(function(a, b) {
        return a.rating - b.rating;
      });

    case Filter.POPULAR:
      return reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
  }

  return reviewsToFilter;
};


module.exports = getFilteredReviews;
