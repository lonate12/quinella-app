var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var MainView = require('./components/mainView.jsx').MainView;

var AppRouter = Backbone.Router.extend({
  initialize: function(){},
  routes: {
    '': 'index'
  },
  index: function(){
    ReactDOM.render(
      React.createElement(MainView),
      document.getElementById('app')
    );
  }
});

var router = new AppRouter();

module.exports = router;
