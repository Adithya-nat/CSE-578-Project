var isAggregated = false;
var team = 1;
var host = "all";
var team_hosts = [];
var start_minute = 88;
var current_minute = start_minute;
var end_minute = start_minute+120;
var duration = 3000;
let teamChange = false;

var tooltip;

const getTextWidth = () => {
    const text = document.createElement("span");
    document.body.appendChild(text);
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
    teamChange = true;
    team = document.getElementById("team").value;
    url = "getTeamData?team="+team
    let response = await fetch(url);
    let data = await response.json();
    team_hosts = data["host"];
    //resetStackChart();
    generateHostDropDown();
    updateData()
    teamChange=false;
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
        if(teamChange) {
            drawStackedChart(data["stackedBar"], true)
        }
        else {
           drawStackedChart(data["stackedBar"], false);
        }


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

    // //treemap
    // d3.json("js/countries_1.json", function(err, res) {
    //     if (!err) {
    // //         let data = [{"name": "t1-prod-memcache-13/", "count": "7"}, {"name": "t1-prod-memcache-13/bin/dash", "count": "1"}, {"name": "t1-prod-memcache-13/bin/journalctl", "count": "1"}, {"name": "t1-prod-memcache-13/dev/shm/BjFV26", "count": "1"}, {"name": "t1-prod-memcache-13/dev/shm/byRXuf", "count": "1"}, {"name": "t1-prod-memcache-13/dev/shm/wu3TAY", "count": "1"}, {"name": "t1-prod-memcache-13/lib/modules/4.15.0-1023-gcp/modules.alias.bin", "count": "1"}, {"name": "t1-prod-memcache-13/lib/modules/4.15.0-1023-gcp/modules.builtin.bin", "count": "1"}, {"name": "t1-prod-memcache-13/lib/modules/4.15.0-1023-gcp/modules.dep.bin", "count": "1"}, {"name": "t1-prod-memcache-13/lib/modules/4.15.0-1023-gcp/modules.symbols.bin", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/libsystemd-shared-237.so", "count": "3"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd-journald", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd-logind", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd-networkd", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd-resolved", "count": "1"}, {"name": "t1-prod-memcache-13/lib/systemd/systemd-udevd", "count": "1"}, {"name": "t1-prod-memcache-13/lib/udev/hwdb.bin", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/ld-2.27.so", "count": "7"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libacl.so.1.1.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libapparmor.so.1.4.2", "count": "2"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libattr.so.1.1.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libaudit.so.1.0.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libblkid.so.1.1.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libbz2.so.1.0.4", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libc-2.27.so", "count": "7"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libcap-ng.so.0.0.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libcap.so.2.25", "count": "4"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libcom_err.so.2.1", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libcrypt-2.27.so", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libcryptsetup.so.12.2.0", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libdbus-1.so.3.19.4", "count": "2"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libdevmapper.so.1.02.1", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libdl-2.27.so", "count": "7"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libexpat.so.1.6.7", "count": "2"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libfuse.so.2.9.7", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libgcc_s.so.1", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libgcrypt.so.20.2.1", "count": "5"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libgpg-error.so.0.22.0", "count": "5"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libidn.so.11.6.16", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libjson-c.so.3.0.1", "count": "3"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libkeyutils.so.1.5", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libkmod.so.2.3.2", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/liblzma.so.5.2.2", "count": "5"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libm-2.27.so", "count": "4"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libmnl.so.0.2.0", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libmount.so.1.1.0", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libncursesw.so.5.9", "count": "1"}, {"name": "t1-prod-memcache-13/lib/x86_64-linux-gnu/libnsl-2.27.so", "count": "7"}]
    //         var data = d3.nest().key(function(d) { return d.region; }).key(function(d) { return d.subregion; }).entries(res);
    //         console.log("the below is the treemap data");
    //         console.log(data)
    //         draw_treemap({title: "World Population"}, {key: "World", values: data});
    //         // update(data)
    //    }
    // });

    // update Data
    startUpdateData()
    changeTeam()
});