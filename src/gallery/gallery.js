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
  var pictureUrl;
  this.picturesSrc = [];


  this.getSrcArray = function() {
    for (var i = 0; i < picturesList.length; i++) {
      self.picturesSrc.push(picturesList[i].getAttribute('src'));
      picturesList[i].id = i + 1;
    }
  };


  this.createGallery = function() {
    self.getSrcArray();
    this.currentPicture = picturesContainer.appendChild(new Image());
    picturesSum.textContent = picturesList.length;
  };


  this.changePicture = function(pictureNumb) {
    self.pictureNumber = pictureNumb;
    self.currentPicture.src = self.picturesSrc[self.pictureNumber - 1];
    currentPictureNumber.textContent = self.pictureNumber;
    self.setBtnDisabled();
  };

  this.changeURL = function(url) {
    if(url) {
      pictureUrl = '#photo/' + url;
      location.hash = pictureUrl;
    } else {
      window.location.hash = '';
    }
  };


  /** @param {Number} pictureNumb */
  this.showGallery = function(picture) {
    this.changePicture(picture);

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
      self.changeURL(evt.target.getAttribute('src'));
      self.pictureNumber = +evt.target.id;
    }
  };


  this._onHashChange = function() {
    var pictureRegExp = new RegExp(/#photo\/(\S+)/);
    var checkHash = location.hash.match(pictureRegExp);
    if (checkHash) {
      self.pictureNumber = self.picturesSrc.indexOf(checkHash[1]) + 1;
      self.showGallery(self.pictureNumber);
    } else {
      self.closeGallery();
    }
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
    if(self.pictureNumber < self.picturesSrc.length + 1) {
      self.changeURL(self.picturesSrc[self.pictureNumber - 1]);
    }
    self.setBtnDisabled();
  };


  this.showPrev = function() {
    self.pictureNumber--;
    if(self.pictureNumber > -1) {
      self.changeURL(self.picturesSrc[self.pictureNumber - 1]);
    }
    self.setBtnDisabled();
  };


  this.setBtnDisabled = function() {
    btnNext.classList.toggle('overlay-gallery-control-disabled', self.pictureNumber >= self.picturesSrc.length);
    btnPrev.classList.toggle('overlay-gallery-control-disabled', self.pictureNumber <= 1);
  };


  this.closeGallery = function() {
    history.pushState(null, null, window.location.pathname);

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
        self.changeURL();
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
    self.changeURL();
  };


  this.createGallery();
  this._onHashChange();
  window.addEventListener('hashchange', this._onHashChange);
};

module.exports = new Gallery();
