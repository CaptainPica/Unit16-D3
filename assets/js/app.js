// @TODO: YOUR CODE HERE!

var margins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

// The make responsive functionality is taken directly from the practices as there isn't really
// anything to be done to it.
// It only encases the graph making code I wrote in a function and then calls it when the window is resized.
// Except for the part it removes the old svg first if it exists. That part is neat.
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    // my code starts here. 
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
    // console.log(svgHeight)

    var height = svgHeight-margins.top-margins.bottom;
    var width = svgWidth-margins.left-margins.right;

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height",svgHeight)
        .attr("width",svgWidth);

    var chartGroup = svg.append("g")
        .attr("transfrom", `translate(${margins.left},${margins.top})`)
        .classed("preventMeddling",true);

    // Label Group added to prevent the selector that adds text from picking up
    // the text tags in the labels.
    // Adds the labels
    var labelGroup = chartGroup.append("g")

    var yLabel = labelGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("y",margins.left/3)
    .attr("x",-height/2)
    .style("font-size","1.5rem")
    .style("text-anchor","middle")
    .text("Obesity (%)");

    var xLabel = labelGroup.append("text")
    .attr("transform",`translate(${svgWidth/2},${svgHeight-margins.bottom})`)
    .style("font-size","1.5rem")
    .style("text-anchor","middle")
    .text("Poverty (%)");

    d3.csv("assets/data/data.csv").then((data)=> {
        // Prevents orbs from going over boundaries of graph
        xDomain = d3.extent(data, d => parseFloat(d.poverty));
        xDomain[0] *= .98;
        xDomain[1] *= 1.02;

        yDomain = d3.extent(data, d => parseFloat(d.obesity)).reverse();
        yDomain[1] *= .98;
        yDomain[0] *= 1.02;

        // Sets the scaling functions

        var xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([margins.left,width+margins.left]);
        var yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([margins.top,height]);

        // Makes axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
        chartGroup.append("g")
            .attr("transform",`translate(${margins.left},0)`)
            .call(yAxis);
        // console.log(d3.extent(data,d => parseFloat(d.poverty)))
        // data.forEach(element => {
        //     console.log([yScale(element.poverty),element.smokes])
        // });

        // Makes circles and labels.
        var stateCircles = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.obesity))
            .attr("r","10")
            .attr("fill", "silver")
            .attr("stroke", "black");
        // The additional class is required to ignore the text tags added in the axes
        // Alternatively, the axes can be added after, same with labels.
        var stateText = chartGroup.selectAll(".preventMeddling > text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.obesity)+5)
            .attr("textLength",13)
            .attr("lengthAdjust","spacingAndGlyphs")
            .style("text-anchor","middle")
            .text(d => d.abbr)
    });
};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);