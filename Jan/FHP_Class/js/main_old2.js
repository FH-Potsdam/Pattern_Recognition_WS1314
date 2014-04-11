 $(document).ready(function(){
                                                        
                                    d3.csv("git.csv", function(data){
                												
                						var width = 580, height = 700;
                						var overview_rect = 600;
                						var lines_per_pixel = data.length/overview_rect;
                						//var format = d3.time.format("%y.%m.%d %H:%M"); //01.08.18 06:26
                						var format = d3.time.format("%b %d %H:%M"); //01.08.18 06:26
                						
                						var diagonal = d3.svg.diagonal()
                    						.projection(function(d) { return [d.y, d.x]; });
                												
                						var ytime = d3.time.scale().range([20, 20+overview_rect])
                							.domain(d3.extent(data, function(d) { return format.parse(d.Time); }));
                							
                						//var hour_ticks = ytime.ticks(d3.time.hours, 1);
                						var hour_ticks = ytime.ticks(d3.time.hours, 1);
                						var IP_frequency; 
										var user_frequency;
										var country_frequency;
										var source_port_frequency;
										var IP_to_country = [];
										var IP_nodes = [];
                    					var IP_links = [];
                    					var country_nodes = [];
                    					var country_links = [];
										var user_nodes = [];
                    					var user_links = [];
										var source_port_nodes = [];
                    					var source_port_links = [];
                    					var outgoing_links = [];
                    					var connections = {};

										
										var svg = d3.select("body")
                							.append("svg")
                							.attr("width", width)
                							.attr("height", height)
                							.classed("canvas", true); 
										
										
                						data.forEach(function(d,i) {
                							var first_set = false;
                							d.id = i+1;
                							for (var j=0; j < hour_ticks.length; j++) {
												//console.log(format.parse(d.Time) - hour_ticks[j]);
                								if (format.parse(d.Time) - hour_ticks[j] === 0) {
                									if (first_set === false) {
                										hour_ticks[j].value = hour_ticks[j];
                										hour_ticks[j].id = i;
                										first_set = true;
                									}
                								} 
                							}
                							
                						});

                						//console.log(format.parse(data[9668].Time) - hour_ticks[3]);
										
										var y = d3.scale.linear().range([20, 20+overview_rect])
                							.domain(d3.extent(data.map(function(d) { return +d.id; })));
										
										IP_frequency = calculateFrequencyAndLinks(data, "SourceIP");
										calculateNodeLinkPositions(IP_frequency, "SourceIP", IP_nodes, IP_links, 100, 188);
										getCountries(IP_frequency, "SourceIP");
										
										user_frequency = calculateFrequencyAndLinks(data, "Username");
										calculateNodeLinkPositions(user_frequency, "Username", user_nodes, user_links, 431, 318);

                						
                						var nest = d3.nest()
                    								.key(function(d,i) { return Math.round(+d.id/lines_per_pixel); })
                    								.entries(data);
                									
                						nest.forEach(function(d) {
                							d.markcount = 0;
                							d.values.forEach(function(e){
                								e.Time = format.parse(e.Time);
                								e.marked = false;
                							});
                						});	
																					
										var container_xpos = 190
											time_container_xpos = container_xpos + 101,
											timelines_xpos = time_container_xpos + 30;
											
										var brush = d3.svg.brush()
											.y(y)
											.extent([0, 300])
											.on("brush", brushmove);
											
										var container = svg.append("rect")
											.attr("width", 100)
											.attr("height", overview_rect)
											.attr("x", container_xpos)
											.attr("y", 20)
											.style("fill", "#2D2D2D");

										var time_container = svg.append("rect")
											.attr("width", 25)
											.attr("height", overview_rect)
											.attr("x", time_container_xpos)
											.attr("y", 20)
											.style("fill", "#474747");
											
										var time_lines = svg.selectAll(".time_line")
											.data(hour_ticks)
											.enter()
											.append("g")
											.attr("class", "time_line")
											.on("mousemove", function(d){
												visibilityText(this, "time_line_text_select");
											}).on("mouseout", function(d){
												visibilityText(this, "time_line_text");
											});

										time_lines.append("rect")
											.attr("width", 10)
											.attr("height", 1)
											.attr("x", time_container_xpos)
											.attr("y", function(d, i){
												return y(+d.id);
											}).attr("opacity", 0.5);
											
										time_lines.append("text")
											.text(function(d){
												return format(d.value).substring(0, 14);
											}).attr("text-anchor", "start")
											.attr("x", timelines_xpos)
											.attr("y", function(d){
												return y(+d.id) + 2;
											}).attr("class", "time_line_text");
											
										var log_lines = svg.selectAll(".log_line")
											.data(nest)
											.enter()
											.append("rect")
											.attr("width", 100)
											.attr("height", 1)
											.attr("x", container_xpos)
											.attr("y", function(d, i){
												return 20 + i;
											}).attr("class", function(d){
												var temp = false;
												d.values.forEach(function(e, j){
													if (e.marked == true) {
														temp = true;
													}
												});
												if (temp == true) {
													return "log_line highlight";
												}
												else {
													return "log_line no_highlight";
												}
											});

										//console.log(hour_ticks);
											
										var brushg = svg.append("g")
											.attr("class", "brush")
											.call(brush)
											.selectAll("rect")
											.attr("x", container_xpos)
											.attr("width", 100);
											
										var detail = d3.select("body")
											.append("div")
											.attr("width", 700)
											.classed("detail", true)
											.append("p").classed("detail_text", true);

										var detail_headline = d3.select("body")
											.append("h1")
											.text("Current selection")
											.style("top", "30px")
											.style("left", "650px");

										var selection = d3.select("body")
											.append("div")
											.attr("width", 700)
											.classed("selection", true)
											.append("p").classed("selection_text", true);

										var search_headline = d3.select("body")
											.append("h1")
											.text("Search")
											.style("top", "280px")
											.style("left", "650px");

									
										$('#suchen').click(findOccurrences);
										$("#find_occurences").bind("click", function() {
                							var selected_text = getSelectionText();
                							$("#regex").val(selected_text);
                							$('#suchen').click(findOccurrences());
                						});
										

										function getCountries(_frequency, attribute) {
											
											var fLength = 0;
											
											for (var k in _frequency) {
												fLength++;
												IP_to_country.push({SourceIP:k});
											}
											
											IP_to_country.forEach(function(d,i) {
												getCountryFromIP(d.SourceIP, i, fLength, function(location) {
													IP_to_country[i].country = location.country_name;
												});
											});
											
										}
										
										
										function calculateNodeLinkPositions(_frequency, attribute, _nodes, _links, nodes_xpos, children_xpos) {
											
											var l = 0;
											var fLength = 0;
											var temp_string = attribute;
											
											for (var i in _frequency) {
												fLength++;
											}
											
											for (attribute in _frequency) {
												//console.log(temp_string);
												_frequency[attribute].x = nodes_xpos;
												_frequency[attribute].y = 50+(overview_rect-20)/fLength*l;
												_frequency[attribute][temp_string] = Object.keys(_frequency)[l];
												_nodes.push(_frequency[attribute]);
												_frequency[attribute].children.forEach(function(e,j) {
													e.x = children_xpos;
                									e.y = 20+overview_rect/data.length*e.id;
                            
                            						var a = {x:e.y, y:e.x};
                            						var b = {x:_frequency[attribute].y, y:_frequency[attribute].x};
													var temp = {};
													temp[temp_string] = _frequency[attribute][temp_string];
													temp.id = e.id;
													temp.source = b;
													temp.target = a;
													_links.push(temp);
												});
												l++;
											}
																						
										}


										function aggregateDuplicates(_value, _attribute) {

											if (_value) {
												if (_attribute === "Username") {
													if (_value.toLowerCase().indexOf("invalid user") !== -1) {
														return "invalid user";
													} else {
														return _value;
													}
												} else if (_attribute === "SourceIP") {
													return _value;
												} else if (_attribute === "Country") {
													return _value;
												}
											}

										}


                						function calculateFrequencyAndLinks(array, attribute) {
											
											var frequency_new = {};
											var value;
											
											for (var i = 0; i < array.length; i++) {
												//console.log(array[i]);
												value = aggregateDuplicates(array[i][attribute], attribute);
												if (value in frequency_new) {
													frequency_new[value].count++;
													frequency_new[value].children.push({id: array[i].id});
												} else {
													frequency_new[value] = {count:1, children:[{id: array[i].id}]};
												}
											}
											
											return frequency_new;
										}
												
																	
										function BuildOutgoingConnections(attribute, _nodes, _links, side){

											var self = this;
											var att = attribute;
											this._att = att;

											this.link = svg.selectAll(".link_" + att)
												.data(_links)
												.enter()
												.append("path")
												.attr("class", "link_" + att + " hidden")
												.attr("d", diagonal);
											
											this.circle_and_text = svg.selectAll(".circle_and_text_" + att)
												.data(_nodes)
												.enter()
												.append("g")
												.attr("class", "circle_and_text_" + att);

											this.circle_text = this.circle_and_text
												.append("text")
												.attr("x", function(d) {
													if (side === "left") {
														return d.x - 90;
													} else {
														return d.x + 15;
													}
												}).attr("y", function(d){
													return d.y + 4
												}).text(function(d,i){
													if (d.country !== undefined) {
														return d.country.substring(0, 25);
													} else {
														return d[att].substring(0, 25); 
													}
												}).attr("class", "circle_text_" + att);
											
											this.circle = this.circle_and_text
												.append("circle")
												.attr("cx", function(d){
													return d.x
												}).attr("cy", function(d){
													return d.y
												}).attr("r", function(d) {
													return 2+Math.log(d.count);
												})
												.attr("class", "circle_" + att)
												.on("click", function(d){
													console.log(att);
													buildIncomingConnections(d.children, attribute);
													//console.log(self.link);
													self.link.transition()
													.attr("class", function(e){
														if (e[att] === d[att]) {
															return "link_" + att + " visible";
														}
														else {
															return "link_" + att + " hidden";
														}
													});
												});
										}


										function buildIncomingConnections(_children, _att) {
											
											var other_att;
											if (_att === "Country") {
												other_att = "Username";
											} else {
												other_att = "Country";
											}
											connections[other_att].link.attr("class", function(c) { //nur mit Umweg über die id möglich 
												isVisible = _children.some(function(element) {
													return (c.id === element.id);
												});

												if (isVisible === true) {
													return "link_" + _att + " visible";
												} else {
													return "link_" + _att + " hidden";
												}
											});

										}


										function buildBrushConnections(_begin, _end) {

											connections["Country"].link.attr("class", function(c, j) {
												if ((c.id >= _begin) && (c.id <= _end)) {
													return "link_" + "Country" + " visible";
												} else {
													return "link_" + "Country" + " hidden";
												}	
											});

											connections["Username"].link.attr("class", function(c, j) {
												if ((c.id >= _begin) && (c.id <= _end)) {
													return "link_" + "Username" + " visible";
												} else {
													return "link_" + "Username" + " hidden";
												}	
											});
											
										}
                							
                						
                						function brushmove() {

                							//console.log(IP_links); //d3.select(this).data()[0].index
                							begin = Math.round(brush.extent()[0]);
                							end = Math.round(brush.extent()[1]);
                							$(".detail_text").text("");
                							
                							for(var i = begin;i < end; i++) {
                								var temp = $("#regex").val().toLowerCase();
                								if (data[i].LogMessage.toLowerCase().indexOf(temp) !== -1) {
                									$(".detail_text").append(data[i].Time + "  " + data[i].Username + "  " + data[i].SourceIP + "  " + data[i].LogMessage.toLowerCase().replace(temp, "<span>"+temp+"</span>")+"<BR>");
                								} else {
                									$(".detail_text").append(data[i].Time + "  " + data[i].Username + "  " + data[i].SourceIP + "  " + data[i].LogMessage+"<BR>");
                								}
                							}
                							buildBrushConnections(begin, end);

                						}


                						function visibilityText(selected, classname) {

                							d3.select(selected)
                								.select("text")
                								.transition(1000)
                								.attr("class", classname);

                						}


                						function searchColumn(topelement, element, column) {

                							if (element[column]) {
                								if (element[column].toLowerCase().indexOf($("#regex").val().toLowerCase()) !== -1) {
                									element.marked = true;
                									topelement.markcount++;
                									$(".selection_text").append(element.Time + "  " + element.Username + "  " + element.SourceIP + "  " + element.LogMessage+"<BR>");
                								} 
                							}

                						}
                						
										
                						function findOccurrences(){
                							
                                            //console.log($("#regex").val());	
                                            $(".selection_text").text("");
											
                							nest.forEach(function(d) {
                								d.markcount = 0;
                								d.values.forEach(function(e){
                									e.marked = false;
                									searchColumn(d,e,"LogMessage");
                									searchColumn(d,e,"SourceIP");
                									searchColumn(d,e,"Username");
                								});
                							});		
                									
                							//console.log(nest);
                				
                							log_lines.attr("class",function(d) {
                								var temp = false;
                								d.values.forEach(function(e,j){
                									if (e.marked == true) {
                										temp = true;
                									} 
                								});
                								if (temp == true) {
                									return "log_line highlight";
                								} else {
                									return "log_line no_highlight";
                								}
                							})
                							.attr("opacity", function(d) {
                								return 0.1+d.markcount/lines_per_pixel;	
                							});	
                							
                							brushmove();
                							
                                        }
                							
										
                						function getSelectionText() {
                    						var text = "";
                    						if (window.getSelection) {
                        						text = window.getSelection().toString();
                    						} else if (document.selection && document.selection.type != "Control") {
                        						text = document.selection.createRange().text;
                    						}
                    						return text;
                						}
                						
                						
                						
                						function getCountryFromIP(ip, index, _fLength, callback) {
                							
                							jQuery.getJSON("http://freegeoip.net/json/"+ip, function(location) {
                								callback(location);
										
                							}).done(function() {
												if (index === _fLength-1) {
													for(var i = 0; i < IP_to_country.length; i++) {
														IP_nodes[i].country = IP_to_country[i].country;
													}

													data.forEach(function(d,i) {
														for (var j = 0; j < IP_to_country.length; j++) {
															if (d.SourceIP === IP_to_country[j].SourceIP) {
																d.Country = IP_to_country[j].country;
																//console.log(d.Country);
															}
														}
													});

													country_frequency = calculateFrequencyAndLinks(data, "Country");
													calculateNodeLinkPositions(country_frequency, "Country", country_nodes, country_links, 100, 188);

													console.log(country_frequency);

													//connections.SourceIP = new BuildOutgoingConnections("SourceIP", IP_nodes, IP_links, "left");
													connections.Country = new BuildOutgoingConnections("Country", country_nodes, country_links, "left");
													connections.Username = new BuildOutgoingConnections("Username", user_nodes, user_links, "right");
													//console.log(connections["SourceIP"]);
												}
											});
                							
                						}
                							
                							
                					});
                						
                                });