/** @fileoverview Конструктор, описывающий базовую DOM-компоненту */


'use strict';



function BaseComponent(data, container) {
  this.data = data;
  this.container = container;
}


BaseComponent.prototype.add = function() {
  this.container.appendChild(this.element);
};


BaseComponent.prototype.remove = function() {
  this.container.removeChild(this.element);
};


module.exports = BaseComponent;
