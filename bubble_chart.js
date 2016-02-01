//Width and height
var w = 1000;
var h = 500;
var padding = 30;

var svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.append("g")
.attr("transform", "translate(" + padding + ",0)");

var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);


var data = d3.csv.parse( d3.select("pre#data").text() );
//this just grabs the text from the preformatted block
//and parses it as if it was a csv file
//in your real code, you would use d3.csv(filename, callbackFunction) 
//and the rest would be inside your callback function:

  data.forEach(function(d) {
    d.Team = d.Team;
    d.Rank = +d.Rank;
    d.GP = +d.GP;
    d.GF = +d.GF;
    d.GA = +d.GA;   
    d.GF60 = +d.GF60;
    d.GA60 = +d.GA60;
    d.GFPerc = +d.GFPerc;
    d.CF = +d.CF;
    d.CA = +d.CA;
    d.CF60 = +d.CF60;
    d.CA60 = +d.CA60;
    d.CFPerc = +d.CFPerc;
    d.Sh = +d.Sh;
    d.Sv = +d.Sv;
    d.PDO = +d.PDO;
    d.CSh = +d.CSh;
    d.CSv = +d.CSv;
    d.CPDO = +d.CPDO;
    d.NZFO = +d.NZFO;
    d.DZFO = +d.DZFO;
    d.O9ZFO = +d.OZFO;
  });


  //WE MAY NEED TO MOVE THE X SCALE OVER PADDING(30) UNITS BECAUSE WE TRANSFORMED THE GROUPED TAG OVER 30 UNITS TO ADD SOME MARGIN

  var x = d3.scale.linear()
  .domain([d3.min(data, function(d) { return d.GFPerc; }), d3.max(data, function(d) { return d.GFPerc; })])
  .range([padding, w - padding * 2]);


  var y = d3.scale.linear()

  .domain([d3.min(data, function(d) { return d.CFPerc;}), d3.max(data, function(d) { return d.CFPerc; })])
  .range([h - padding, padding]);

  var r = d3.scale.linear()
  .domain([95,105])
  .range([2,10]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(15);

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  //.ticks(10);
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .append("text")
    .style("text-anchor", "end")
    .attr("x", w - padding * 2 - 5)
    .attr("y", -6)
    .text("GF%")

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -35)
    .attr("dy", ".21em")
    .style("text-anchor", "end")
    .text("CF%");

console.log(d3.min(data, function(d) {
	return d.CFPerc;
}));

console.log(d3.min(data, function(d) {
	return d.GFPerc;
}));


	
svg.selectAll(".h").data(d3.range(
		d3.round(d3.min(data, function(d) { 
    	return d.CFPerc; })) + 1, 
    d3.round(d3.max(data, function(d) { 
    	return d.CFPerc; })) + 1 ))
  .enter()
  .append("line").classed("h",1)
  .attr("x1", padding).attr("x2", w - padding * 2)
  .attr("y1",y).attr("y2",y);
  
svg.selectAll(".v").data(d3.range(
		d3.round(d3.min(data, function(d) { 
    	return d.GFPerc; })) + 1, 
    d3.round(d3.max(data, function(d) { 
    	return d.GFPerc; })) + 1 ))
  .enter()
  .append("line").classed("v",1)
  .attr("y1",padding).attr("y2",h-padding)
  .attr("x1",x).attr("x2",x);
  



var circles = svg.selectAll("circles")
  .data(data)
  .enter().append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) { return x(0); })
    .attr("cy", function(d) { return y(0); })
    .attr("r", function(d) { return r(0); })
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .8);
      tooltip.html("<strong>" + d.Team + 
      						"</strong><br>(GF%: " + d.GFPerc
                   + ", CF%: " + d.CFPerc + ")")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      circles.style("fill", "gray");
      d3.select(this).style("fill", "red");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
     	//circles.attr("class", "circle");
      circles.style("fill", "steelblue");
    });


circles
	.transition()
  .delay(function(d,i) { return i * 50; })
  .duration(1000)
  .attr("cx", function(d) { return x(d.GFPerc); })
  .attr("cy", function(d) { return y(d.CFPerc); })
  .attr("r", function(d) { return r(d.PDO); })



