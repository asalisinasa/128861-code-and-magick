/** @fileoverview Загрузка, фильтрация и постраничная отрисовка отзывов  */


'use strict';

/* jslint browser: true */
/* ESLint browser: true */


var Review = require('./review');
var getFilteredReviews = require('./filter');
var utilities = require('../utilities');

var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsFilterItem = reviewsFilter.elements['reviews'];
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

/** @type {string} */
var filterKey = 'filter';

/** @type {string} */
var currentFilter;


/**
* Постраничная отрисовка отзывов на странице
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


/** Фильтрация отзывов
* @param {string} filter
*/
var setFilterEnabled = function(filter) {
  reviewsToRender = getFilteredReviews(reviews, filter);
  pageNumber = 0;
  renderReviews(reviewsToRender, pageNumber, true);
  showHideMoreBtn();
  localStorage.setItem(filterKey, filter);
};


var setFiltrationEnabled = function() {
  reviewsFilter.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('reviews-filter-item')) {
      setFilterEnabled(evt.target.getAttribute('for'));
    }
  });
};


utilities.hideElem(reviewsFilter);


/** Загрузка отзывов
* @param {Array.<Object>} loadedReviews
*/
utilities.getData(function(loadedReviews) {
  reviews = loadedReviews;
  reviewsToRender = reviews;
  currentFilter = localStorage.getItem(filterKey);

  setFiltrationEnabled();

  if (localStorage.hasOwnProperty(filterKey)) {
    reviewsFilterItem.value = currentFilter;
    setFilterEnabled(currentFilter);
  }

  renderReviews(reviewsToRender, pageNumber, true);
  showNextPage();
}, REVIEWS_LOAD_URL);


utilities.showElem(reviewsFilter);
