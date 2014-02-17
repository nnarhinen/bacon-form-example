module.exports.persistCustomer = function(customerData) {
  $('.dummy-api').append('<p>Would persist <pre>' + JSON.stringify(customerData) +'</pre></p>');
};
