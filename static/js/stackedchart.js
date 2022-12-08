// d3.csv("data.csv").then(d => chart(d))
let redrawStackedChart = null;
let sortData = false;
function stacked_chart(csv, svgEl, margin, allhosts, allstatus, allstatuscolor, X, canSort, z) {

    const ydomain = allstatus;

    // const year = [...new Set(csv.map(d => d.Year))];
    const xdomain = allhosts

    // const options = d3.select("#year").selectAll("option")
    //     .data(year)
    //     .enter().append("option")
    //     .text(d => d);

    const svg = d3.select(svgEl);
    const bBox = svg.node().getBoundingClientRect();
    const width = +bBox.width - margin.left - margin.right;
    const height = +bBox.height - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")

    const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis");

    // const z = d3.scaleOrdinal()
    //     .range(allstatuscolor)
    //     .domain(ydomain);



    const update = function (data, speed) {

        // const data = data1.filter(f => f.Year === input);

        data.forEach(function (d) {
            d.total = d3.sum(ydomain, k => +d[k])
            return d
        })

        const sumallcols = d => d3.sum(ydomain, k => +d[k]);
        y.domain([0, d3.max(data, sumallcols)]).nice();

        svg.selectAll(".y-axis").transition().duration(speed)
            .call(d3.axisLeft(y)
                .tickFormat(d => {
                    if (d / 1000000 >= 1) {
                        return d / 1000000 + " M"
                    } else if (d / 1000 >= 1) {
                        return d / 1000 + " K"
                    } else {
                        return d;
                    }
                })
                .ticks(null, "s")
            )


        data.sort(canSort
            ? (a, b) => b.total - a.total
            : (a, b) => 0)

        x.domain(data.map(d => d[X]));

        svg.selectAll(".x-axis").transition().duration(speed)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const group = svg.selectAll("g.layer")
            .data(d3.stack().keys(ydomain)(data), d => d.key);

        group.exit().remove()

        group.enter().append("g")
            .classed("layer", true)
            .attr("fill", d => z(parseInt(d.key)));

        const bars = svg.selectAll("g.layer").selectAll("rect")
            .data(d => d, e => e.data[X]);

        bars.exit().remove()

        bars.enter().append("rect")
            .merge(bars)
            .merge(bars)
            .transition().duration(speed)
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.data[X]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))

        svg.selectAll("rect")
            .on("mouseover", function(d) {
                console.log("mouseover", d);
                const key = d3.select(this.parentNode).datum().key;
                console.log("stack", key, d.data[key]);
            tooltip.html(`Subject:  ${d.data["dest_ip"]} <br>
               Response status: ${key} <br> Number of requests: ${d.data[key]}`)
                .style('top', `${d3.event.pageY}px`)
                .style('left', `${d3.event.pageX}px`).style("opacity", 1);
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

        const text = svg.selectAll(".text")
            .data(data, d => d[X]);

        text.exit().remove()

        text.enter().append("text")
            .attr("class", "text")
            .attr("text-anchor", "middle")
            .merge(text)
            .transition().duration(speed)
            .attr("x", d => x(d[X]) + x.bandwidth() / 2)
            .attr("y", d => y(d.total) - 5)
            .text(d => d.total)
    }


    // update(csv, 1000)

    // const select = d3.select("#year")
    //     .on("change", function () {
    //         update(this.value, 750)
    //     });
    //
    // const checkbox = d3.select("#sort")
    //     .on("click", function () {
    //         update(select.property("value"), 750)
    //     });
    return update
}


drawStackedChart = (data, reset) => {
    const margin = {
        top: 60,
        bottom: 20,
        left: 20,
        right: 0
    }
    let hosts = data.hosts;
    let status = data.status;
    let chart_data = data.data;
    if(!redrawStackedChart || reset) {
        let allstatuscolor = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#3366cc","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];
        let domain = d3.ticks(0, 600, 6);
        let range = ["black", "blue", "green", "purple", "yellow", "red"];
        let z = d3.scaleLinear()
            .domain(domain)
            .range(range)

        let svgEl = $("svg-3");
        if (!redrawStackedChart) {
            drawStackedBarLegend(svgEl, domain, range)
        }

        redrawStackedChart = stacked_chart(chart_data, svgEl, margin, hosts, status, [], "dest_ip", sortData, z)

    }
    redrawStackedChart(chart_data, 1000)
}

function sortSwitchChange(value) {
    const temp = $("flexSwitchCheckChecked");
    console.log("switch value", value, temp);
    sortData = value;
}

drawStackedBarLegend = (svgEl, domain, range) => {

    const linear = d3.scaleOrdinal()
        .domain(domain)
        .range(range);

    const svg = d3.select(svgEl)

    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

    var legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells(domain)
        .orient('horizontal')
        .scale(linear);

    svg.select(".legendLinear")
        .call(legendLinear);


}