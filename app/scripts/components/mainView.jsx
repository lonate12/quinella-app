var React = require('react');
var PlayerCollection = require('../models/player.js').PlayerCollection;
var TeamCollection = require('../models/team.js').TeamCollection;

var AddPlayerForm = React.createClass({
  getInitialState: function(){
    return {
      name: ''
    }
  },
  handleChange: function(e){
    e.preventDefault();

    this.setState({name: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();

    this.props.addName({name: this.state.name});
    this.setState({name: ''});
  },
  render: function(){
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre para Agregar</label>
          <input onChange={this.handleChange} type="text" className="form-control" id="name" placeholder="Nombre de Jugador" value={this.state.name}/>
        </div>
        <button type="submit" className="btn btn-success pull-right">Agregar</button>
      </form>
    );
  }
});

var MainView = React.createClass({
  getInitialState: function(){
    return{
      playerCollection: new PlayerCollection(),
      teams: new TeamCollection(),
      gameFull: false,
      shuffleNames: false,
      selectTeam: false,
      selectingPlayer: '',
      noNameError: false,
      isDuplicate: false
    }
  },
  componentWillMount: function(){
    var self = this;
    this.state.playerCollection.fetch().then(function(){
      self.setState({playerCollection: self.state.playerCollection});

      if (self.state.playerCollection.length === 8){
        self.setState({gameFull: true, shuffleNames: true});
      }

      if (self.state.playerCollection.at(0).get('selection_position')) {
        self.setState({shuffleNames: false, selectTeam: true});
        self.setSelectingPlayer();
      }
    });

    this.state.teams.fetch().then(function(){
      var filteredList = self.state.teams.filter(function(team){
        return !team.get('assigned');
      })
      var filteredCollection = new TeamCollection(filteredList);
      self.setState({teams: filteredCollection});
    });
  },
  shuffleNames: function(){
    self = this;
    self.state.playerCollection.reset(self.state.playerCollection.shuffle(), {silent: true});

    this.state.playerCollection.forEach(function(player, index){
      player.unset('createdAt');
      player.unset('updatedAt');
      player.set('selection_position', index+1);
      player.save();
    });

    this.setState({shuffleNames: false, playerCollection: this.state.playerCollection, selectTeam: true});
    this.setSelectingPlayer();
  },
  setSelectingPlayer: function(){
    var currentPlayer = this.state.playerCollection.find(function(player){
      return !player.get('team');
    });

    if (currentPlayer){
      this.setState({selectingPlayer: currentPlayer.get('name')});
    } else {
      this.setState({selectTeam: false});
    }
  },
  addName: function(newPlayer){
    if (!newPlayer.name) {
      this.setState({noNameError: true});
      return;
    }

    var isNew = this.state.playerCollection.findWhere({name: newPlayer.name});
    if (isNew != undefined){
      this.setState({isDuplicate: true});
      return;
    }

    this.state.playerCollection.create(newPlayer);
    this.setState({playerCollection: this.state.playerCollection, noNameError: false, isDuplicate: false});
    if(this.state.playerCollection.length === 8){
      this.setState({gameFull: true, shuffleNames: true});
    }
  },
  assignTeam: function(){
    var randomTeam = this.state.teams.shuffle()[0], currentPlayer = this.state.selectingPlayer;
    var currentPlayer = this.state.playerCollection.findWhere({name: currentPlayer});
    var self = this;

    currentPlayer.set('team', randomTeam.get('name'));
    currentPlayer.unset('updatedAt');
    currentPlayer.unset('createdAt');

    randomTeam.set('assigned', currentPlayer.get('name'));
    randomTeam.unset('updatedAt');
    randomTeam.unset('createdAt');


    randomTeam.save().then(function(){
      currentPlayer.save().then(function(){
        self.setSelectingPlayer();
        self.state.teams.remove(randomTeam);
        self.setState({teams: self.state.teams});
      });
    });
  },
  render: function(){
    var players = this.state.playerCollection.map(function(player){
      return(
        <li key={player.cid}>{player.get('name')}: {player.get('team')}</li>
      );
    })

    var teams = this.state.teams.map(function(team){
      return (
        <li key={team.get('objectId')}>{team.get('name')}</li>
      )
    })
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-xs-10 col-xs-offset-1 players">
            <ul>
              <h3>Jugadores</h3>
              {players}
            </ul>
          </div>
          <div className="col-md-6 col-xs-10 col-xs-offset-1 teams">
            <ul>
              <h3>Equipos Disponibles</h3>
              {teams}
            </ul>
          </div>
        </div>
        <div className="row forms">
          <div className={this.state.gameFull ? "hide" : "col-md-6 col-md-offset-3"}>
            <div className={this.state.isDuplicate ? "bg-danger" : "hide"}>
              <h4 className="text-danger center-block">Este jugador ya esta apuntado.</h4>
            </div>
            <div className={this.state.noNameError ? "bg-danger" : "hide"}>
              <h4 className="text-danger center-block">Por favor poner un nombre.</h4>
            </div>
            <AddPlayerForm addName={this.addName}/>
          </div>
        </div>
        <button type="button" className={this.state.shuffleNames ? "btn btn-success pull-right" : "hide"} onClick={this.shuffleNames}>Shuffle Names</button>
        <button type="button" className={this.state.selectTeam ? "btn btn-success pull-right" : "hide"} onClick={this.assignTeam}>{this.state.selectingPlayer}, click to receive your random team</button>
      </div>
    );
  }
});

module.exports = {
  MainView: MainView
};
