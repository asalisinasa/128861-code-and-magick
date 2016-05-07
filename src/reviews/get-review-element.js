/** @fileoverview Шаблон отзыва и функция его отрисовки*/


'use strict';



/** @constant {number} IMG_TIMEOUT */
var IMG_TIMEOUT = 10000;

var reviewsTemplate = document.querySelector('#review-template');
var reviewToClone;


if ('content' in reviewsTemplate) {
  reviewToClone = reviewsTemplate.content.querySelector('.review');
} else {
  reviewToClone = reviewsTemplate.querySelector('.review');
}


/**
* @param {Object} data
* @param {HTMLElement} container
* @return {HTMLElement} rewiew
*/
var getReviewsElement = function(data, container) {
  var review = reviewToClone.cloneNode(true);
  var reviewText = review.querySelector('.review-text');
  var reviewRating = review.querySelector('.review-rating');
  var reviewImg = review.querySelector('.review-author');

  reviewRating.style.display = 'inline-block';
  for(var i = 0; i < data.rating - 1; i++) {
    reviewRating.parentNode.insertBefore(reviewRating.cloneNode(true), reviewRating.nextSibling);
  }
  reviewText.textContent = data.description;
  container.appendChild(review);

  var img = new Image();
  var imgLoadTimeout;

  /** @param {ProgressEvent} evt */
  img.onload = function(evt) {
    clearTimeout(imgLoadTimeout);
    reviewImg.src = evt.target.src;
    reviewImg.width = 124;
    reviewImg.width = 124;
  };

  img.onerror = function() {
    review.classList.add('review-load-failure');
  };

  img.src = data.author.picture;

  imgLoadTimeout = setTimeout(function() {
    img.src = '';
    review.classList.add('review-load-failure');
  }, IMG_TIMEOUT);

  return review;
};


module.exports = getReviewsElement;
