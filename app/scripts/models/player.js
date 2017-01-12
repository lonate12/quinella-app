var Backbone = require('backbone');

var Player = Backbone.Model.extend({
  idAttribute: 'objectId'
});

var PlayerCollection = Backbone.Collection.extend({
  model: Player,
  url: 'https://zugzwang.herokuapp.com/classes/Players/',
  parse: function(data){
    return data.results;
  },
  comparator: 'selection_position'
});

module.exports = {
  Player: Player,
  PlayerCollection: PlayerCollection
};
