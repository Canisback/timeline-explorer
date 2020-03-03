from flask import Flask
from flask import Response
from flask import render_template
from flask import request
import json, copy

import asyncio
from pantheon import pantheon as panth
from static_data import ddragon

dd = ddragon.ddragon()

server = "euw1"
servers = {
    "BR1":"br1",
    "EUN1":"eun1",
    "EUW1":"euw1",
    "JP1":"jp1",
    "KR":"kr",
    "LA1":"la1",
    "LA2":"la2",
    "NA1":"na1",
    "OC1":"oc1",
    "TR1":"tr1",
    "RU":"ru"
}


api_key = "API_KEY"

pantheon = {server:panth.Pantheon(servers[server], api_key) for server in servers}

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

def get_set_event_loop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError as e:
        if e.args[0].startswith('There is no current event loop'):
            asyncio.set_event_loop(asyncio.new_event_loop())
            return asyncio.get_event_loop()
        raise e

@app.route('/')
def index():
    return 'Example <a href="/game/EUW1/">here</a>'
    
@app.route('/riot.txt')
def riot():
    return '9b360308-0491-4f56-b97e-3275e6835ec5'

@app.route('/game/<string:platformId>/', defaults={'gameId': None})
@app.route('/game/<string:platformId>/<int:gameId>')
def game(platformId,gameId):
    return render_template('game.html', id=str(gameId))
    
@app.route('/stats/<string:dataType>/<string:platformId>/', defaults={'gameId': None})
@app.route('/stats/<string:dataType>/<string:platformId>/<int:gameId>')
def stats(dataType, platformId, gameId):
    if dataType == "game":
        gameData = findGame(platformId, gameId)
        if not gameData == None:
            frames = createFrames(gameData)
            resp = Response(json.dumps({"frames":frames,"gameId":gameId}))
            resp.headers['Content-Type'] = 'application/json'
            return resp
        resp = Response(json.dumps({"status_code":404,"message":"Not Found"}), status=404)
        resp.headers['Content-Type'] = 'application/json'
        return resp
    
    else:
        resp = Response(json.dumps({"status_code":400,"message":"Bad request"}), status=400)
        resp.headers['Content-Type'] = 'application/json'
        return resp

@app.route('/raw/<string:platformId>/<int:gameId>')
def raw(platformId, gameId):
    resp = Response(json.dumps(findGame(platformId, gameId)))
    resp.headers['Content-Type'] = 'application/json'
    return resp
    
    
def findGame(platformId, gameId):
    
    try:
        (game, timeline) = get_set_event_loop().run_until_complete(asyncio.gather(*[pantheon[platformId].getMatch(gameId),pantheon[platformId].getTimeline(gameId)]))

        game["timeline"] = timeline
        
        return game
    except Exception as e:
        print(e)
    
    
def createFrames(g):
    frames = {}
    dd_current = dd.withGameVersion(g["gameVersion"])
    print(g["gameVersion"])
    mapState = {
        "tower":{
            "BLUE_TOP_LANE_OUTER_TURRET":{"lane": "TOP_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":981,"y":10441}},
            "BLUE_TOP_LANE_INNER_TURRET":{"lane": "TOP_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":1512,"y":6699}},
            "BLUE_TOP_LANE_BASE_TURRET":{"lane": "TOP_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":1169,"y":4287}},
            "BLUE_MID_LANE_OUTER_TURRET":{"lane": "MID_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":5846,"y":6396}},
            "BLUE_MID_LANE_INNER_TURRET":{"lane": "MID_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":5048,"y":4812}},
            "BLUE_MID_LANE_BASE_TURRET":{"lane": "MID_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":3651,"y":3696}},
            "BLUE_BOT_LANE_OUTER_TURRET":{"lane": "BOT_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":10504,"y":1029}},
            "BLUE_BOT_LANE_INNER_TURRET":{"lane": "BOT_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":6919,"y":1483}},
            "BLUE_BOT_LANE_BASE_TURRET":{"lane": "BOT_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":4281,"y":1253}},
            "BLUE_TOP_LANE_NEXUS_TURRET":{"lane": "TOP_LANE","type":"NEXUS_TURRET", "state":"UP", "position":{"x":1748,"y":2270}},
            "BLUE_BOT_LANE_NEXUS_TURRET":{"lane": "BOT_LANE","type":"NEXUS_TURRET", "state":"UP", "position":{"x":2177,"y":1807}},
            "RED_TOP_LANE_OUTER_TURRET":{"lane": "TOP_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":4318,"y":13875}},
            "RED_TOP_LANE_INNER_TURRET":{"lane": "TOP_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":7943,"y":13411}},
            "RED_TOP_LANE_BASE_TURRET":{"lane": "TOP_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":10481,"y":13650}},
            "RED_MID_LANE_OUTER_TURRET":{"lane": "MID_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":8955,"y":8510}},
            "RED_MID_LANE_INNER_TURRET":{"lane": "MID_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":9767,"y":10113}},
            "RED_MID_LANE_BASE_TURRET":{"lane": "MID_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":11134,"y":11207}},
            "RED_BOT_LANE_OUTER_TURRET":{"lane": "BOT_LANE","type":"OUTER_TURRET", "state":"UP", "position":{"x":13866,"y":4505}},
            "RED_BOT_LANE_INNER_TURRET":{"lane": "BOT_LANE","type":"INNER_TURRET", "state":"UP", "position":{"x":13327,"y":8226}},
            "RED_BOT_LANE_BASE_TURRET":{"lane": "BOT_LANE","type":"BASE_TURRET", "state":"UP", "position":{"x":13624,"y":10572}},
            "RED_TOP_LANE_NEXUS_TURRET":{"lane": "TOP_LANE","type":"NEXUS_TURRET", "state":"UP", "position":{"x":12611,"y":13084}},
            "RED_BOT_LANE_NEXUS_TURRET":{"lane": "BOT_LANE","type":"NEXUS_TURRET", "state":"UP", "position":{"x":13052,"y":12612}}
        },
        "inhib":{
            "BLUE_TOP_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":1171,"y":3571}},
            "BLUE_MID_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":3203,"y":3208}},
            "BLUE_BOT_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":3452,"y":1236}},
            "RED_TOP_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":11261,"y":13676}},
            "RED_MID_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":11598,"y":11667}},
            "RED_BOT_LANE":{"state":"UP","timeDestroyed":0,"position":{"x":13604,"y":11316}}
        },
        "monsters":{
            "BARON_NASHOR":{"state":"DOWN","timeDestroyed":0,"position":{"x":4850,"y":10550}},
            "RIFTHERALD":{"state":"DOWN","timeDestroyed":0,"position":{"x":4850,"y":10550}},
            "DRAGON":{"state":"DOWN","timeDestroyed":0,"position":{"x":9950,"y":4400}}
        }

    }
    participantsState = {}
    teamsState={
        100:{"drakes":[],"towers":0,"kills":0,"barons":0},
        200:{"drakes":[],"towers":0,"kills":0,"barons":0}
    }

    for p in g['participants']:
        sprite = dd.getChampion(p['championId']).sprite
        participantsState["p"+str(p['participantId'])] = {
            "champion":dd_current.getChampion(p['championId']).name,
            "championImage":dd_current.getChampion(p['championId']).image,
            "championImageSprite":{"sprite":sprite[0],"x":sprite[1],"y":sprite[2]},
            "team":p['teamId'],
            "spell1":dd_current.getSummoner(p['spell1Id']).name,
            "spell1Image":dd_current.getSummoner(p['spell1Id']).image,
            "spell2":dd_current.getSummoner(p['spell2Id']).name,
            "spell2Image":dd_current.getSummoner(p['spell2Id']).image,
            "keystone":p['stats']['perk0'],
            "keystoneImage":dd_current.getRune(p['stats']['perk0']).image,
            "sub":p['stats']['perkSubStyle'],
            "subImage":dd_current.getRune(p['stats']['perkSubStyle']).image,
            "kill":0,
            "death":0,
            "assist":0,
            "items":{},
            "state":"UP",
            "timeKilled":0,
            "participantId":p["participantId"]
        }


    for i,f in enumerate(g['timeline']['frames']):

        mapState = updateMapState(mapState, f['timestamp'])

        events=[]
        for p in f['participantFrames']:
            p = f['participantFrames'][p]
            for s in ["minionsKilled","jungleMinionsKilled","level","position"]:
                if s in p:
                    participantsState["p"+str(p['participantId'])][s] = p[s]

        for e in f['events']:
            #Champion kill
            if e['type'] == "CHAMPION_KILL" and e['killerId'] > 0:
                participantsState["p"+str(e['victimId'])]["state"] = "DOWN"
                participantsState["p"+str(e['victimId'])]["timeKilled"] = e['timestamp']
                participantsState["p"+str(e['victimId'])]['death'] += 1
                participantsState["p"+str(e['killerId'])]['kill'] += 1
                for a in e['assistingParticipantIds']:
                    participantsState["p"+str(a)]['assist'] += 1

                teamsState[participantsState["p"+str(e['killerId'])]['team']]['kills'] += 1

                events.append(e)
            #Building kill
            elif e['type'] == "BUILDING_KILL":
                if e['buildingType'] == "TOWER_BUILDING":
                    if e['towerType'] == "NEXUS_TURRET":
                        if e['position']['x'] == 12611 or e['position']['x'] == 1748:
                            e['laneType'] = "TOP_LANE"
                        elif e['position']['x'] == 13052 or e['position']['x'] == 2177:
                            e['laneType'] = "BOT_LANE"
                    teamsState[e['teamId']]['towers'] += 1
                    color = colorFromPosition(e['position'])
                    mapState['tower'][color+"_"+e['laneType']+"_"+e["towerType"]]['state'] = "DESTROYED"
                if e['buildingType'] == "INHIBITOR_BUILDING":
                    mapState["inhib"][color+"_"+e['laneType']]['state'] = "DESTROYED"
                    mapState["inhib"][color+"_"+e['laneType']]['timeDestroyed'] = e['timestamp']

                events.append(e)
            #Elite monster kill
            elif e['type'] == "ELITE_MONSTER_KILL":
                if e['killerId'] == 0:
                    continue
                #Dragon
                if e['monsterType'] == "DRAGON":
                    teamsState[participantsState["p"+str(e['killerId'])]['team']]['drakes'].append(e['monsterSubType'])
                if e['monsterType'] == "BARON_NASHOR":
                    teamsState[participantsState["p"+str(e['killerId'])]['team']]['barons'] += 1

                #Give it team killer color
                mapState['monsters'][e['monsterType']]['state'] = "BLUE" if participantsState["p"+str(e['killerId'])]['team'] == 100 else "RED"
                mapState['monsters'][e['monsterType']]['timeDestroyed'] = e['timestamp']

                events.append(e)
            #Item purchased
            elif e['type'] == "ITEM_PURCHASED":
                if e['itemId'] in participantsState["p"+str(e['participantId'])]['items']:
                    participantsState["p"+str(e['participantId'])]['items'][e['itemId']] += 1
                else:
                    participantsState["p"+str(e['participantId'])]['items'][e['itemId']] = 1

                events.append(e)
            #Item sold
            elif e['type'] == "ITEM_SOLD":
                try:
                    participantsState["p"+str(e['participantId'])]['items'][e['itemId']] -= 1
                    if participantsState["p"+str(e['participantId'])]['items'][e['itemId']] == 0:
                        del(participantsState["p"+str(e['participantId'])]['items'][e['itemId']])

                    events.append(e)
                except:
                    pass
            #Item undo
            elif e['type'] == "ITEM_UNDO":
                try:
                    participantsState["p"+str(e['participantId'])]['items'][e['beforeId']] -= 1
                    if participantsState["p"+str(e['participantId'])]['items'][e['beforeId']] == 0:
                        del(participantsState["p"+str(e['participantId'])]['items'][e['beforeId']])

                    events.append(e)
                except:
                    pass
            #Item used
            elif e['type'] == "ITEM_DESTROYED" and e['participantId'] != 0:
                try:
                    participantsState["p"+str(e['participantId'])]['items'][e['itemId']] -= 1
                    if participantsState["p"+str(e['participantId'])]['items'][e['itemId']] == 0:
                        del(participantsState["p"+str(e['participantId'])]['items'][e['itemId']])
                except:
                    pass
        participantsState = updateParticipantsState(participantsState, f['timestamp'])

        frames[i] = {
            "mapState":copy.deepcopy(mapState),
            "teamsState":copy.deepcopy(teamsState),
            "participantsState":copy.deepcopy(participantsState),
            "events":events
        }
    return frames
    
def respawnTime(level, timestamp, map=11):
    duration = int(timestamp/1000)
    brw = level * 2.5 + 7.5
    ttr = brw
    if duration > 2700:
        ttr += ((duration - 2700) % 30) * 1.45 * (brw/100) 
        
    if duration > 1800:
        ttr += ((duration - 1800) % 30) * 0.3 * (brw/100)
        
    if duration > 900:
        ttr += ((duration - 900) % 30) * 0.425 * (brw/100)
        
    if duration > 3210:
        ttr = 150 * (brw/100)
        
    return ttr * 1000
    
def updateMapState(mapState, timestamp):
    #Towers
    for t in mapState['tower']:
        if mapState['tower'][t]['state']=="DESTROYED":
            mapState['tower'][t]['state'] = "DOWN"
            
    #Inhibitors
    for i in mapState['inhib']:
        if mapState['inhib'][i]['state']=="DESTROYED":
            mapState['inhib'][i]['state'] = "DOWN"
        #Respawning
        if mapState['inhib'][i]['state']=="DOWN" and timestamp > (mapState['inhib'][i]['timeDestroyed'] + 300000):
            mapState['inhib'][i]['state'] = "UP"
            
    #Monsters
    #Herald
    #Spawn
    if mapState['monsters']["RIFTHERALD"]["state"] == "DOWN" and timestamp >= 600000 and mapState['monsters']["RIFTHERALD"]["timeDestroyed"] == 0:
        mapState['monsters']["RIFTHERALD"]["state"] = "UP"
    #Removed @20
    if mapState['monsters']["RIFTHERALD"]["state"] == "UP" and timestamp >= 1200000:
        mapState['monsters']["RIFTHERALD"]["state"] = "DOWN"
        mapState['monsters']["RIFTHERALD"]["timeDestroyed"] = timestamp
    #Disappear after killed
    if mapState['monsters']["RIFTHERALD"]["state"] == "RED" or mapState['monsters']["RIFTHERALD"]["state"] == "BLUE":
        mapState['monsters']["RIFTHERALD"]["state"] = "DOWN"
        
    #Dragon
    #Spawn
    if mapState['monsters']["DRAGON"]["state"] == "DOWN" and timestamp >= 150000 and mapState['monsters']["DRAGON"]["timeDestroyed"] == 0:
        mapState['monsters']["DRAGON"]["state"] = "UP"
    #Respawn
    if mapState['monsters']["DRAGON"]["state"] == "DOWN" and mapState['monsters']["DRAGON"]["timeDestroyed"] != 0 and timestamp >= (mapState['monsters']["DRAGON"]["timeDestroyed"] + 360000):
        mapState['monsters']["DRAGON"]["state"] = "UP"
        #if timestamp >= 2100000:
        #    mapState['monsters']["DRAGON"]["state"] = "ELDER_UP"
    #Disappear after killed
    if mapState['monsters']["DRAGON"]["state"] == "RED" or mapState['monsters']["DRAGON"]["state"] == "BLUE":
        mapState['monsters']["DRAGON"]["state"] = "DOWN"
    
    #Baron
    #Spawn
    if mapState['monsters']["BARON_NASHOR"]["state"] == "DOWN" and timestamp >= 1200000 and mapState['monsters']["BARON_NASHOR"]["timeDestroyed"] == 0:
        mapState['monsters']["BARON_NASHOR"]["state"] = "UP"
    #Respawn
    if mapState['monsters']["BARON_NASHOR"]["state"] == "DOWN" and mapState['monsters']["BARON_NASHOR"]["timeDestroyed"] != 0 and timestamp >= (mapState['monsters']["BARON_NASHOR"]["timeDestroyed"] + 420000):
        mapState['monsters']["BARON_NASHOR"]["state"] = "UP"
    #Disappear after killed
    if mapState['monsters']["BARON_NASHOR"]["state"] == "RED" or mapState['monsters']["BARON_NASHOR"]["state"] == "BLUE":
        mapState['monsters']["BARON_NASHOR"]["state"] = "DOWN"
        
    return mapState
    
def updateParticipantsState(participantsState, timestamp):
    for p in participantsState:
        if participantsState[p]['state'] == "DOWN":
            if (participantsState[p]['timeKilled'] + respawnTime(participantsState[p]['level'],participantsState[p]['timeKilled'])) <= timestamp:
                participantsState[p]['state'] = "UP"
    return participantsState

def colorFromPosition(position):
    return "BLUE" if (position['x'] + position['y']) < 14870 else "RED"
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)