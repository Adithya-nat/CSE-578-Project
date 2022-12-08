var myWordCloud, scalingFactor;

function wordCloud(selector) {
    var wordcloud_fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var wordcloud_svg = d3.select("#word_cloud_svg")
        .append("g")
        .attr("transform", "translate(275,290)");



    //Draw the word cloud
    function draw(words) {
        var cloud = wordcloud_svg.selectAll("g text")
            .data(words, function(d) { return d.text; })




        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return wordcloud_fill(i); })
            .attr("text-anchor", "middle")
            .attr("font-size", 1)
            .text(function(d) { return d.text; })
            .on("mouseover", function(d) {
                console.log("mouseover", d);
                tooltip
                    .html("Word : " + d.text + "<br/>" + "Count : " + Math.floor(d.size*scalingFactor))
                    .style("opacity", 1);
            })
            .on("mouseout", function() {
                tooltip
                    .style("opacity", 0);
            })
            .on("mousemove", function(event, d) {
                console.log("event", `${d3.event.pageY}px`);
                tooltip
                    .style("left",(d3.event.pageX+5)+"px")
                    .style("top",(d3.event.pageY-5)+"px")
            });

        //Entering and existing words
        cloud
            .transition()
            .duration(600)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
            .duration(200)
            .style("fill-opacity", 1e-6)
            .attr("font-size", 1)
            .remove();
    }


    function getScalingFactor(words){
        maxi = Math.max(...words.map(x => x.size))
        return 200 / maxi
    }

    return {
        update: function(words) {
            scalingFactor = getScalingFactor(words)
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size * scalingFactor; })
                .on("end", draw)
                .start();
        }
    }
}

function generateHostDropDown(){
    var html = "<option value='all'>All</option>";
    for(let h of team_hosts){
        html += "<option value="+h+">"+h+"</option>";
    }
    document.getElementById("host").innerHTML = html;
}

function changeHost(){
    host = document.getElementById("host").value;
    updateData()
    console.log(host)
}

function updateWordCloudData(data){
    myWordCloud.update(data);
}