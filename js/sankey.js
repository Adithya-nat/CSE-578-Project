var sankey_svg, sankey_width, sankey_height, sankey_color, sankey_t, sankey, sankey_links, sankey_nodes, sankey_formatNumber, sankey_format;

function updateSankey(graph) {
    var link = sankey_links.selectAll("path")
        .data(graph.links, function(d) { return d; });

    var linkEnter = link.enter().append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("class", "link")
      .attr("stroke-width", function(d) { return Math.max(1, d.width); });

    link.transition(sankey_t)
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); });

    linkEnter.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + sankey_format(d.value); });

    link.exit().remove();

    var node = sankey_nodes.selectAll("g")
      .data(graph.nodes, function(d) { return d.name; });

    var nodeEnter = node.enter().append("g");

    nodeEnter.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return sankey_color(d.name.replace(/ .*/, "")); });

    node.select("rect").transition(sankey_t)
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; });

    nodeEnter.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .text(function(d) { return d.name; })
      .filter(function(d) { return d.x0 < sankey_width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    node.select("text").transition(sankey_t)
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .filter(function(d) { return d.x0 < sankey_width / 2; })
      .attr("text-anchor", "start");

    nodeEnter.append("title")
        .text(function(d) { return d.name + "\n" + sankey_format(d.value); });

    node.select("title")
        .text(function(d) { return d.name + "\n" + sankey_format(d.value); });

    node.exit().remove();
}

function updateSankeyData(data) {
    sankey
      .nodes(data.nodes)
      .links(data.links);

    updateSankey(sankey());

    sankey_t = d3.transition()
    .duration(3000)
    .ease(d3.easeCubicIn);
}