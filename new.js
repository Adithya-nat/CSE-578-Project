

var stratify = d3.stratify()
    .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf("/")); });

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var color = d3.scaleMagma()
    .domain([-4, 4]);

// var stratify = d3.stratify()
//     .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var treemap = d3.treemap()
    .size([width, height])
    .paddingOuter(3)
    .paddingTop(19)
    .paddingInner(1)
    .round(true);



// var root = stratify(data)
//     .sum(function (d) { return d.value; })
//     .sort(function (a, b) { return b.height - a.height || b.value - a.value; });



function drawTreeMap(root, resize) {
    treemap(root);

    console.log(root.descendants())
    const cells = svg
    .selectAll(".node")
    .data(root.descendants());
    var cell = cells
        .enter().append("g")
        .attr("transform", function (d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
        .attr("class", "node")
        .each(function (d) { d.node = this; })
        .on("mouseover", hovered(true))
        .on("mouseout", hovered(false));

    cell.append("rect")
        .attr("id", function (d) { return "rect-" + d.id; })
        .attr("width", function (d) { return d.x1 - d.x0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .style("fill", function (d) { return color(d.depth); });

    if (resize == true) {
        console.log("true");
        d3.selectAll("rect")
        .exit()
        .style("opacity", 1e-6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .remove();

        // console.log("if");
        // d3.selectAll(".rect").exit().remove();

        // cell
        //     .attr("transform", d => `translate(${d.x0},${d.y0})`)
        //     .attr("width", d => d.x1 - d.x0)
        //     .attr("height", d => d.y1 - d.y0);
        // cell.enter().append("rect")
        //     .attr("class", "rect")
        //     .style("fill", (d) => {console.log("fill", d); color[d.parent.data.value];})
        //     .attr("transform", d => `translate(${d.x0},${d.y0})`)
        //     .attr("width", d => d.x1 - d.x0)
        //     .attr("height", d => d.y1 - d.y0)
        //     .style("opacity", 1e-6)
        //     .transition().duration(1000)
        //     .style("opacity", 1);
    } else {

        console.log("false");
        cell.append("clipPath")
            .attr("id", function (d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function (d) { return "#rect-" + d.id + ""; });

        var label = cell.append("text")
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; });

        label
            .filter(function (d) { return d.children; })
            .selectAll("tspan")
            .data(function (d) { return d.id.substring(d.id.lastIndexOf("/") + 1).split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + format(d.value)); })
            .enter().append("tspan")
            .attr("x", function (d, i) { return i ? null : 4; })
            .attr("y", 13)
            .text(function (d) { return d; });

        label
            .filter(function (d) { return !d.children; })
            .selectAll("tspan")
            .data(function (d) { return d.id.substring(d.id.lastIndexOf("/") + 1).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)); })
            .enter().append("tspan")
            .attr("x", 4)
            .attr("y", function (d, i) { return 13 + i * 10; })
            .text(function (d) { return d; });

        cell.append("title")
            .text(function (d) { return d.id + "\n" + format(d.value); });
    }


    function hovered(hover) {
        return function (d) {
            d3.selectAll(d.ancestors().map(function (d) { return d.node; }))
                .classed("node--hover", hover)
                .select("rect")
                .attr("width", function (d) { return d.x1 - d.x0 - hover; })
                .attr("height", function (d) { return d.y1 - d.y0 - hover; });
        };
    }
}

function hovered(hover) {
    return function (d) {
        d3.selectAll(d.ancestors().map(function (d) { return d.node; }))
            .classed("node--hover", hover)
            .select("rect")
            .attr("width", function (d) { return d.x1 - d.x0 - hover; })
            .attr("height", function (d) { return d.y1 - d.y0 - hover; });
    };
}

d3.csv("data/sample2.csv", function (error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function (d) { return d.value; })
        .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

    drawTreeMap(root, false);
});

d3.interval(_ => { }, 2000);

// d3.csv("data/sample.csv", function (error, data) {
//     if (error) throw error;

//     var root = stratify(data)
//         .sum(function (d) { return d.value; })
//         .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

//     drawTreeMap(root, true);
// });
document.addEventListener('DOMContentLoaded', async function () {
    setTimeout(() => {
        console.log("changing");
        d3.csv("data/sample.csv", function (error, data) {
            if (error) throw error;

            console.log("timeout data");

            var root = stratify(data)
                .sum(function (d) { return d.value; })
                .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

            drawTreeMap(root, true);
        });
    }, 10000)
})



let count = 0;

// d3.interval(_ => {
//     // root = d3.hierarchy(makeData())
//     //   .sum(d => d.value)
//     //   .sort((a, b) => b.value - a.value);

//     if (count % 2 == 0) {
//         d3.csv("data/sample.csv", function (error, data) {
//             if (error) throw error;

//             var root = stratify(data)
//                 .sum(function (d) { return d.value; })
//                 .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

//             drawTreeMap(root, true);
//         });
//     }
//     else {
//         d3.csv("data/sample2.csv", function (error, data) {
//             if (error) throw error;

//             var root = stratify(data)
//                 .sum(function (d) { return d.value; })
//                 .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

//             drawTreeMap(root, true);
//         });
//     }
//     count++;
// }, 2000);



