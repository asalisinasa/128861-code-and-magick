/** @fileoverview Поведение элемента отзыва */


'use strict';



var utilities = require('../utilities');
var BaseComponent = require('../base-component');
var getReviewsElement = require('./get-review-element');


/**
* @param {Object} data
* @param {HTMLElement} container
* @constructor
*/
var Review = function(data, reviewsContainer) {
  BaseComponent.call(this, data, reviewsContainer);

  this.element = getReviewsElement(this.data, this.container);

  this.add();
  this.remove = this.remove.bind(this);
  this._onQuizClick = this._onQuizClick.bind(this);
};


utilities.inherit(BaseComponent, Review);


Review.prototype.add = function() {
  BaseComponent.prototype.add.call(this);
  this.element.addEventListener('click', this._onQuizClick);
};


Review.prototype._onQuizClick = function(evt) {
  evt.preventDefault();
  if (evt.target.classList.contains('review-quiz-answer')) {
    evt.target.classList.add('review-quiz-answer-active');
  }
};


Review.prototype.remove = function() {
  BaseComponent.prototype.remove.call(this);
  this.element.removeEventListener('click', this._onQuizClick);
};


module.exports = Review;
