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
        <button type="submit" className="btn btn-default">Agregar</button>
      </form>
    );
  }
});

var MainView = React.createClass({
  getInitialState: function(){
    return{
      playerCollection: new PlayerCollection(),
      teams: new TeamCollection()
    }
  },
  componentWillMount: function(){
    var self = this;
    this.state.playerCollection.fetch().then(function(){
      self.setState({playerCollection: self.state.playerCollection});
    });

    this.state.teams.fetch().then(function(){
      self.setState({teams: self.state.teams});
    });
  },
  addName: function(newPlayer){
    console.log(newPlayer);
    this.state.playerCollection.create(newPlayer);
    this.setState({playerCollection: this.state.playerCollection});
  },
  render: function(){
    var players = this.state.playerCollection.map(function(player){
      console.warn(player);
      return(
        <li key={player.cid}>{player.get('name')}: {player.get('team')}</li>
      );
    })

    var teams = this.state.teams.map(function(team){
      console.log(team);
      return (
        <li key={team.get('objectId')}>{team.get('name')}</li>
      )
    })
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <ul>
              {players}
            </ul>
          </div>
          <div className="col-md-6">
            <ul>
              {teams}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <AddPlayerForm addName={this.addName}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  MainView: MainView
};
