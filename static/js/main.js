var isAggregated = false;
var team = 1;
var host = "all";
var team_hosts = [];
var start_minute = 88;
var current_minute = start_minute;
var end_minute = start_minute+120;
var duration = 3000;

var tooltip;

const $ = (id) => document.getElementById(id)
const getTextWidth = () => {
    const text = document.createElement("span");
    document.body.appendChild(text);
    // text.style.font = "times new roman";
    // text.style.fontSize = 16 + "px";
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = 'Hello World';

    return Math.ceil(text.clientWidth)
};



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
    url = "getTeamData?team="+team
    let response = await fetch(url);
    let data = await response.json();
    team_hosts = data["host"]
    generateHostDropDown();
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

    console.log("word cloud data", data["wordcloud"]["aggregated"].length);
    if(data["wordcloud"]["aggregated"].length == 0 || data["wordcloud"]["aggregated"].length == 0) {
        console.log("No data");
        document.getElementById('wc_no_data').style.display = 'block';
    }
    else {
        document.getElementById('wc_no_data').style.display = 'none';
    }

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
        drawStackedChart(data["stackedBar"])

    }
    updatePlaySlider();
    tooltip
        .style("opacity", 0);
}

window.addEventListener('load', function () {

    tooltip  = d3.select("body")
            .append("span")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute");

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
    sankey_format = function(d) { return sankey_formatNumber(d); }

    // update Data
    startUpdateData()
    changeTeam()
});