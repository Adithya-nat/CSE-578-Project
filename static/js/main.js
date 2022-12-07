var isAggregated = false;
var team = 1;
var host = "all";
var team_hosts = [];
var start_minute = 88;
var current_minute = start_minute;
var end_minute = start_minute+120;
var duration = 3000;
const $ = (id) => document.getElementById(id)

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
        drawStackedChart(data["stackedBar"])

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