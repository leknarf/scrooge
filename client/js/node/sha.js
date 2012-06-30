var domready = require('domready');
var sha = require('sha1');

domready(function() {
  document.sha = sha;
});
