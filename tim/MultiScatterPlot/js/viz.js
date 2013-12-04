// D3 Highlight / Unhighlight Functions ====================================

  var highlightSameIp = function(d){
    d3.selectAll("svg").selectAll(".dot")
          .filter(function(d2){ return d2.Source_IP == d.Source_IP; })
          .attr('r', '7');
  }

  var unhighlightSameIp = function(d){
    d3.selectAll("svg").selectAll(".dot")
          .filter(function(d2){ return d2.Source_IP == d.Source_IP; })
          .attr('r', '1');
  }

  var highlightSame = function(d){
    d3.selectAll("svg").selectAll(".dot")
          .filter(function(d2){ return d2 == d; })
          .attr('r', '10')
          .style('fill', '#ff0000');
  }

  var unhighlightSame = function(d){
    d3.selectAll("svg").selectAll(".dot")
          .filter(function(d2){ return d2 == d; })
          .attr('r', '1')
          .style('fill', '#000000');
  }

  var highlightRoot = function(){
    d3.selectAll("svg").selectAll(".dot")
          .filter(function(d2){ return d2.Username === "root"; })
          .attr('r', '5')
          .style('fill', '#ffff00');
  }

// Tooltip ================================================================

  var showTooltip = function(d){
    tooltip.text("IP: " + d.Source_IP + ", Time: " + d.var1 + ", Username: " + d.Username);
    tooltip.style("visibility", "visible");
  }

  var updateTooltip = function(d){ 
    tooltip.text("IP: " + d.Source_IP + ", Time: " + d.var1 + ", Username: " + d.Username);
    tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX+10)+"px");
  }

  var hideTooltip = function(d){
    tooltip.style("visibility", "hidden");
  }

// D3 =====================================================================

var margin = {top: 30, right: 40, bottom: 40, left: 120, axis: 10},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.time.scale().range([0, width]);

var y = d3.scale.ordinal()
    .range([height, 0])
    .rangePoints([height-margin.axis, margin.axis]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

d3.csv("../data/saser_auth.csv", function(error, data) {
  data.forEach(function(d) {
    // VORSICHT: Jahr stimmt hierdurch nicht, zum testen okay...
    d.var1 = new Date(d.Time);
    d.var2 = d.Log_Message;
  });

  x.domain(d3.extent(data, function(d) { return d.var1; })).nice();
  y.domain(data.map(function(d){ return d.Log_Message; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Log Message")

  var dots = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 1)
      .attr("cx", function(d) { return x(d.var1); })
      .attr("cy", function(d) { return y(d.var2); })
      .on("mouseover", function(d){
        showTooltip(d);
        highlightSameIp(d);
        highlightSame(d);
      })
      .on("mousemove", function(d){
        updateTooltip(d);
      })
      .on("mouseout", function(d){
        unhighlightSame(d);
        unhighlightSameIp(d);
        hideTooltip();
        highlightRoot();
      });      

// #2 =====================================================================================

var x2 = d3.time.scale().range([0, width]);

var y2 = d3.scale.ordinal()
    .range([height, 0])
    .rangePoints([height-margin.axis, margin.axis]);

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left");

var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x2.domain(d3.extent(data, function(d) { return d.var1; })).nice();
  y2.domain(data.map(function(d){ return d.Source_IP; }));

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis2)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis2)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Source-IP")

  var dots2 = svg2.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 1)
      .attr("cx", function(d) { return x2(d.var1); })
      .attr("cy", function(d) { return y2(d.Source_IP); })
    .on("mouseover", function(d){
        showTooltip(d);
        highlightSameIp(d);
        highlightSame(d);
      })
      .on("mousemove", function(d){
        updateTooltip(d);
      })
      .on("mouseout", function(d){
        unhighlightSame(d);
        unhighlightSameIp(d);
        hideTooltip();
        highlightRoot();
      });

// #3 =====================================================================================

var width2 = 1200 - margin.left - margin.right;
var height2 = 400 - margin.top - margin.bottom;

var x3 = d3.time.scale().range([0, width]);

var y3 = d3.scale.ordinal()
    .range([height, 0])
    .rangePoints([height-margin.axis, margin.axis]);

var xAxis3 = d3.svg.axis()
    .scale(x3)
    .orient("bottom");

var yAxis3 = d3.svg.axis()
    .scale(y3)
    .orient("left");

var svg3 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x3.domain(d3.extent(data, function(d) { return d.var1; })).nice();
  y3.domain(data.map(function(d){ return d.Username; }));

  svg3.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis3)
    .append("text")
      .attr("class", "label")
      .attr("x", width2)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

  svg3.append("g")
      .attr("class", "y axis")
      //.call(yAxis3)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Username")

  var dots3 = svg3.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 1)
      .attr("cx", function(d) { return x3(d.var1); })
      .attr("cy", function(d) { return y3(d.Username); })
    .on("mouseover", function(d){
        showTooltip(d);
        highlightSameIp(d);
        highlightSame(d);
      })
      .on("mousemove", function(d){
        updateTooltip(d);
      })
      .on("mouseout", function(d){
        unhighlightSame(d);
        unhighlightSameIp(d);
        hideTooltip();
        highlightRoot();
      });

// #4 =====================================================================================

var x4 = d3.time.scale().range([0, width]);

var y4 = d3.scale.linear()
    .range([height, 0]);

var xAxis4 = d3.svg.axis()
    .scale(x4)
    .orient("bottom");

var yAxis4 = d3.svg.axis()
    .scale(y4)
    .orient("left");

var svg4 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x4.domain(d3.extent(data, function(d) { return d.var1; })).nice();
  y4.domain(d3.extent(data, function(d) { return d.Source_Port; })).nice();

  svg4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis4)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Time");

  svg4.append("g")
      .attr("class", "y axis")
      .call(yAxis4)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Source-Port")

  var dots4 = svg4.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 1)
      .attr("cx", function(d) { return x4(d.var1); })
      .attr("cy", function(d) { return y4(d.Source_Port); })
    .on("mouseover", function(d){
        showTooltip(d);
        highlightSameIp(d);
        highlightSame(d);
      })
      .on("mousemove", function(d){
        updateTooltip(d);
      })
      .on("mouseout", function(d){
        unhighlightSame(d);
        unhighlightSameIp(d);
        hideTooltip();
        highlightRoot();
      });

// Do some final stuff

highlightRoot();      
});
