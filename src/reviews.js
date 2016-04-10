'use strict';

/* global reviews, document, Image, setTimeout, clearTimeout */

(function() {
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsList = document.querySelector('.reviews-list');
  var reviewsTemplate = document.querySelector('#review-template');
  var reviewToClone;

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


  reviewsFilter.classList.add('invisible');

  reviews.forEach(function(review) {
    getReviewsElement(review, reviewsList);
  });

  reviewsFilter.classList.remove('invisible');
})();
