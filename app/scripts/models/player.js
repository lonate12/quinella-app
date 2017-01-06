var Backbone = require('backbone');

var Player = Backbone.Model.extend({

});

var PlayerCollection = Backbone.Collection.extend({
  model: Player,
  url: 'https://zugzwang.herokupp.com/classes/Players/'
});

module.exports = {
  Player: Player,
  PlayerCollection: PlayerCollection
};
