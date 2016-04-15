'use strict';

/* jslint browser: true */
/* ESLint browser: true */

(function() {
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsList = document.querySelector('.reviews-list');
  var reviewsTemplate = document.querySelector('#review-template');
  var reviewToClone;
  var showMoreBtn = document.querySelector('.reviews-controls-more');

  /** @type {Array.<Object>} */
  var reviews = [];

  /** @constant {string} */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /** @enum {number} */
  var Filter = {
    'ALL': 'all',
    'RECENT': 'reviews-recent',
    'GOOD': 'reviews-good',
    'BAD': 'reviews-bad',
    'POPULAR': 'reviews-popular'
  };

  /** @constant {number} */
  var PAGE_SIZE = 3;

  /** @type {number} */
  var pageNumber = 0;

  if ('content' in reviewsTemplate) {
    reviewToClone = reviewsTemplate.content.querySelector('.review');
  } else {
    reviewToClone = reviewsTemplate.querySelector('.review');
  }

  /**
 * @param {Object} data
 * @return {HTMLElement} rewiew
 */
  var getReviewsElement = function(data) {
    var review = reviewToClone.cloneNode(true);
    var reviewText = review.querySelector('.review-text');
    var reviewRating = review.querySelector('.review-rating');
    var reviewImg = review.querySelector('.review-author');

    reviewRating.style.display = 'inline-block';
    for(var i = 0; i < data.rating - 1; i++) {
      reviewRating.parentNode.insertBefore(reviewRating.cloneNode(true), reviewRating.nextSibling);
    }
    reviewText.textContent = data.description;
    reviewsList.appendChild(review);

    /** @constant {number} IMG_TIMEOUT */
    var IMG_TIMEOUT = 10000;
    var img = new Image();
    var imgLoadTimeout;

    img.onload = function(evt) {
      clearTimeout(imgLoadTimeout);
      reviewImg.src = evt.target.src;
      reviewImg.width = 124;
      reviewImg.width = 124;
    };

    img.onerror = function() {
      reviewImg.classList.add('review-load-failure');
    };

    img.src = data.author.picture;

    imgLoadTimeout = setTimeout(function() {
      img.src = '';
      reviewImg.classList.add('review-load-failure');
    }, IMG_TIMEOUT);

    return review;
  };

  /** @param {function(Array.<Object>)} callback */
  var getReviews = function(callback) {
    var xhr = new XMLHttpRequest();

    /** @param {ProgressEvent} evt */
    xhr.onload = function(evt) {
      var requestObj = evt.target;
      var response = requestObj.response;
      var loadedData = JSON.parse(response);
      callback(loadedData);
    };

    xhr.error = function() {
      callback(true);
    };

    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      callback(true);
    };

    xhr.open('GET', REVIEWS_LOAD_URL);
    xhr.send();
  };

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

  var isNextPageAvailable = function() {
    return pageNumber < Math.floor(reviews.length / PAGE_SIZE);
  };

  var showHideMoreBtn = function() {
    if (isNextPageAvailable()) {
      showMoreBtn.classList.remove('invisible');
    } else {
      showMoreBtn.classList.add('invisible');
    }
  };

  var showNextPage = function() {
    showMoreBtn.addEventListener('click', function() {
      showHideMoreBtn();
      pageNumber++;
      renderReviews(reviews, pageNumber);
    });
  };

  /** @param {Array.<Object>} reviews */
  var renderReviews = function(reviewList, page, replace) {
    if (replace) {
      reviewsList.innerHTML = '';
    }

    showHideMoreBtn();

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    reviewList.slice(from, to).forEach(function(review) {
      getReviewsElement(review, reviewsList);
    });
  };

  /** @param {string} filter */
  var setFilterEnabled = function(filter) {
    reviews = getFilteredReviews(reviews, filter);
    pageNumber = 0;
    renderReviews(reviews, pageNumber, true);
  };

  var setFiltrationEnabled = function() {
    reviewsFilter.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('reviews-filter-item')) {
        setFilterEnabled(evt.target.getAttribute('for'));
      }
    });
  };

  reviewsFilter.classList.add('invisible');

  getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltrationEnabled();
    renderReviews(reviews, pageNumber);
    showNextPage();
  });

  reviewsFilter.classList.remove('invisible');
})();
