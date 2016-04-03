'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
  * @constant {number} MIN_MARKS_POSITIVE_VALUE
  * @param {Object} formRatingMarks
  */
  var MIN_MARKS_POSITIVE_VALUE = 3;
  var form = formContainer.querySelector('.review-form');
  var formRatingMarks = form.elements['review-mark'];
  var formNameField = form.elements['review-name'];
  var formTextField = form.elements['review-text'];
  var formNameLabel = form.querySelector('.review-fields-name');
  var formTextLabel = form.querySelector('.review-fields-text');
  var formSubmitBtn = form.querySelector('.review-submit');
  var formHint = form.querySelector('.review-fields');
  var selectedMarkValue;

  formSubmitBtn.disabled = true;
  formNameField.required = true;
  hideElem(formTextLabel);

  function showElem(element) {
    element.classList.remove('invisible');
  }

  function hideElem(element) {
    element.classList.add('invisible');
  }

  function invisibleElem(element) {
    element.classList.contains('invisible');
  }

  function checkRatingValue() {
    for (var i = 0; i < formRatingMarks.length; i++) {
      if (formRatingMarks[i].checked) {
        selectedMarkValue = formRatingMarks[i].value;
        break;
      }
    }
    if ((selectedMarkValue < MIN_MARKS_POSITIVE_VALUE) && (formTextField.value.length === null)) {
      formTextField.required = true;
      showElem(formTextLabel);
    }
    if (selectedMarkValue >= MIN_MARKS_POSITIVE_VALUE) {
      formTextField.required = false;
      hideElem(formTextLabel);
    }
  }

  function checkFieldValue(field, label) {
    if (field.value.length !== null) {
      hideElem(label);
    }
    if (field.value.length === null) {
      showElem(label);
    }
  }

  function closeHint() {
    if ((invisibleElem(formNameLabel) === true) && (invisibleElem(formTextLabel) === true)) {
      formSubmitBtn.disabled = false;
      hideElem(formHint);
    }
    if ((invisibleElem(formNameLabel) === false) || (invisibleElem(formTextLabel) === false)) {
      formSubmitBtn.disabled = true;
      hideElem(formHint);
    }
  }

  formRatingMarks.onclick = function() {
    checkRatingValue();
    checkFieldValue(formTextField, formTextLabel);
    closeHint();
  };

  formNameField.addEventListener('change', function(evt) {
    evt.preventDefault();
    checkRatingValue();
    checkFieldValue(formNameField, formNameLabel);
    closeHint();
  });

  formTextField.addEventListener('change', function(evt) {
    evt.preventDefault();
    checkRatingValue();
    checkFieldValue(formTextField, formTextLabel);
    closeHint();
  });
})();
