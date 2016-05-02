/** @fileoverview Поведение элемента галереи */


'use strict';

/* jslint browser: true */
/* ESLint browser: true */


var utilities = require('../utilities');

var galleryOverlay = document.querySelector('.overlay-gallery');
var galleryElement = document.querySelector('.photogallery');
var picturesContainer = galleryOverlay.querySelector('.overlay-gallery-preview');
var currentPictureNumber = galleryOverlay.querySelector('.preview-number-current');
var picturesSum = galleryOverlay.querySelector('.preview-number-total');
var btnNext = galleryOverlay.querySelector('.overlay-gallery-control-right');
var btnPrev = galleryOverlay.querySelector('.overlay-gallery-control-left');
var btnClose = galleryOverlay.querySelector('.overlay-gallery-close');

/** @type {Array.<Object>} */
var picturesList = galleryElement.getElementsByTagName('IMG');


/** @constructor */
var Gallery = function() {
  this.picturesSrc = [];
  this.pictureNumber = 1;

  this._onGalleryClick = this._onGalleryClick.bind(this);
  this._onNextClick = this._onNextClick.bind(this);
  this._onPrevClick = this._onPrevClick.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this._onCloseClick = this._onCloseClick.bind(this);

  this._createGallery();
  this._onHashChange();
  window.addEventListener('hashchange', this._onHashChange.bind(this));
};


Gallery.prototype.getSrcArray = function() {
  this.picturesSrc = Array.prototype.map.call(picturesList, function(picture) {
    return picture.getAttribute('src');
  });
};


Gallery.prototype._createGallery = function() {
  this.getSrcArray();
  this.currentPicture = picturesContainer.appendChild(new Image());
  picturesSum.textContent = picturesList.length;
};


Gallery.prototype.changePicture = function(pictureNumb) {
  this.pictureNumber = pictureNumb;
  this.currentPicture.src = this.picturesSrc[this.pictureNumber - 1];
  currentPictureNumber.textContent = this.pictureNumber;
  this.setBtnDisabled();
};


/** @param {String} url */
Gallery.prototype.changeURL = function(url) {
  var pictureUrl;

  if(url) {
    pictureUrl = '#photo/' + url;
    location.hash = pictureUrl;
  } else {
    window.location.hash = '';
  }
};


Gallery.prototype.setBtnDisabled = function() {
  btnNext.classList.toggle('overlay-gallery-control-disabled', this.pictureNumber >= this.picturesSrc.length);
  btnPrev.classList.toggle('overlay-gallery-control-disabled', this.pictureNumber <= 1);
};


/** @param {Number} pictureNumb */
Gallery.prototype.showGallery = function(picture) {
  this.changePicture(picture);

  utilities.showElem(galleryOverlay);

  btnNext.addEventListener('click', this._onNextClick);
  btnPrev.addEventListener('click', this._onPrevClick);
  btnClose.addEventListener('click', this._onCloseClick);
  window.addEventListener('keydown', this._onDocumentKeyDown);
};


/** @param {MouseEvent} evt */
Gallery.prototype._onGalleryClick = function(evt) {
  evt.preventDefault();
  if (evt.target.tagName === 'IMG') {
    this.changeURL(evt.target.getAttribute('src'));
    this.pictureNumber = +evt.target.id;
  }
};


Gallery.prototype._onHashChange = function() {
  var PICTURE_REG_EXP = new RegExp(/#photo\/(\S+)/);
  var checkHash = location.hash.match(PICTURE_REG_EXP);

  if (checkHash) {
    this.pictureNumber = this.picturesSrc.indexOf(checkHash[1]) + 1;
    this.showGallery(this.pictureNumber);
  } else {
    this.closeGallery();
  }
};


/** @param {MouseEvent} evt */
Gallery.prototype._onNextClick = function(evt) {
  evt.preventDefault();
  this.showNext();
};


/** @param {MouseEvent} evt */
Gallery.prototype._onPrevClick = function(evt) {
  evt.preventDefault();
  this.showPrev();
};


Gallery.prototype.showNext = function() {
  this.pictureNumber++;
  if(this.pictureNumber < this.picturesSrc.length + 1) {
    this.changeURL(this.picturesSrc[this.pictureNumber - 1]);
  }
  this.setBtnDisabled();
};


Gallery.prototype.showPrev = function() {
  this.pictureNumber--;
  if(this.pictureNumber > -1) {
    this.changeURL(this.picturesSrc[this.pictureNumber - 1]);
  }
  this.setBtnDisabled();
};


Gallery.prototype.closeGallery = function() {
  history.pushState(null, null, window.location.pathname);

  utilities.hideElem(galleryOverlay);

  btnNext.removeEventListener('click', this._onNextClick);
  btnPrev.removeEventListener('click', this._onPrevClick);
  btnClose.removeEventListener('click', this._onCloseClick);
  window.removeEventListener('keydown', this._onDocumentKeyDown);
};


/** @param {KeyboardEvent} evt */
Gallery.prototype._onDocumentKeyDown = function(evt) {
  evt.preventDefault();
  switch (evt.keyCode) {
    case utilities.KeyCode.ESC:
      this.changeURL();
      break;
    case utilities.KeyCode.RIGHT:
      this.showNext();
      break;
    case utilities.KeyCode.LEFT:
      this.showPrev();
      break;
    default:
      break;
  }
};


/** @param {MouseEvent} evt */
Gallery.prototype._onCloseClick = function(evt) {
  evt.preventDefault();
  this.changeURL();
};


module.exports = new Gallery();
