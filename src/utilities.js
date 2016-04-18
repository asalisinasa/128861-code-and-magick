/** @fileoverview Набор вспомогательных методов и свойств */

'use strict';

/* jslint browser: true */
/* ESLint browser: true */

module.exports = {

  /** Показывает элемент
   * @param {Element} element
   */
  showElem: function(element) {
    element.classList.remove('invisible');
  },

  /** Скрывает элемент
   * @param {Element} element
   */
  hideElem: function(element) {
    element.classList.add('invisible');
  },

  /** Проверяет, находится ли элемент в видимой области окна
  * @param  {HTMLElement} element
  * @return {Boolean}
  */
  isVisible: function(element) {
    return element.getBoundingClientRect().bottom < 0;
  },

  /** Тормозит вызов функции
  * @param  {Number} timeout
  */
  throttle: function(method, timeout) {
    var wait = false;
    return function() {
      if (!wait) {
        method();
        wait = true;
        setTimeout(function() {
          wait = false;
        }, timeout);
      }
    };
  },

  /** Получает данные от сервера с помощью AJAX
  * @param {function(Array.<Object>)} callback
  * @param {String} url
  */
  getData: function(callback, url) {
    var xhr = new XMLHttpRequest();

    /** @param {ProgressEvent} evt */
    xhr.onload = function(evt) {
      var requestObj = evt.target;
      var response = requestObj.response;
      var loadedData = JSON.parse(response);
      callback(loadedData);
    };

    xhr.error = function() {
      callback(true);
    };

    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      callback(true);
    };

    xhr.open('GET', url);
    xhr.send();
  }
};
