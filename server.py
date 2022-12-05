import json

from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/")
@cross_origin()
def helloWorld():
    return "Hello, cross-origin-world!"


@app.route('/getData', methods=['GET'])
def getData():
    team = request.args["team"]
    host = request.args["host"]
    time = request.args["time"]
    resp = {"sankey": getSankeyData(team, time), "wordcloud": getWordCloudData(team, host, time)}
    return resp


@app.route('/getTeamData', methods=['GET'])
def getTeamData():
    team = request.args["team"]
    datafile = "data/processed/team_host.json"
    f = open(datafile)
    data3 = json.load(f)
    return {"host": data3[team] if team in data3 else []}


def getWordCloudData(team, host, time):
    if host == "all":
        datafile = "data/processed/wordcloud/all/minute/team_{}_wordcloud.json".format(team)
        f = open(datafile)
        data1 = json.load(f)
        dt = {"minute": data1[time] if time in data1 else []}

        datafile = "data/processed/wordcloud/all/aggregated/team_{}_wordcloud.json".format(team)
        f = open(datafile)
        data2 = json.load(f)
        dt["aggregated"] = data2[time] if time in data2 else []
    else:
        datafile = "data/processed/wordcloud/host/minute/team_{}_wordcloud.json".format(team)
        f = open(datafile)
        data1 = json.load(f)
        dt = {"minute": data1[time][host] if time in data1 and host in data1[time] else []}

        datafile = "data/processed/wordcloud/all/aggregated/team_{}_wordcloud.json".format(team)
        f = open(datafile)
        data2 = json.load(f)
        dt["aggregated"] = data2[time][host] if time in data2 and host in data2[time] else []

    return dt


def getSankeyData(team, time):
    # plain = {"time": time, "links": [], "nodes": []}
    datafile = "data/processed/sankey/minute/team_{}_sankey.json".format(team)
    f = open(datafile)
    data1 = json.load(f)
    dt = {"minute": data1[time] if time in data1 else {}}

    datafile = "data/processed/sankey/aggregated/team_{}_sankey.json".format(team)
    f = open(datafile)
    data2 = json.load(f)
    dt["aggregated"] = data2[time] if time in data2 else {}

    return dt
