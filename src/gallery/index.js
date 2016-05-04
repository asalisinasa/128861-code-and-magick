/** @fileoverview Открытие галереи в полноэкранном режиме */

'use strict';

/* jslint browser: true */
/* ESLint browser: true */


var gallery = require('./gallery');
var galleryElement = document.querySelector('.photogallery');

galleryElement.addEventListener('click', gallery._onGalleryClick);
