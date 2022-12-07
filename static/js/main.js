var isAggregated = false;
var team = 1;
var host = "all";
var team_hosts = [];
var start_minute = 88;
var current_minute = start_minute;
var end_minute = start_minute+120;
var duration = 3000;


function get_ip_or_host(x) {
    let dictionary = {
        "prod-postgres-00": "10.0.1.51",
        "prod-routing-00": "10.0.1.42",
        "prod-money-00": "10.0.1.44",
        "prod-memcache-13": "10.0.1.54",
        "prod-dapi-00": "10.0.1.40",
        "prod-geo-04": "10.0.1.52",
        "prod-safety-00": "10.0.1.43",
        "prod-frontend-00": "10.0.1.5",
        "prod-lapi-00": "10.0.1.41",

        "vdi-kali01": "10.0.254.201",
        "vdi-kali02": "10.0.254.202",
        "vdi-kali03": "10.0.254.203",
        "vdi-kali04": "10.0.254.204",
        "vdi-kali05": "10.0.254.205",
        "vdi-kali06": "10.0.254.206",
        "vdi-win01": "10.0.254.101",
        "vdi-win02": "10.0.254.102",
        "vdi-win03": "10.0.254.103",
        "vdi-win04": "10.0.254.104",
        "vdi-win05": "10.0.254.105",
        "vdi-win06": "10.0.254.106",

        "cars-car-114": "10.0.2.114",
        "cars-car-128": "10.0.2.128",
        "cars-car-135": "10.0.2.135",
        "cars-car-136": "10.0.2.136",
        "cars-car-177": "10.0.2.177",
        "cars-car-190": "10.0.2.190",
        "cars-car-18": "10.0.2.18",
        "cars-car-21": "10.0.2.21",
        "cars-car-33": "10.0.2.33",
        "cars-car-87": "10.0.2.87",

        "corp-mail-00": "10.0.0.22",
        "corp-people-00": "10.0.0.21",
        "corp-audit-00": "10.0.0.23",
        "corp-wiki-00": "10.0.0.12",
        "corp-helpdesk-00": "10.0.0.11",
        "corp-onramp-00": "10.0.0.176",
        "corp-security-00": "10.0.0.24",
        "corp-talk-00": "10.0.0.20",
        "corp-ad-00": "10.0.0.10",
        "corp-employee-00": "10.0.0.240"

    }
    let ip = dictionary[x.slice(3)]
    let host = ""
    if (ip == null) {
        host = Object.keys(dictionary).find(key => dictionary[key] === x);
        return host

    } else {
        return ip
    }
    return null
}

function changeDataType(){
    if(document.getElementById("datatype").value == "aggregated"){
        isAggregated = true;
    } else {
        isAggregated = false;
    }
    updateData()
}

async function changeTeam(){
    team = document.getElementById("team").value;
    url = "http://localhost:5000/getTeamData?team="+team
    let response = await fetch(url);
    let data = await response.json();
    team_hosts = data["host"]
    generateHostDropDown()
    updateData()
}

async function startUpdateData(){
    await updateData()
    console.log(current_minute)
    if(current_minute <= end_minute && isRunning){
        current_minute += 1
        setTimeout(function(){startUpdateData()}, duration);
    }
}

async function updateData() {
    url = "getData?team="+team+"&host="+host+"&time="+current_minute
    let response = await fetch(url);
    let data = await response.json();

    if(isAggregated){
        updateWordCloudData(data["wordcloud"]["aggregated"]);
        if(Object.keys(data["sankey"]["aggregated"]).length > 0){
            updateSankeyData(data["sankey"]["aggregated"]);
        } else {
            console.log("No Data")
        }
    } else {
        updateWordCloudData(data["wordcloud"]["minute"]);
        if(Object.keys(data["sankey"]["minute"]).length > 0){
            updateSankeyData(data["sankey"]["minute"]);
        } else {
            console.log("No Data")
        }
    }
    updatePlaySlider();
}

window.addEventListener('load', function () {

    // word cloud
    myWordCloud = wordCloud("body");

    //sankey
    sankey_formatNumber, sankey_format, sankey_color = d3.scaleOrdinal(d3.schemeCategory20);
    sankey_svg = d3.select("#sankey_svg")
    sankey_width = +sankey_svg.attr("width"),
    sankey_height = +sankey_svg.attr("height");

    sankey_t = d3.transition()
    .duration(5000)
    .ease(d3.easeLinear);

    sankey = d3.sankey()
      .nodeId(function(d) { return d.name; })
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [sankey_width - 1, sankey_height - 1]]);

    sankey_links = sankey_svg.append("g")
    .attr("class", "links");

    sankey_nodes = sankey_svg.append("g")
    .attr("class", "nodes");

    sankey_formatNumber = d3.format(",");
    sankey_format = function(d) { return sankey_formatNumber(d); };

    // update Data
    startUpdateData()
    changeTeam()
});