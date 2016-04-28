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
  var self = this;
  this.picturesSrc = [];
  this.pictureNumber = 1;


  this.getSrcArray = function() {
    for (var i = 0; i < picturesList.length; i++) {
      this.picturesSrc.push(picturesList[i].getAttribute('src'));
      picturesList[i].id = i + 1;
    }
  };


  this.createGallery = function() {
    self.getSrcArray();
    this.currentPicture = picturesContainer.appendChild(new Image());
    picturesSum.textContent = picturesList.length;
  };


  /** @param {Number} pictureNumb */
  this.showGallery = function(pictureNumb) {
    self.currentPicture.src = self.picturesSrc[pictureNumb - 1];
    currentPictureNumber.textContent = pictureNumb;
    self.pictureNumber = pictureNumb - 1;

    self.setBtnDisabled();

    utilities.showElem(galleryOverlay);

    btnNext.addEventListener('click', self._onNextClick);
    btnPrev.addEventListener('click', self._onPrevClick);
    btnClose.addEventListener('click', self._onCloseClick);
    window.addEventListener('keydown', self._onDocumentKeyDown);
  };


  /** @param {MouseEvent} evt */
  this.onGalleryClick = function(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
      self.pictureNumber = evt.target.id;
      self.showGallery(self.pictureNumber);
    }
  };


  this.setBtnDisabled = function() {
    btnNext.classList.toggle('overlay-gallery-control-disabled', self.pictureNumber >= self.picturesSrc.length - 1);
    btnPrev.classList.toggle('overlay-gallery-control-disabled', self.pictureNumber <= 0);
  };


  /** @param {MouseEvent} evt */
  this._onNextClick = function(evt) {
    evt.preventDefault();
    self.showNext();
  };


  /** @param {MouseEvent} evt */
  this._onPrevClick = function(evt) {
    evt.preventDefault();
    self.showPrev();
  };


  this.showNext = function() {
    self.pictureNumber++;
    if(self.pictureNumber < self.picturesSrc.length) {
      self.currentPicture.src = self.picturesSrc[self.pictureNumber];
      currentPictureNumber.textContent = self.pictureNumber + 1;
    }
    self.setBtnDisabled();
  };


  this.showPrev = function() {
    self.pictureNumber--;
    if(self.pictureNumber > -1) {
      self.currentPicture.src = self.picturesSrc[self.pictureNumber];
      currentPictureNumber.textContent = self.pictureNumber + 1;
    }
    self.setBtnDisabled();
  };


  this.closeGallery = function() {
    utilities.hideElem(galleryOverlay);
    btnNext.removeEventListener('click', self._onNextClick);
    btnPrev.removeEventListener('click', self._onPrevClick);
    btnClose.removeEventListener('click', self._onCloseClick);
    window.removeEventListener('keydown', self._onDocumentKeyDown);
  };


  this._onDocumentKeyDown = function(evt) {
    evt.preventDefault();
    switch (evt.keyCode) {
      case utilities.KeyCode.ESC:
        self.closeGallery();
        break;
      case utilities.KeyCode.RIGHT:
        self.showNext();
        break;
      case utilities.KeyCode.LEFT:
        self.showPrev();
        break;
      default:
        break;
    }
  };


  /** @param {MouseEvent} evt */
  this._onCloseClick = function(evt) {
    evt.preventDefault();
    self.closeGallery();
  };


  this.createGallery();
};

module.exports = new Gallery();
