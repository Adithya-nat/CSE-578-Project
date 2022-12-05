import csv
import json
import os
from datetime import datetime, timezone
from collections import defaultdict


start_time = 1541246400
teams = [1, 2, 5, 7, 8, 9]
# teams = [1]

def getTimestamp(date):
    dt = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    return int(dt.replace(tzinfo=timezone.utc).timestamp())


def read_from_file(fn, flds):
    req_data = defaultdict(list)
    with open(fn, mode="r") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        # linecount = 0
        for row in csv_reader:
            # if linecount == 10:
            #     break
            # linecount += 1
            row_data = {}
            for fld in flds:
                if fld == "date":
                    row_data["time"] = (getTimestamp(row[fld]) - start_time) // 60
                row_data[fld] = row[fld]

            req_data[row_data["time"]].append(row_data)

    return req_data


def getAggregatedData(time, src_set, dest_set, value_dict):
    nodes = []
    links = []
    for x in src_set:
        nodes.append({"name": x + "_src"})
    for x in dest_set:
        nodes.append({"name": x + "_dest"})

    for x in value_dict:
        ip = x.split("_")
        links.append({"source": ip[0] + "_src", "target": ip[1] + "_dest", "value": value_dict[x]})

    return {"time": time, "nodes": nodes, "links": links}


def getSankeyData():
    def buildSankeyJSON(req_data):
        time_keys = sorted(req_data.keys())
        formatted_data = {}
        aggregated_data = {}
        agg_src_set = set()
        agg_dest_set = set()
        agg_value_set = defaultdict(int)

        # print(time_keys)
        for t in time_keys:
            data = req_data[t]
            src_set = set()
            dest_set = set()
            nodes = []
            links = []
            for z in data:
                if z["src_ip"] not in src_set:
                    src_set.add(z["src_ip"])
                    nodes.append({"name": z["src_ip"] + "_src"})
                if z["dest_ip"] not in dest_set:
                    dest_set.add(z["dest_ip"])
                    nodes.append({"name": z["dest_ip"] + "_dest"})
                links.append({"source": z["src_ip"] + "_src", "target": z["dest_ip"] + "_dest", "value": int(z["total_bytes_in"])})

                if z["src_ip"] not in agg_src_set:
                    agg_src_set.add(z["src_ip"])
                if z["dest_ip"] not in agg_dest_set:
                    agg_dest_set.add(z["dest_ip"])
                agg_value_set[z["src_ip"]+"_"+z["dest_ip"]] += int(z["total_bytes_in"])

            formatted_data[z["time"]] = {"time": z["time"], "nodes": nodes, "links": links}
            aggregated_data[z["time"]] = getAggregatedData(z["time"], agg_src_set, agg_dest_set, agg_value_set)

        return [formatted_data, aggregated_data]

    req_fields = ["src_ip", "dest_ip", "date", "total_bytes_in"]
    for tm in teams:
        filename = "raw_data/sankey/team_{}.csv".format(tm)
        if not os.path.exists(filename):
            continue

        req_data = read_from_file(filename, req_fields)
        formatted_sankey_data, formatted_aggregated_data = buildSankeyJSON(req_data)

        with open("processed/sankey/minute/team_{}_sankey.json".format(tm), "w") as outfile1:
            json.dump(formatted_sankey_data, outfile1)

        with open("processed/sankey/aggregated/team_{}_sankey.json".format(tm), "w") as outfile2:
            json.dump(formatted_aggregated_data, outfile2)


getSankeyData()
