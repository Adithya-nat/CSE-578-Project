import datetime
import json
import csv
from dateutil.parser import parse
from flask import Flask, request, send_from_directory

from flask_cors import CORS, cross_origin

app = Flask(__name__, static_url_path='', static_folder='static')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
start_time = parse("2018-11-03T12:00:00.000Z")

@app.route("/")
@cross_origin()
def helloWorld():
    return send_from_directory("static", "index.html")
    # return "Hello, cross-origin-world!"

@app.route('/getStartEndTime', methods=['GET'])
def getStartEndTime():
    team = request.args["team"]
    datafile = "data/processed/team_minMax.json"
    f = open(datafile)
    dat = json.load(f)
    return {"Time": dat[team] if team in dat else []}

@app.route('/getData', methods=['GET'])
def getData():
    team = request.args["team"]
    host = request.args["host"]
    time = request.args["time"]
    resp = {
        "sankey": getSankeyData(team, time),
        "wordcloud": getWordCloudData(team, host, time),
        "treeMap": getTreeMapData(team, time),
        "stackedBar": get_stacked_bar_data(team, time)
    }
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


def get_datetime_based_on_client_time(time):
    return start_time + datetime.timedelta(minutes=time)


def get_stacked_bar_data(team, time):
    time = int(time)
    data = get_http_data(team, time)
    status = get_all_http_status()
    return {
        "data": data,
        "status": status
    }

def get_all_http_status():
    data_file = f"data/processed/stackedbar/status.json"
    with open(data_file) as f:
        status = json.load(f)
    return status
def get_http_data(team, time):
    data_file = f"data/processed/stackedbar/minute/team_{team}_http_pivot.csv"
    # mod = int(time) % 2
    # data_file = f"data/processed/stackedbar/test_data_{mod}.csv"
    date_time = get_datetime_based_on_client_time(time)
    arr = []
    with open(data_file, encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            if parse(row["date"]) == date_time:
                arr.append(row)
            # arr.append(row)
    return arr


def getTreeMapData(team, time):
    # plain = {"time": time, "links": [], "nodes": []}
    datafile = "data/processed/treeMap/minute/team_{}_treeMap.json".format(team)
    f = open(datafile)
    data1 = json.load(f)
    dt = {"minute": data1[time] if time in data1 else {}}

    # datafile = "data/processed/sankey/aggregated/team_{}_treeMap.json".format(team)
    # f = open(datafile)
    # data2 = json.load(f)
    # dt["aggregated"] = data2[time] if time in data2 else {}

    return dt
