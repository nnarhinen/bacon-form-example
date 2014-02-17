'use strict';
var CustomerView = require('./views/customer-view'),
    view = new CustomerView({name: 'John Doe', email: 'johndoe@example.com', updatedAt: new Date()});


$(function() {
  $('.container').html(view.element);
});
