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

//this just grabs the text from the preformatted block
//and parses it as if it was a csv file
//in your real code, you would use d3.csv(filename, callbackFunction) 
//and the rest would be inside your callback function:
var data = d3.csv.parse( d3.select("pre#data").text() );


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
    .attr("x", w - padding * 2)
    .attr("y", -6)
    .text("GF%")

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -30)
    .attr("dy", ".21em")
    .style("text-anchor", "end")
    .text("CF%");


  var circles = svg.selectAll("circles")
  .data(data)
  .enter().append("circle")
  .style("fill", "steelblue")
  .transition()
  .duration(300)
  .attr("cx", function(d) { return x(d.GFPerc); })
  .attr("cy", function(d) { return y(d.CFPerc); })
  .attr("r", function(d) { return r(d.PDO); })
  .style("opacity", .7)
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(d.Team + "<br/> (GF%: " + d.GFPerc
                 + ", CF%: " + d.CFPerc + ")")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });
