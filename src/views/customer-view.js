'use strict';
var tmpl = require('./templates/customer.hbs'),
    api = require('../api'),
    _ = require('underscore');

var asKeyValue = function(ev) {
  var o = {};
  o[ev.currentTarget.name] = ev.currentTarget.value;
  return o;
};

var onlyNameChange = function(o) {
  return !!o.name;
};

var asNameValue = function(o) {
  return o.name;
};

var updateModelValue = function(old, val) {
  return _.extend({}, old, val);
};

var CustomerView = module.exports = function CustomerView(data) {
  this.model = data;

  this.element = $('<div />').on('click', '.button.reset', _.bind(function(ev) {
    ev.preventDefault();
    this.render();
  }, this));

  this.render();

  var changes = this.element.asEventStream('change', 'input').map(asKeyValue);

  changes.filter(onlyNameChange).map(asNameValue).toProperty().assign(this.element.find('h1.customer-name'), 'text');

  var modelValueProperty = changes.scan(this.model, updateModelValue).toProperty();

  var submits = this.element.asEventStream('submit', 'form')
                            .doAction('.preventDefault')
                            .map(modelValueProperty)
                            .flatMapLatest(function(val) {
                              return Bacon.fromPromise(api.persistCustomer(val));
                            });

  submits.onValue(_.bind(function(newModel) {
    this.model = newModel;
    this.render();
  }, this));
  submits.onError(function(err) {
    console.error('Failed to persist customer');
  });
};


CustomerView.prototype.render = function() {
    this.element.html(tmpl(this.model));
};
