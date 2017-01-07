var Backbone = require('backbone');

var Team = Backbone.Model.extend({
  idAttribute: 'objectId'
});

var TeamCollection  = Backbone.Collection.extend({
  model: Team,
  url: 'https://zugzwang.herokuapp.com/classes/Playoff_Teams/',
  parse: function(data){
    return data.results;
  }
});

module.exports = {
  Team: Team,
  TeamCollection: TeamCollection
};
