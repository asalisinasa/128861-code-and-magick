/** @fileoverview Загрузка, фильтрация и постраничная отрисовка отзывов  */


'use strict';

/* jslint browser: true */
/* ESLint browser: true */


var Review = require('./review');
var getReviewsElement = require('./get-review-element');
var getFilteredReviews = require('./filter');
var utilities = require('../utilities');

var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsContainer = document.querySelector('.reviews-list');
var moreBtn = document.querySelector('.reviews-controls-more');

/** @type {Array.<Object>} */
var reviews = [];

/** @type {Array.<Object>} */
var reviewsToRender = [];

/** @type {Array.<Review>} */
var renderedReviews = [];

/** @constant {string} */
var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

/** @constant {number} */
var PAGE_SIZE = 3;

/** @type {number} */
var pageNumber = 0;



/**
* @param {Object} reviewList
* @param {Number} page
* @param {Boolean} replace
*/
var renderReviews = function(reviewList, page, replace) {
  if (replace) {
    renderedReviews.forEach(function(review) {
      review.remove();
    });
    renderedReviews = [];
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  reviewList.slice(from, to).forEach(function(review) {
    renderedReviews.push(new Review(review, reviewsContainer));
  });

  showHideMoreBtn();
};


var isNextPageAvailable = function() {
  return pageNumber < Math.floor(reviewsToRender.length / PAGE_SIZE);
};


var showHideMoreBtn = function() {
  if (isNextPageAvailable()) {
    utilities.showElem(moreBtn);
  } else {
    utilities.hideElem(moreBtn);
  }
};


var showNextPage = function() {
  moreBtn.addEventListener('click', function() {
    showHideMoreBtn();
    pageNumber++;
    renderReviews(reviewsToRender, pageNumber, false);
  });
};


/** @param {string} filter */
var setFilterEnabled = function(filter) {
  reviewsToRender = getFilteredReviews(reviews, filter);
  showHideMoreBtn();
  pageNumber = 0;
  renderReviews(reviewsToRender, pageNumber, true);
};


var setFiltrationEnabled = function() {
  reviewsFilter.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('reviews-filter-item')) {
      setFilterEnabled(evt.target.getAttribute('for'));
    }
  });
};


utilities.hideElem(reviewsFilter);

utilities.getData(function(loadedReviews) {
  reviews = loadedReviews;
  reviewsToRender = reviews;
  renderReviews(reviews, pageNumber, true);
  setFiltrationEnabled();
  showNextPage();
}, REVIEWS_LOAD_URL);

utilities.showElem(reviewsFilter);


module.exports = getReviewsElement;
