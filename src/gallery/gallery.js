/** @fileoverview Отрисовывка и открытие галереи в полноэкранном режиме */

'use strict';

/* jslint browser: true */
/* ESLint browser: true */

var utilities = require('../utilities');

var galleryOverlay = document.querySelector('.overlay-gallery');
var gallery = document.querySelector('.photogallery');
var picturesContainer = galleryOverlay.querySelector('.overlay-gallery-preview');
var currentPictureNumber = galleryOverlay.querySelector('.preview-number-current');
var picturesSum = galleryOverlay.querySelector('.preview-number-total');
var btnNext = galleryOverlay.querySelector('.overlay-gallery-control-right');
var btnPrev = galleryOverlay.querySelector('.overlay-gallery-control-left');
var btnClose = galleryOverlay.querySelector('.overlay-gallery-close');

/** @type {Array.<Object>} */
var picturesList = gallery.getElementsByTagName('IMG');

/** @type {Array.<Object>} */
var picturesSrc = [];

/** @type {number} */
var currentPicture;

/** @type {number} */
var pictureNumber;


/** @param {Object} initialPictures */
function createSrcArray(initialPictures) {
  for (var i = 0; i < initialPictures.length; i++) {
    picturesSrc.push(initialPictures[i].getAttribute('src'));
    initialPictures[i].id = i + 1;
  }
}

function createGallery() {
  createSrcArray(picturesList);
  currentPicture = picturesContainer.appendChild(new Image());
  picturesSum.textContent = picturesList.length;
}

createGallery();

/** @param {Number} pictureNumb */
function showGallery(pictureNumb) {
  currentPicture.src = picturesSrc[pictureNumb - 1];
  currentPictureNumber.textContent = pictureNumb;

  utilities.showElem(galleryOverlay);

  btnNext.addEventListener('click', _onNextClick);
  btnPrev.addEventListener('click', _onPrevClick);

  if (pictureNumb < 1) {
    btnNext.removeEventListener('click', _onNextClick);
  }
  if (pictureNumb > picturesList.length + 1) {
    btnPrev.removeEventListener('click', _onNextClick);
  }

  btnClose.addEventListener('click', _onCloseClick);
  window.addEventListener('keydown', _onDocumentKeyDown);
}

gallery.addEventListener('click', function(evt) {
  evt.preventDefault();
  if (evt.target.tagName === 'IMG') {
    pictureNumber = evt.target.id;
    showGallery(pictureNumber);
  }
});

function showNext() {
  currentPicture.src = picturesSrc[pictureNumber];
  currentPictureNumber.textContent = pictureNumber++;
}

function showPrev() {
  currentPicture.src = picturesSrc[pictureNumber];
  currentPictureNumber.textContent = pictureNumber--;
}

function _onNextClick(evt) {
  evt.preventDefault();
  showNext();
}

function _onPrevClick(evt) {
  evt.preventDefault();
  showPrev();
}

function closeGallery() {
  utilities.hideElem(galleryOverlay);
  btnNext.removeEventListener('click', _onNextClick);
  btnPrev.removeEventListener('click', _onPrevClick);
  btnClose.removeEventListener('click', _onCloseClick);
  window.removeEventListener('keydown', _onDocumentKeyDown);
}

function _onDocumentKeyDown(evt) {
  evt.preventDefault();
  if (event.keyCode === utilities.KeyCode.ESC) {
    closeGallery();
  }
  if (event.keyCode === utilities.KeyCode.RIGHT) {
    showNext();
  }
  if (event.keyCode === utilities.KeyCode.LEFT) {
    showPrev();
  }
}

function _onCloseClick(evt) {
  evt.preventDefault();
  closeGallery();
}
