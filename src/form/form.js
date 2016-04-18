/** @fileoverview Валидация полей формы, установка cookies */

'use strict';

/* jslint browser: true */
/* ESLint browser: true */

(function() {
  var utilities = require('../utilities');
  var browserCookies = require('browser-cookies');

  /** @constant {number} MIN_MARKS_POSITIVE_VALUE*/
  var MIN_MARKS_POSITIVE_VALUE = 3;
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var form = formContainer.querySelector('.review-form');
  var formRatingMarkGroup = form.querySelector('.review-form-group-mark');
  var formRatingMark = form.elements['review-mark'];
  var formNameField = form.elements['review-name'];
  var formTextField = form.elements['review-text'];
  var formNameLabel = form.querySelector('.review-fields-name');
  var formTextLabel = form.querySelector('.review-fields-text');
  var formSubmitBtn = form.querySelector('.review-submit');
  var formHint = form.querySelector('.review-fields');
  var selectedMarkValue;

  formNameField.value = browserCookies.get('formNameField');
  formRatingMark.value = browserCookies.get('formRatingMark') || formRatingMark.value;

  formSubmitBtn.disabled = true;
  formNameField.required = true;
  utilities.hideElem(formTextLabel);

  form.onsubmit = function(evt) {
    var currentDate = new Date();
    var myDate = new Date(currentDate.getFullYear(), 10, 11);
    var dateExpire;
    var expiresOption;

    if (myDate > currentDate) {
      myDate.setFullYear(myDate.getFullYear() - 1);
    }
    dateExpire = new Date(currentDate.valueOf() + (currentDate - myDate));
    expiresOption = { expires: dateExpire.toUTCString() };

    evt.preventDefault();
    browserCookies.set('formRatingMark', formRatingMark.value, expiresOption);
    browserCookies.set('formNameField', formNameField.value, expiresOption);

    this.submit();
  };

  function checkRatingValue() {
    if ((selectedMarkValue < MIN_MARKS_POSITIVE_VALUE) && (formTextField.value.length === 0)) {
      formTextField.required = true;
      utilities.showElem(formTextLabel);
    } else {
      formTextField.required = false;
      utilities.hideElem(formTextLabel);
    }
  }

  function validateForm() {
    if ((formNameField.value.length !== 0) && (!formTextField.required || (formTextField.value.length !== 0))) {
      formSubmitBtn.disabled = false;
      utilities.hideElem(formHint);
    }
    if ((formNameField.value.length === 0) || (formTextField.required && (formTextField.value.length !== 0))) {
      formSubmitBtn.disabled = true;
      utilities.showElem(formHint);
    }
    if (formTextField.required && (formTextField.value.length === 0)) {
      formSubmitBtn.disabled = true;
      utilities.showElem(formTextLabel);
      utilities.showElem(formHint);
    } else {
      utilities.hideElem(formTextLabel);
    }
    if (formNameField.value.length === 0) {
      utilities.showElem(formNameLabel);
    } else {
      utilities.hideElem(formNameLabel);
    }
  }

  formRatingMarkGroup.addEventListener('click', function(evt) {
    if (!evt.target.classList.contains('review-mark-label')) {
      selectedMarkValue = evt.target.value;
    }
    checkRatingValue();
    validateForm();
  }, false);

  formNameField.addEventListener('change', function(evt) {
    evt.preventDefault();
    checkRatingValue();
    validateForm();
  });

  formTextField.addEventListener('change', function(evt) {
    evt.preventDefault();
    checkRatingValue();
    validateForm();
  });

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    utilities.showElem(formContainer);
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    utilities.hideElem(formContainer);
  };
})();
