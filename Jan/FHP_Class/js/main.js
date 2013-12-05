 $(document).ready(function(){
                                                        
                                    d3.csv("auth.csv", function(data){

                                    	console.log("testing git");
                												
                						var width = 580, height = 1660;
                						var overview_rect = 1400;
                						var lines_per_pixel = data.length/overview_rect;
                						var format = d3.time.format("%y.%m.%d %H:%M"); //01.08.18 06:26
                						
                						var diagonal = d3.svg.diagonal()
                    						.projection(function(d) { return [d.y, d.x]; });
                												
                						var ytime = d3.time.scale().range([20, 20+overview_rect])
                							.domain(d3.extent(data, function(d) { return format.parse(d.Time); }));
                							
                						var hour_ticks = ytime.ticks(d3.time.hours, 1);
                						var IP_frequency; 
										var user_frequency;
										var source_port_frequency;
										var IP_to_country = [];
										var IP_nodes = [];
                    					var IP_links = [];
										var user_nodes = [];
                    					var user_links = [];
										var source_port_nodes = [];
                    					var source_port_links = [];
										
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
                									if (first_set === false){
                										hour_ticks[j].value = hour_ticks[j];
                										hour_ticks[j].id = i;
                										first_set = true;
                									}
                								} 
                							}
                							
                						});
										
										var y = d3.scale.linear().range([20, 20+overview_rect])
                							.domain(d3.extent(data.map(function(d) { return +d.id; })));
										
										IP_frequency = calculateFrequencyAndLinks(data, "SourceIP");
										calculateNodeLinkPositions(IP_frequency, "SourceIP", IP_nodes, IP_links, 100, 188);
										getCountries(IP_frequency, "SourceIP");
										
										user_frequency = calculateFrequencyAndLinks(data, "Username");
										calculateNodeLinkPositions(user_frequency, "Username", user_nodes, user_links, 431, 343);
										//console.log(user_links);
										//console.log(hour_ticks);
										
										
										source_port_frequency = calculateFrequencyAndLinks(data, "SourcePort");
										calculateNodeLinkPositions(source_port_frequency, "SourcePort", source_port_nodes, source_port_links, 431, 343);
										
                						
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
										
										//console.log(data);
                						
										   
											
											
											var container_xpos = 190
												time_container_xpos = container_xpos + 101,
												timelines_xpos = time_container_xpos + 20;
											
											var brush = d3.svg.brush()
												.y(y)
												.extent([0, 500])
												.on("brush", brushmove);
											
											var container = svg.append("rect")
												.attr("width", 100)
												.attr("height", overview_rect)
												.attr("x", container_xpos)
												.attr("y", 20)
												.style("fill", "#606060");
											
											var time_container = svg.append("rect")
												.attr("width", 50)
												.attr("height", overview_rect)
												.attr("x", time_container_xpos)
												.attr("y", 20)
												.style("fill", "#999999");
											
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
												.attr("width", 18)
												.attr("height", 1)
												.attr("x", time_container_xpos)
												.attr("y", function(d, i){
													return y(+d.id);
												}).attr("opacity", 0.5);
											
											time_lines.append("text")
												.text(function(d){
													return format(d.value).substring(9, 14);
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
											
											var brushg = svg.append("g")
												.attr("class", "brush")
												.call(brush)
												.selectAll("rect")
												.attr("x", container_xpos)
												.attr("width", 100);
											
											var detail = d3.select("body")
												.append("div")
												.attr("width", 700)
												.attr("height", overview_rect)
												.classed("focus", true);
											
											detail.append("p").classed("focus_text", true);
											
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
											
											IP_to_country.forEach(function(d,i){
												getCountryFromIP(d.SourceIP, i, fLength, function(location){
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
												_frequency[attribute].y = 20+overview_rect/fLength*l;
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


                						function calculateFrequencyAndLinks(array, attribute) {
											
											var frequency_new = {};
											var value;
											
											for (var i = 0; i < array.length; i++) {
												value = array[i][attribute];
												if (value in frequency_new) {
													frequency_new[value].count++;
													frequency_new[value].children.push({id: array[i].id});
												} else {
													frequency_new[value] = {count:1, children:[{id: array[i].id}]};
												}
											}
											
											return frequency_new;
										}
												
																	
										function buildIPConnections(attribute, _nodes, _links, side){
											
											var link = svg.selectAll(".link_" + attribute)
												.data(_links)
												.enter()
												.append("path")
												.attr("class", "link_" + attribute + " hidden")
												.attr("d", diagonal);
											
											var circle_and_text = svg.selectAll(".circle_and_text_" + attribute)
												.data(_nodes)
												.enter()
												.append("g")
												.attr("class", "circle_and_text_" + attribute);
											
											var circle_text = circle_and_text
												.append("text")
												.attr("x", function(d){
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
														//console.log(Object.keys(IP_nodes)[i]);
														return d[attribute].substring(0, 25); 
													}
												}).attr("class", "circle_text_" + attribute);
											
											var circle = circle_and_text
												.append("circle")
												.attr("cx", function(d){
													return d.x
												}).attr("cy", function(d){
													return d.y
												}).attr("r", function(d) {
													return 2+Math.log(d.count);
												})
												.attr("class", "circle_" + attribute)
												//.style("fill", "#ff9700")
												.on("click", function(d){
													console.log("click");
													link.transition()
													.attr("class", function(e){
														if (e[attribute] === d[attribute]) {
															return "link_" + attribute + " visible";
														}
														else {
															return "link_" + attribute + " hidden";
														}
													});
												});
												
										}
                							
											
                						function visibilityText(selected, classname) {
                							d3.select(selected)
                								.select("text")
                								.transition(1000)
                								.attr("class", classname);
                						}
                						
										
                						function brushmove() {
                							begin = Math.round(brush.extent()[0]);
                							end = Math.round(brush.extent()[1]);
                							$("p").text("");
                							
                							for(var i = begin;i < end; i++) {
                								var temp = $("#regex").val().toLowerCase();
                								if (data[i].LogMessage.toLowerCase().indexOf(temp) !== -1) {
                									$("p").append(data[i].Time + "  " + data[i].Username + "  " + data[i].SourceIP + "  " + data[i].LogMessage.toLowerCase().replace(temp, "<span>"+temp+"</span>")+"<BR>");
                								} else {
                									$("p").append(data[i].Time + "  " + data[i].Username + "  " + data[i].SourceIP + "  " + data[i].LogMessage+"<BR>");
                								}
                							}
                						}
                						
										
                						function findOccurrences(){
                							
                                            //console.log($("#regex").val());	
											
                							nest.forEach(function(d) {
                								d.markcount = 0;
                								d.values.forEach(function(e){
                									if (e.LogMessage.toLowerCase().indexOf($("#regex").val().toLowerCase()) !== -1) {
                										e.marked = true;
                										d.markcount++;
                									} else {
                										e.marked = false;
                									}
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
                								return 0.3+d.markcount/lines_per_pixel;	
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
													buildIPConnections("SourceIP", IP_nodes, IP_links, "left");
													buildIPConnections("Username", user_nodes, user_links, "right");
													//buildIPConnections("SourcePort", source_port_nodes, source_port_links, "right");
												}
											});
                							
                						}
                							
                							
                					});
                						
                                });