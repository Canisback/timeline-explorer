
  /*** @jsx React.DOM */
	/*
  var realPython = React.createClass({
    render: function() {
      return (<h2>Greetings, from Real Python!</h2>);
    }
  });

  ReactDOM.render(
    React.createElement(realPython, null),
    document.getElementById('content')
  );*/
  
var ddragonUrl = "http://ddragon.canisback.com/latest/";
var spellsUrl = ddragonUrl+"img/spell/"
var itemsUrl = ddragonUrl+"img/item/"
var championUrl = ddragonUrl+"img/champion/"
var perkUrl = "http://forum.canisback.com/img/runes/perk/"
var perkStyleUrl = "http://forum.canisback.com/img/runes/perkStyle/"

var buildingPositions = {
	"BLUE_TOP_LANE_OUTER_TURRET":{"x":981,"y":10441},
	"BLUE_TOP_LANE_INNER_TURRET":{"x":1512,"y":6699},
	"BLUE_TOP_LANE_BASE_TURRET":{"x":1169,"y":4287},
	"BLUE_MID_LANE_OUTER_TURRET":{"x":5846,"y":6396},
	"BLUE_MID_LANE_INNER_TURRET":{"x":5048,"y":4812},
	"BLUE_MID_LANE_BASE_TURRET":{"x":3651,"y":3696},
	"BLUE_BOT_LANE_OUTER_TURRET":{"x":10504,"y":1029}, 
	"BLUE_BOT_LANE_INNER_TURRET":{"x":6919,"y":1483},
	"BLUE_BOT_LANE_BASE_TURRET":{"x":4281,"y":1253},
	"BLUE_TOP_LANE_NEXUS_TURRET":{"x":1748,"y":2270},
	"BLUE_BOT_LANE_NEXUS_TURRET":{"x":2177,"y":1807},
	"RED_TOP_LANE_OUTER_TURRET":{"x":4318,"y":13875},
	"RED_TOP_LANE_INNER_TURRET":{"x":7943,"y":13411},
	"RED_TOP_LANE_BASE_TURRET":{"x":10481,"y":13650},
	"RED_MID_LANE_OUTER_TURRET":{"x":8955,"y":8510},
	"RED_MID_LANE_INNER_TURRET":{"x":9767,"y":10113},
	"RED_MID_LANE_BASE_TURRET":{"x":11134,"y":11207},
	"RED_BOT_LANE_OUTER_TURRET":{"x":13866,"y":4505},
	"RED_BOT_LANE_INNER_TURRET":{"x":13327,"y":8226},
	"RED_BOT_LANE_BASE_TURRET":{"x":13624,"y":10572},
	"RED_TOP_LANE_NEXUS_TURRET":{"x":12611,"y":13084},
	"RED_BOT_LANE_NEXUS_TURRET":{"x":13052,"y":12612},
	"BLUE_TOP_LANE_INHIBITOR":{"x":1171,"y":3571},
	"BLUE_MID_LANE_INHIBITOR":{"x":3203,"y":3208},
	"BLUE_BOT_LANE_INHIBITOR":{"x":3452,"y":1236},
	"RED_TOP_LANE_INHIBITOR":{"x":11261,"y":13676},
	"RED_MID_LANE_INHIBITOR":{"x":11598,"y":11667},
	"RED_BOT_LANE_INHIBITOR":{"x":13604,"y":11316}
}
  
class App extends React.Component{
	constructor(props) {
		super(props)
        this.platformId = window.location.href.split("/")[4]
        this.gameId = window.location.href.split("/")[5]
		this.state = {data:null,frame: 0}
		this.handleChange = this.handleChange.bind(this);
		this._handleKey = this._handleKey.bind(this);
	}
	
	componentDidMount(){
        document.addEventListener("keydown", this._handleKey, false);
		axios.get(`/stats/game/`+this.platformId+`/`+this.gameId)
			.then(res => {
				this.setState({
					data: res.data.frames,
					frame: 5
				});
                this.gameId = res.data.gameId
				console.log(this.state.data)
			});
    }
    
    _handleKey(event){
        if(event.key == "ArrowRight" && event.target.id != "frames"){
            if(this.state.frame < Object.keys(this.state.data).length - 1)
				this.setState({
					frame: this.state.frame + 1
				});
        }
        if(event.key == "ArrowLeft" && event.target.id != "frames"){
            if(this.state.frame > 0)
				this.setState({
					frame: this.state.frame - 1
				});
        }
    }
	
	
	handleChange(event) {
		this.setState({frame: event.target.value});
	}
    
	render() {
		if(this.state.data != null)
			return (
				<div>
					<input id="frames" type="range" value={this.state.frame} max={Object.keys(this.state.data).length - 1 } min="0" step="1" onChange={this.handleChange}/>{this.state.frame}<br />
					<TeamPanel teams={this.state.data[this.state.frame]['teamsState']}/>
					<ParticipantPanel teams={this.state.data[this.state.frame]['teamsState']} participants={this.state.data[this.state.frame]['participantsState']}  selectRole={this.selectRole} selectedRoles={this.state.responses}/>
					<Map participants={this.state.data[this.state.frame]['participantsState']}  map={this.state.data[this.state.frame]['mapState']} events={this.state.data[this.state.frame]['events']}/>
					<EventsPanel events={this.state.data[this.state.frame]['events']} participants={this.state.data[this.state.frame]['participantsState']}/>
				</div>
			);
		else
			return (<div>Loading</div>);
	}
}

class TeamPanel extends React.Component{
	render(){
		return(
			<div>
				<TeamRow data={this.props.teams['100']} color="blue" />
				<img className="score-icon" src="/static/img/score.png"/>
				<TeamRow data={this.props.teams['200']} color="red" />
			</div>
		)
	}
}

class TeamRow extends React.Component{
	render(){
		return (
			<div className={"team-column "+this.props.color}>
				<div className="kill">
					{this.props.data.kills}
				</div>
				<div className="tower">
					{this.props.data.towers}
				</div>
				<div className="drake">
					{this.props.data.drakes.length}
				</div>
				<div className="baron">
					{this.props.data.barons}
				</div>
			</div>
		)
	}
}

class ParticipantPanel extends React.Component{
	
	render(){
		return (
			<div>
				<div className="team-column">
					<ParticipantRow data={this.props.participants['p1']} />
					<ParticipantRow data={this.props.participants['p2']} />
					<ParticipantRow data={this.props.participants['p3']} />
					<ParticipantRow data={this.props.participants['p4']} />
					<ParticipantRow data={this.props.participants['p5']} />
				</div>
				<div className="team-column">
					<ParticipantRow data={this.props.participants['p6']} />
					<ParticipantRow data={this.props.participants['p7']} />
					<ParticipantRow data={this.props.participants['p8']} />
					<ParticipantRow data={this.props.participants['p9']} />
					<ParticipantRow data={this.props.participants['p10']} />
				</div>
			</div>
		)
	}
}

class ParticipantRow extends React.Component{
    
	constructor(props) {
		super(props)
	}
    
	render(){
		var participantRow = {
			"margin":"5px"
		}
		var styleChampionImage = {
			"height":'48px',
			"width":'48px',
			"background":"url('"+this.props.data.championImageSprite.sprite+"') -"+this.props.data.championImageSprite.x+"px -"+this.props.data.championImageSprite.y+"px no-repeat",
			"border-radius": "50%",
			"display":"inline-block",
		}
		
		var styleChampionLevel = {
			"height":'20px',
			"width":'20px',
			"background-color": "black",
			"border-radius": "50%",
			"color":"white",
			"text-align":"center",
			"display":"inline-block",
			"margin-left":"-15px"
		}
		
		var styleInlineBlock = {
			"display":"table-cell",
			"vertical-align": "middle"
		}
		
		var styleSpellImage = {
			"height":'20px',
			"width":'20px'
		}
		
		var styleMinionsBlock = {
			"display":"table-cell",
			"vertical-align": "middle",
			"width":"50px",
			"text-align":"center"
		}
		
		var styleKillsBlock = {
			"display":"table-cell",
			"vertical-align": "middle",
			"width":"60px",
			"text-align":"center"
		}
		
		var styleItemBlock = {
			"margin":'2px'
		}
		
		var styleItemImage = {
			"height":'40px',
			"width":'40px'
		}
		
		var styleItemNumber = {
			"height":'20px',
			"width":'15px',
			"color":"white",
			"text-align":"center",
			"display":"inline-block",
			"margin-left":"-15px"
		}
        
        var styleItemListBlock = {
			"display":"table-cell",
			"vertical-align": "middle",
            "min-width":"350px"
        }
        
		var itemsArray = []
		var dataItems = this.props.data.items
		Object.keys(this.props.data.items).forEach(function(key) {
			if(dataItems[key] > 1)
				itemsArray.push(<span style={styleItemBlock}><img src={itemsUrl + key + ".png"} style={styleItemImage} /><span style={styleItemNumber}>{dataItems[key]}</span></span>)
			else
				itemsArray.push(<span style={styleItemBlock}><img src={itemsUrl + key + ".png"} style={styleItemImage} /></span>)
		})
		
		return (
			<div style={participantRow}>
				<div style={styleInlineBlock}>
					<img src={this.props.data.spell1Image} style={styleSpellImage} /><br />
					<img src={this.props.data.spell2Image} style={styleSpellImage} />
				</div>
				
				<div style={styleInlineBlock}>
					<img src={this.props.data.keystoneImage} style={styleSpellImage} /><br />
					<img src={this.props.data.subImage} style={styleSpellImage} />
				</div>
				<div style={styleInlineBlock}>
					<div style={styleChampionImage} title={this.props.data.champion} />
					<div style={styleChampionLevel}>
						{this.props.data.level}
					</div>
				</div>
				
				<div style={styleMinionsBlock} title={"Minions : " + this.props.data.minionsKilled + " / Jungle : " + this.props.data.jungleMinionsKilled}>
					{this.props.data.minionsKilled + this.props.data.jungleMinionsKilled}
				</div>
				
				<div style={styleKillsBlock}>
					{this.props.data.kill + "/" + this.props.data.death + "/" + this.props.data.assist}
				</div>
				
				<div style={styleItemListBlock}>
					{itemsArray}
				</div>
				
			</div>
		)
	}
}

class Map extends React.Component{
	
	getScaledPosition(scale, position){
		return (position - scale.min) / (scale.max - scale.min) * 512
	}
    
    
    isHighlightedEvent(event){
        return true;
    }
	
	render(){
	
		var xScale = {min:-120,max:14870}
		var yScale = {min:-120,max:14980}
		
		var mapLength = 512
		
		
		//Players
		var playerPositions = []
		var participants = this.props.participants
		for(var i in participants){
			var strokeColor
			if(participants[i]['team'] == 100)
				strokeColor="blue"
			else
				strokeColor="red"
			if (participants[i]['state'] == "DOWN")
				playerPositions.push(<g>
					<svg x={this.getScaledPosition(xScale, participants[i]['position']['x']) - 16} y = {this.getScaledPosition(yScale, yScale.max + yScale.min - participants[i]['position']['y']) - 16} width="32px" height="32px">	
						<defs>
						<pattern id={"p"+i} x="0" y="0" height="100%" width="100%">
						  <image x="0" y="0" width="100%" height="100%" href={participants[i].championImage}></image>
						  <image x="3" y="3" width="24" height="24" href="/static/img/kill.png"></image>
						</pattern>
					  </defs>
					  <circle r="15" fill={"url(#p"+i+")"} stroke={strokeColor} cx="16" cy="16" />
						<title>{participants[i].champion}</title>
					</svg ></g>
				)
			else
				playerPositions.push(<g>
					<svg x={this.getScaledPosition(xScale, participants[i]['position']['x']) - 16} y = {this.getScaledPosition(yScale, yScale.max + yScale.min - participants[i]['position']['y']) - 16} width="32px" height="32px">	
						<defs>
						<pattern id={"p"+i} x="0" y="0" height="100%" width="100%">
						  <image x="0" y="0" width="100%" height="100%" href={participants[i].championImage}></image>
						</pattern>
					  </defs>
					  <circle r="15" fill={"url(#p"+i+")"} stroke={strokeColor} cx="16" cy="16" />
						<title>{participants[i].champion}</title>
					</svg ></g>
				)
				
			/*
			if(participants[i]['team'] == 100)
				playerPositions.push(<circle cx={this.getScaledPosition(xScale, participants[i]['position']['x'])} cy={this.getScaledPosition(yScale, yScale.max + yScale.min - participants[i]['position']['y'])} fill="blue" r="5"/>)
			else
				playerPositions.push(<circle cx={this.getScaledPosition(xScale, participants[i]['position']['x'])} cy={this.getScaledPosition(yScale, yScale.max + yScale.min - participants[i]['position']['y'])} fill="red" r="5" />)
			*/
		}
		
		//Buildings
		var buildingPositions = []
		var towers = this.props.map.tower
		var inhibs = this.props.map.inhib
		
		for(var i in towers){
			var color = i.split("_")[0].toLowerCase()
			if(towers[i]['state'] == "UP")
				buildingPositions.push(
					<image x={this.getScaledPosition(xScale, towers[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - towers[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/" + color + "_turret.png"}></image>
				)
			if(towers[i]['state'] == "DESTROYED")
				buildingPositions.push(
					<image x={this.getScaledPosition(xScale, towers[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - towers[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/turret_destroyed.png"}></image>
				)
		}
		
		for(var i in inhibs){
			var color = i.split("_")[0].toLowerCase()
			if(inhibs[i]['state'] == "UP")
				buildingPositions.push(
					<image x={this.getScaledPosition(xScale, inhibs[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - inhibs[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/" + color + "_inhibitor.png"}></image>
				)
			if(inhibs[i]['state'] == "DOWN" || inhibs[i]['state'] == "DESTROYED")
				buildingPositions.push(
					<image x={this.getScaledPosition(xScale, inhibs[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - inhibs[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/inhibitor_destroyed.png"}></image>
				)
		}
		
        //Monsters
		var monsters = this.props.map.monsters
		var monsterPositions = []
		for(var i in monsters){
			var monster = i.toLowerCase()
			if(monsters[i]['state'] == "UP")
				monsterPositions.push(
					<image x={this.getScaledPosition(xScale, monsters[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - monsters[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/" + monster + "_up.png"}></image>
				)
			else if(monsters[i]['state'] !== "DOWN")
				monsterPositions.push(
					<image x={this.getScaledPosition(xScale, monsters[i]['position']['x']) - 16} y={this.getScaledPosition(yScale, yScale.max + yScale.min - monsters[i]['position']['y']) - 16} width="32px" height="32px" href={"/static/img/" + monsters[i]['state'].toLowerCase() + "_" + monster + ".png"}></image>
				)
		}
        
        
        //Kills
        var events = this.props.events
        var killsPositions = []
        var killsPositionsHighlight = []
        for(var i in events){
            if(events[i]["type"] == "CHAMPION_KILL"){
                var event = events[i]
                if(participants["p"+event["victimId"]]['team'] == 100)
                    strokeColor="blue"
                else
                    strokeColor="red"
                
                killsPositions.push(<g>
					<svg x={this.getScaledPosition(xScale, event['position']['x']) - 8} y = {this.getScaledPosition(yScale, yScale.max + yScale.min - event['position']['y']) - 8} width="16px" height="16px">	
					  <circle r="7" fill={strokeColor} stroke={strokeColor} cx="8" cy="8" />
					</svg ></g>
				)
                if(this.isHighlightedEvent(event))
                    killsPositionsHighlight.push(<g>
                        <svg x={this.getScaledPosition(xScale, event['position']['x']) - 16} y = {this.getScaledPosition(yScale, yScale.max + yScale.min - event['position']['y']) - 16} width="32px" height="32px">	
                        <defs>

                            <filter id="sofGlow" height="200%" width="200%" x="-50%" y="-50%">
                                <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
                                <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
                                <feFlood flood-color="rgb(255,255,0)" result="glowColor" />
                                <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                                <feMerge>
                                    <feMergeNode in="softGlow_colored"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>

                            </filter>
                        </defs>
                          <circle r="7" fill={strokeColor} stroke={strokeColor} cx="16" cy="16"  filter="url(#sofGlow)"/>
                        </svg ></g>
                    )
                
            }
        }
        console.log(killsPositions)
		
		return (
			<svg width={mapLength + "px"} height={mapLength + "px"}>
				<image href="/static/img/map.png" x="0" y="0" width={mapLength + "px"} height={mapLength + "px"}></image>
				{killsPositions}
				{buildingPositions}
				{playerPositions}
				{monsterPositions}
                {killsPositionsHighlight}
			</svg>
        )
	}
}

class EventsPanel extends React.Component{
	constructor(props) {
		super(props)
	}
    
    render(){
        var participants = this.props.participants
		var eventsArray = []
		var dataEvents = this.props.events
		dataEvents.forEach(function(value, key) {
			eventsArray.push(<Event event={value} participants={participants}/>)
        })
        return (
            <div className={"eventsPanel"}>
            {eventsArray}
            </div>
        )
    }
}


class Event extends React.Component{
    
	constructor(props) {
		super(props)
	}
    
    getTimeFromTimestamp(time){
        var totalSeconds = Math.trunc(time/1000)
        var seconds = totalSeconds % 60
        var minutes = Math.trunc(totalSeconds/60) % 60
        var hours = Math.trunc(totalSeconds/3600)
        return (hours>0)?hours+":"+minutes+":"+seconds:minutes+":"+seconds
    }
    
    render(){
        var participants = this.props.participants
        var event = this.props.event
        
        if(event.type == "CHAMPION_KILL"){
            var assistsArray = []
            event.assistingParticipantIds.forEach(function(value) {
                assistsArray.push(<img src={participants["p"+value].championImage}  className={"eventAssistImage"} />)
            })
            var eventClass = (event.killerId > 5)?"redEvent":"blueEvent"
            return (
                <div className={eventClass}>
                    <span className="eventTimer">{this.getTimeFromTimestamp(event.timestamp)}</span>
                    <img src={participants["p"+event.victimId].championImage} className={"eventImage"}/>
                    <img className="eventScoreImage" src="/static/img/score.png"/>
                    <img src={participants["p"+event.killerId].championImage} className={"eventImage"} />
                    {assistsArray}
                </div>
            )
        }
        else
            return(<div></div>)
    }
                                  
}
    
    
    
ReactDOM.render(<App />, document.getElementById('app'));
