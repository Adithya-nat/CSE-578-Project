import csv
import json
import os
from datetime import datetime, timezone
from collections import defaultdict


start_time = 1541246400
teams = [1, 2, 5, 7, 8, 9]


def getTimestamp(date):
    dt = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    return int(dt.replace(tzinfo=timezone.utc).timestamp())


def read_from_file(fn, flds):
    req_data = defaultdict(list)
    with open(fn, mode="r") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        # linecount = 0
        for row in csv_reader:
            # if linecount == 500:
            #     break
            # linecount += 1
            row_data = {}
            for fld in flds:
                if fld == "date":
                    row_data["time"] = (getTimestamp(row[fld]) - start_time) // 60
                row_data[fld] = row[fld]

            req_data[row_data["time"]].append(row_data)

    return req_data


def read_from_file_host(fn, flds):
    req_data = defaultdict(lambda: defaultdict(list))
    with open(fn, mode="r") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        # linecount = 0
        for row in csv_reader:
            # if linecount == 500:
            #     break
            # linecount += 1
            row_data = {}
            for fld in flds:
                if fld == "date":
                    row_data["time"] = (getTimestamp(row[fld]) - start_time) // 60
                row_data[fld] = row[fld]

            req_data[row_data["time"]][row["host"]].append(row_data)

    return req_data


def getMapData(mapp):
    res = []
    for x in mapp:
        res.append({"text": x, "size": mapp[x]})

    return res


def getWordCloudData_host():
    def buildWordCloudJSON(req_data):
        time_keys = sorted(req_data.keys())
        formatted_data = defaultdict(lambda: defaultdict(list))
        aggregated_data = defaultdict(lambda: defaultdict(list))
        agg_cmd_set = defaultdict(lambda: defaultdict(int))
        agg_hosts = set()

        # print(time_keys)
        for t in time_keys:
            hosts = sorted(req_data[t].keys())
            agg_hosts.update(hosts)
            for h in hosts:
                data = req_data[t][h]
                temp = defaultdict(int)
                for z in data:
                    temp[z["command"]] += int(z["command_count"])
                    agg_cmd_set[h][z["command"]] += int(z["command_count"])

                formatted_data[z["time"]][h] = getMapData(temp)
                aggregated_data[z["time"]][h] = getMapData(agg_cmd_set[h])

            # formatted_data[z["time"]]["hosts"] = hosts
            # aggregated_data[z["time"]]["hosts"] = list(agg_hosts)

        return [formatted_data, aggregated_data, list(agg_hosts)]

    req_fields = ["command", "command_count", "date"]
    for tm in teams:
        filename = "raw_data/team_{}.csv".format(tm)
        if not os.path.exists(filename):
            continue

        req_data = read_from_file_host(filename, req_fields)
        formatted_wordcloud_data, formatted_aggregated_data, agg_hosts = buildWordCloudJSON(req_data)
        # print(agg_hosts)
        # print("===================================================================")

        with open("processed/host/minute/team_{}_wordcloud.json".format(tm), "w") as outfile1:
            json.dump(formatted_wordcloud_data, outfile1)

        with open("processed/host/aggregated/team_{}_wordcloud.json".format(tm), "w") as outfile2:
            json.dump(formatted_aggregated_data, outfile2)


def getWordCloudData():
    def buildWordCloudJSON(req_data):
        time_keys = sorted(req_data.keys())
        formatted_data = {}
        aggregated_data = {}
        agg_cmd_set = defaultdict(int)

        # print(time_keys)
        for t in time_keys:
            data = req_data[t]
            temp = defaultdict(int)
            for z in data:
                temp[z["command"]] += int(z["command_count"])
                agg_cmd_set[z["command"]] += int(z["command_count"])

            formatted_data[z["time"]] = getMapData(temp)
            aggregated_data[z["time"]] = getMapData(temp)

        return [formatted_data, aggregated_data]

    req_fields = ["command", "command_count", "date"]
    for tm in teams:
        filename = "raw_data/team_{}.csv".format(tm)
        if not os.path.exists(filename):
            continue

        req_data = read_from_file(filename, req_fields)
        formatted_wordcloud_data, formatted_aggregated_data = buildWordCloudJSON(req_data)

        with open("processed/all/minute/team_{}_wordcloud.json".format(tm), "w") as outfile1:
            json.dump(formatted_wordcloud_data, outfile1)

        with open("processed/all/aggregated/team_{}_wordcloud.json".format(tm), "w") as outfile2:
            json.dump(formatted_aggregated_data, outfile2)


getWordCloudData()
getWordCloudData_host()
