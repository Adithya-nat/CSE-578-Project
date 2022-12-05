// set the dimensions and margins of the graph
function dropDown(event) {
  event.target.parentElement.children[1].classList.remove("d-none");
  document.getElementById("overlay").classList.remove("d-none");
}
function hide(event) {
  var items = document.getElementsByClassName('menu');
  for (let i = 0; i < items.length; i++) {
      items[i].classList.add("d-none");
  }
  document.getElementById("overlay").classList.add("d-none");
}


document.addEventListener('DOMContentLoaded', async function () {
  const margin = { top: 30, right: 30, bottom: 30, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#left-top-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // get the data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv").then(function (data) {

    // add the x Axis
    const x = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // add the y Axis
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 0.01]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Compute kernel density estimation
    let kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
    let density = kde(data.map(function (d) { return d.price; }))

    // Plot the area
    const curve = svg
      .append('g')
      .append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      );

    // A function that update the chart when slider is moved?
    function updateChart(binNumber) {
      // recompute density estimation
      kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(binNumber))
      density = kde(data.map(function (d) { return d.price; }))


      // update the chart
      curve
        .datum(density)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .curve(d3.curveBasis)
          .x(function (d) { return x(d[0]); })
          .y(function (d) { return y(d[1]); })
        );
    }

    // Listen to the slider?
    d3.select("#mySlider").on("change", function (d) {
      selectedValue = this.value
      updateChart(selectedValue)
    })

  });


  // Function to compute density
  function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function (v) { return kernel(x - v); })];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }

  // const margin = { top: 10, right: 30, bottom: 20, left: 50 },
  //   width = 460 - margin.left - margin.right,
  //   height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg2 = d3.select("#right-top-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv").then(function (data) {

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => (d.group))

    // Add X axis
    const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
    svg2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 60])
      .range([height, 0]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c', '#377eb8', '#4daf4a'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
      .keys(subgroups)
      (data)

    // Show the bars
    svg2.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.group))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
  })
})
