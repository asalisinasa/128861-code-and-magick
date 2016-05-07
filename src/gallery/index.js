/** @fileoverview Открытие галереи в полноэкранном режиме */

'use strict';



var gallery = require('./gallery');
var galleryElement = document.querySelector('.photogallery');

galleryElement.addEventListener('click', gallery._onGalleryClick);
