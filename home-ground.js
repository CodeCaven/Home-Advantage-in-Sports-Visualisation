/*
TITLE: Home Ground Advantage Visualisation
AUTHOR: Simon Caven
LAST MODIFIED: 21/06/2020
Use python -m http.server 8000 for local files and viewing 
*/

// global states
var state = "HOME"; // HOME,EPL,IPL,AFL
var display = "TEAM"; // TEAM, VENUE
var order = "DESC"; // DESC,ASC
var display_sort = "HOME"; // HOME, ALL, VENUE
var colors = ["#e41a1c", "#377eb8"];

// storage
var comps = {"EPL":{"icon":"noun_Soccer Ball_2034.svg", "mean": 0.462631579},
             "IPL":{"icon":"noun_Cricket Ball_286930.svg", "mean": 0.442962963},
             "AFL":{"icon":"noun_Football_5170.svg", "mean":0.569751057}
    }

// text displays
var text_home = "Major sports competitions are said to exhibit a home ground " +
                   "advantage. </br>This visualisation allows the exploration of "  + 
                   "AFL, EPL and IPL results from the last decade to test this theory." +
                   " </br>Click on a competition to see the details.";

var text_epl_team = "Only 7 teams in the EPL have a greater than 50% home ground win percentage. " +
                        "</br>Hover over the chart to view the EPL teams with a greater home ground win percentage " + 
                        "than total win percentage.";

var text_ipl_team = "Only 2 teams in the IPL have a greater than 50% home ground win percentage. " +
                        "</br>Hover over the chart to view the IPL teams with a greater home ground win percentage " + 
                        "than total win percentage.";

var text_afl_team = "The home ground advantage is evident in the AFL. Only 4 teams have less than a 50% home " +
                    "ground win percentage. </br>Hover over the chart to view the AFL teams with a greater home ground win percentage " + 
                    "than total win percentage.";

var text_ipl_venue = "The home ground advantage is more apparent at the IPL venues with 7 venues having a " +
                        "greater than 50% win rate for the home team.";

var text_afl_venue = "Only 4 of the AFL venues have a home team winning percentage of less than 50%.</br>" +
                        " 2 AFl venues have a home win rate in excess of 80%.";

// panel html
var panel_epl = "<strong>46.3%</strong> home ground wins</br>" + 
                "<strong>7</strong> teams greater than 50%</br>" +
                "<strong>6</strong> teams with a <strong>better home win %</strong>";

var panel_ipl = "<strong>44.3%</strong> home ground wins</br>" + 
                "<strong>7</strong> venues greater than 50%</br>" +
                "<strong>4</strong> teams with a <strong>better home win %</strong>";

var panel_afl = "<strong>57%</strong> home ground wins</br>" + 
                "<strong>14</strong> venues greater than 50%</br>" +
                "<strong>17</strong> teams with a <strong>better home win %</strong>";

window.onload = function() { 

    // add text
    var textContainer = document.getElementById("text");
    textContainer.innerHTML = text_home;
    
    // load data
    load_data();

    // draw gauges (get means from data)
    draw_gauge("#g1", "gauge1", comps["EPL"].mean);
    draw_gauge("#g2", "gauge2", comps["IPL"].mean);
    draw_gauge("#g3", "gauge3", comps["AFL"].mean);

    // add text to home
    append_home_text(); 
}

function append_home_text(){

    // append comp info

    // EPL
    var gauge = document.getElementById("g1");
    var node = document.createElement("h4");
    var panel_node = document.createElement("p");
    node.innerHTML = "EPL";
    node.style.color = "black";
    gauge.appendChild(node);
    panel_node.innerHTML = panel_epl;
    panel_node.style.color = "black";
    gauge.appendChild(panel_node);

    // IPL
    gauge = document.getElementById("g2");
    node = document.createElement("h4");
    panel_node = document.createElement("p");
    node.innerHTML = "IPL";
    node.style.color = "black";
    gauge.appendChild(node);
    panel_node.innerHTML = panel_ipl;
    panel_node.style.color = "black";
    gauge.appendChild(panel_node);

    // AFL
    gauge = document.getElementById("g3");
    node = document.createElement("h4");
    panel_node = document.createElement("p");
    node.innerHTML = "AFL";
    node.style.color = "black";
    gauge.appendChild(node);
    panel_node.innerHTML = panel_afl;
    panel_node.style.color = "black";
    gauge.appendChild(panel_node);
}

function load_data(){
    // for simple server, data files need to be in same location as html file
    
    // ***AFL**
    // get and store data for charts
    d3.csv("AFL_Team.csv" + "?_=" + new Date().getTime()) // stupid cache issue
    .row(function(d) {
        return {team: d.team, mean: +d.mean, mids: +d.mids, type:d.type, all: +d.all}; 
    })
    .get(function(error, rows) { 
        window.afl_team = rows; 
    });

    // get and store data
    d3.csv("AFL_Venues.csv")
    .row(function(d) { 
        return {venue: d.venue, mean: +d.mean, mids: +d.mids, type:d.type}; 
    })
    .get(function(error, rows) { 
        window.afl_venue = rows; 
    });

    // ***IPL***
    // get and store data
    d3.csv("IPL_Team.csv" + "?_=" + new Date().getTime())
    .row(function(d) { 
        return {team: d.team, mean: +d.mean, mids: +d.mids, type:d.type, all: +d.all}; 
    })
    .get(function(error, rows) { 
        window.ipl_team = rows;    
    });

    // get and store data
    d3.csv("IPL_VenueMeans.csv")
    .row(function(d) { 
        return {venue: d.venue, mean: +d.mean, mids: +d.mids, type:d.type}; 
    })
    .get(function(error, rows) { 
        window.ipl_venue = rows;    
    });

    // ***EPL***
    // get and store data
    d3.csv("EPL_Team.csv" + "?_=" + new Date().getTime())
    .row(function(d) { 
        return {team: d.team, mean: +d.mean, mids: +d.mids, type:d.type, all: +d.all}; 
    })
    .get(function(error, rows) { 
        window.epl_team = rows;  
    });
}

function draw_gauge(contID, pieID, percent) {
    var width = "100%";
    var height = 250;
    var translateX = 180;
    var translateY = 100;

    var svg = d3.select(contID)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("shape-rendering", "auto"); // does nothing, anti-aliasing??; // OK chrome?

    var arc = d3.arc()
    .innerRadius(50)
    .outerRadius(80)
    .cornerRadius(5)
    .padAngle(0);

	// initialize pie chart
	var pie = d3.pie()
		.startAngle((-1*Math.PI)/2)
		.endAngle(Math.PI/2)
		.value(function(colors) {
			return 100/colors.length;
        });
        

	// draw the arcs. one for each color
	svg.selectAll('.arc')
		.data(pie(colors))
		.enter()
		.append('path')
		.attr("d",arc)
		.attr("transform", "translate(" + translateX + "," + translateY + ")")
		.style("fill", function(d, i) {
			return colors[i]
        });

    // add labels 0
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "15px")
        .attr("fill","black")
        .attr("dx", "-95px")
        .text("0");

    // add labels 100
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "15px")
        .attr("fill","black")
        .attr("dx", "85px")
        .text("100");  

    // transition the gauge
    svg.attr("opacity", 0);
    setTimeout(function(){
        svg.attr("opacity", 1);
    }, 500);

	// set up the needle 
	svg.selectAll("#" + pieID)
		.data([0])
		.enter()
		.append('line')
		.attr("x1",0)
		.attr("x2",-78)
		.attr("y1",0)
        .attr("y2",0)
        .attr("id", pieID)
        .style("stroke","black")
        .style("stroke-width",2)
		.attr("transform", function(d) {
			return " translate(" + translateX + "," + translateY + ") rotate(" + d + ")"
		} );

	// transistion 
    svg.selectAll("#" + pieID).data([percent*180])
        .transition()
        .ease(d3.easeElasticOut)
        .duration(4000)
        .attr("transform", function(d) {
            return " translate(" + translateX + "," + translateY + ") rotate(" + d + ")"
        });
}

// hover on gauges
function hover(x){
    var gauges = document.getElementsByClassName("gauge");
    for(var i=0; i<gauges.length; i+=1){
        gauges[i].style.opacity = 0.1;
    }
    x.style.opacity = 1;
}

function over(x){
    var gauges = document.getElementsByClassName("gauge");
    for(var i=0; i<gauges.length; i+=1){
        gauges[i].style.opacity = 1;
    }
}

// gauge clicks
function clicked(x){
    
    var id = x.id;

    //set state and menu (venue not needed EPL)
    var venue_menu = document.getElementById("venue");
    if(id=="g1"){
        state = "EPL";
        venue_menu.style.display = "none";
    }
    else if(id == "g2"){
        state = "IPL";
        venue_menu.style.display = "inline";
    }
    else if(id == "g3"){
        state = "AFL";
        venue_menu.style.display = "inline";
    }

    // hide home charts
    var home_els = document.getElementsByClassName("home");
    for(var i=0; i < home_els.length; i+=1){
        home_els[i].style.display = "none";
    }

    // change header
    var header = document.getElementById("header");
    header.style.opacity = 0;

    // transition effect for header plus set state
    setTimeout(function(){ 
        if(id=="g1"){
            header.innerHTML = "EPL Teams";
        }
        else if(id == "g2"){
            header.innerHTML = "IPL Teams";
        }
        else if(id == "g3"){
            header.innerHTML = "AFL Teams";
        }
        header.style.opacity = 1;
    },500);

    // add controls
    var control = document.getElementById("control");
    control.style.opacity = 0;

    // add legend
    var node = document.createElement("div");
    node.id = "legend";
    control.insertBefore(node, control.childNodes[0]);
    draw_gauge_legend();

    // transition
    setTimeout(function(){
        control.style.display = "inline";
        control.style.opacity = 1;
    }, 500);

    // change text
    var textContainer = document.getElementById("text");
    if(state == "EPL"){
        var new_text = text_epl_team;
    }
    else if(state == "IPL"){
        var new_text = text_ipl_team;
    }
    else if(state == "AFL"){
        var new_text = text_afl_team;
    }

    // transition text
    textContainer.style.opacity = 0;
    setTimeout(function(){
        textContainer.innerHTML = new_text;
        textContainer.style.opacity = 1;
    }, 500);
    
    // get data
    var data = get_data();
    
    // draw chart
    draw_team(data);
}

function get_data(){
    // get team data
    if(state == "EPL"){
        return epl_team;
    }
    else if(state == "IPL"){
        return ipl_team;
    }
    else if(state == "AFL"){
        return afl_team;
    }
}

function get_venue_data(){
    // get team data
    if(state == "IPL"){
        return ipl_venue;
    }
    else if(state == "AFL"){
        return afl_venue;
    }
}

// reload home page
function returnHome(x){

    state = "HOME";

    // transition text
    var textContainer = document.getElementById("text");
    textContainer.style.opacity = 0;
    setTimeout(function(){
        textContainer.innerHTML = text_home;
        textContainer.style.opacity = 1;
    }, 500);
    
    // hide controls and remove legend
    var legend = document.getElementById("legend");
    var controls = document.getElementById("control");
    controls.removeChild(legend);
    controls.style.display = "none";

    // reset menu
    display_sort = "HOME";
    var menu_venue = document.getElementById("venue");
    menu_venue.style.display = "inline";
    var menu_team = document.getElementById("team");
    menu_team.style.display = "none";
    var menu_home = document.getElementById("sortH");
    menu_home.style.display = "inline";
    var menu_all = document.getElementById("sortT");
    menu_all.style.display = "inline";

    // clear svg chart
    $("#chart").empty();

    // show home charts and elements
    var home_els = document.getElementsByClassName("home");
    for(var i=0; i < home_els.length; i+=1){
        home_els[i].style.display = "block";
    }

    // change header
    var header = document.getElementById("header");
    header.style.opacity = 0;
    setTimeout(function(){
        header.innerHTML = "Home Ground Win %";
        header.style.opacity = 1;
    }, 500);
    
    // clear svg elements
    $("#g1").empty();
    $("#g2").empty();
    $("#g3").empty();

    // and re-draw gauges for transistion effect
    draw_gauge("#g1", "gauge1", comps["EPL"].mean);
    draw_gauge("#g2", "gauge2", comps["IPL"].mean);
    draw_gauge("#g3", "gauge3", comps["AFL"].mean);

    append_home_text();
}


function draw_venue(data){

    // chart dimensions
    var width = 900;
    var height = 400;
    var margin = {top: 30, right: 60, bottom: 10, left: 300};

    var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "trans")
    .attr("opacity", 0)
    .attr("shape-rendering", "auto"); // does nothing, anti-aliasing??; // OK chrome?
    
    
    // min and max using reduce method
    var x_min = data.reduce((min, p) => p.mids < min ? p.mids : min, data[0].mids);
    var x_max = data.reduce((max, p) => p.mids > max ? p.mids : max, data[0].mids);
    
    // scales
    var xScale = d3.scaleLinear()
    .domain([x_min, x_max])
    .range([margin.left, width - margin.right]);

    var yScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1)

    // sort 
    if(order=="DESC"){
        data.sort((a, b) => (a.mids < b.mids) ? 1 : -1);
    }
    else if(order=="ASC"){
        data.sort((a, b) => (a.mids > b.mids) ? 1 : -1);
    }
    
    // draw bars
    svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("fill", function(d, index){
            if(d.mids > 0){
                return colors[1];
            }
            else{
                return colors[0];
            }
      })
      .attr("x", function(d, index){ 
          return xScale(Math.min(d.mids, 0));
      })
      .attr("y", (d, i) => yScale(i))
      .attr("width", d => Math.abs(xScale(d.mids) - xScale(0)))
      .attr("height", yScale.bandwidth());
    
    // x axis top
    var x_axis = d3.axisBottom().scale(xScale)
                    .tickFormat(function(d){
                        return d*100.0 + 50.0 + " %";
                    })
                    .tickSize(2).tickPadding(6);

    svg.append("g")
            .attr("transform", "translate(0, " + margin.top/2  +")")
            .call(x_axis);

    // x axis bottom
    x_axis = d3.axisTop().scale(xScale)
                .tickFormat(function(d){
                    return d*100.0 + 50.0 + " %";
                })
                .tickSize(2).tickPadding(6);

    svg.append("g")
            .attr("transform", "translate(0, "  + height  +")")
            .call(x_axis);
    
    // y-axis
    var y_axis = d3.axisLeft().scale(yScale)
                    .tickFormat(i => data[i].venue)
                    .tickSize(0).tickPadding(6); 
    
    // transition  the chart
    setTimeout(function(){
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "yaxis")
            .attr("font-weight", 400)
            .call(y_axis);
        svg.attr("opacity", 1);
    }, 500)
    
}

function update(x){
    var id = x.id;

    if(id == "sortH"){
        if(display_sort != "HOME"){
            display_sort = "HOME";
            var data = get_data();
            $("#chart").empty();
            draw_team(data);
        }
    }
    else if(id == "sortT"){
        if(display_sort != "ALL"){
            display_sort = "ALL";
            var data = get_data();
            $("#chart").empty();
            draw_team(data);
        }
    }
    else if(id == "sortA"){
        if(order != "ASC"){
            $("#chart").empty();
            order = "ASC";
            if(display_sort == "VENUE"){
                var data = get_venue_data();
                draw_venue(data);
            }
            else{
                var data = get_data();
                draw_team(data);
            } 
        }
    }
    else if(id == "sortD"){
        if(order != "DESC"){
            $("#chart").empty();
            order = "DESC";
            if(display_sort == "VENUE"){
                var data = get_venue_data();
                draw_venue(data);
            }
            else{
                var data = get_data();
                draw_team(data);
            } 
        }
    }
    else if(id == "venue"){
        if(display_sort != "VENUE"){
            display_sort = "VENUE";

            // menu
            var menu_venue = document.getElementById("venue");
            menu_venue.style.display = "none";

            var menu_team = document.getElementById("team");
            menu_team.style.display = "inline";

            var menu_home = document.getElementById("sortH");
            menu_home.style.display = "none";

            var menu_all = document.getElementById("sortT");
            menu_all.style.display = "none";

            // change text
            var textContainer = document.getElementById("text");
            if(state == "IPL"){
                var new_text = text_ipl_venue;
            }
            else if(state == "AFL"){
                var new_text = text_afl_venue;
            }

            // transition text
            textContainer.style.opacity = 0;
            setTimeout(function(){
                textContainer.innerHTML = new_text;
                textContainer.style.opacity = 1;
            }, 500);

            var data = get_venue_data();
            $("#chart").empty();
            draw_venue(data);
        }
    }
    else if(id == "team"){
        
        display_sort = "HOME";

        // menu
        var menu_venue = document.getElementById("venue");
        menu_venue.style.display = "inline";

        var menu_team = document.getElementById("team");
        menu_team.style.display = "none";

        var menu_home = document.getElementById("sortH");
        menu_home.style.display = "inline";

        var menu_all = document.getElementById("sortT");
        menu_all.style.display = "inline";

        // change text
        var textContainer = document.getElementById("text");
        if(state == "EPL"){
            var new_text = text_epl_team;
        }
        else if(state == "IPL"){
            var new_text = text_ipl_team;
        }
        else if(state == "AFL"){
            var new_text = text_afl_team;
        }

        // transition text
        textContainer.style.opacity = 0;
        setTimeout(function(){
            textContainer.innerHTML = new_text;
            textContainer.style.opacity = 1;
        }, 500);

        var data = get_data();
        $("#chart").empty();
        draw_team(data);       
    }

    // change header
    var header = document.getElementById("header");
    header.style.opacity = 0;
    setTimeout(function(){
        if(display_sort == "VENUE"){
            var new_header = state + " Venues";
        }
        else{
            var new_header = state + " Teams";
        }
        header.innerHTML = new_header;
        header.style.opacity = 1;
    }, 500);
}

function draw_gauge_legend() {
    var width = "100%";
    var height = 120;
    var translateX = 85;
    var translateY = 60;

    var svg = d3.select("#legend")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("shape-rendering", "auto"); // does nothing, anti-aliasing??; // OK chrome?

    // set class for background icon
    if(state == "EPL"){
        svg.attr("class", "legendEPL");
    }
    else if(state == "IPL"){
        svg.attr("class", "legendIPL");
    }
    else if(state == "AFL"){
        svg.attr("class", "legendAFL");
    }

    var arc = d3.arc()
    .innerRadius(25)
    .outerRadius(38)
    .cornerRadius(5)
    .padAngle(0);

	// initialize pie chart
	var pie = d3.pie()
		.startAngle((-1*Math.PI)/2)
		.endAngle(Math.PI/2)
		.value(function(colors) {
			return 100/colors.length;
        });
        
	// draw the arcs. one for each color
	var arcs = svg.selectAll('.arc')
		.data(pie(colors))
		.enter()
		.append('path')
		.attr("d",arc)
		.attr("transform", "translate(" + translateX + "," + translateY + ")")
		.style("fill", function(d, i) {
			return colors[i]
        });

    // draw legend line
    svg.append("line")
        .attr("x1", 50)
        .attr("y1", 90)
        .attr("x2", 120)
        .attr("y2", 90)
        .attr("stroke-width", "4px")
        .attr("stroke", "black")

    // add labels 0
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "10px")
        .attr("fill","black")
        .attr("dx", "-45px")
        .text("0");

    // add labels 100
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "10px")
        .attr("fill","black")
        .attr("dx", "40px")
        .text("100");

    // add labels 50
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "10px")
        .attr("fill","black")
        .attr("text-anchor", "middle")
        .attr("dy", "-5px")
        .text("50");

    // add labels header
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "12px")
        .attr("fill","black")
        .attr("font-style", "italic")
        .attr("text-anchor", "middle")
        .attr("dy", "-45px")
        .attr("dx", "5px")
        .text("Home Wins %");

    // add labels header (line)
    svg.append("text")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .attr("font-size", "12px")
        .attr("fill","black")
        .attr("font-style", "italic")
        .attr("text-anchor", "middle")
        .attr("dy", "25px")
        .attr("dx", "5px")
        .text("Total Wins %");
}

function draw_team(data){

    // chart dimensions
    var width = 900;
    var height = 400;
    var margin = {top: 30, right: 60, bottom: 10, left: 150};

    var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "trans")
    .attr("opacity", 0)
    .attr("shape-rendering", "auto") // does nothing, anti-aliasing??; // OK chrome?
    .on("mouseover", function(thisElement, index) {
        svg.selectAll("rect").
            attr("opacity", function(d, index){
                if(d.mids < d.all){
                    return 0.1;
                }
            })
        
        // fade y-axis
       svg.select(".yaxis").call(y_axis2);
   })
   .on("mouseout", function(thisElement, index){
        svg.selectAll("rect").
        attr("opacity", 1);
        // redisplay y-axis
        svg.select(".yaxis").call(y_axis);
   });

    // min and max using reduce method
    var x_min = data.reduce((min, p) => p.mids < min ? p.mids : min, data[0].mids);
    var x_max = data.reduce((max, p) => p.mids > max ? p.mids : max, data[0].mids);
    var x_min_tot = data.reduce((min, p) => p.all < min ? p.all : min, data[0].all);
    var x_max_tot = data.reduce((max, p) => p.all > max ? p.all : max, data[0].all);
    
    // scales
    var xScale = d3.scaleLinear()
    .domain([Math.min(x_min, x_min_tot), Math.max(x_max, x_max_tot)])
    .range([margin.left, width - margin.right]);

    var yScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1)

    // sort 
    if(order=="DESC" & display_sort=="HOME"){
        data.sort((a, b) => (a.mids < b.mids) ? 1 : -1);
    }
    else if(order=="ASC" & display_sort=="HOME"){
        data.sort((a, b) => (a.mids > b.mids) ? 1 : -1);
    }
    else if(order=="DESC" & display_sort=="ALL"){
        data.sort((a, b) => (a.all < b.all) ? 1 : -1);
    }
    else if(order=="ASC" & display_sort=="ALL"){
        data.sort((a, b) => (a.all > b.all) ? 1 : -1);
    }
    
    // draw bars
    svg.append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("fill", function(d, index){
            if(d.mids > 0){
                return colors[1];
            }
            else{
                return colors[0];
            }
      })
      .attr("x", function(d, index){ 
          return xScale(Math.min(d.mids, 0));
      })
      .attr("y", (d, i) => yScale(i))
      .attr("width", d => Math.abs(xScale(d.mids) - xScale(0)))
      .attr("height", yScale.bandwidth());

    // draw bars for totals 
    svg.append("g")
    .selectAll("rect2")
    .data(data)
    .enter()
    .append("rect")
      .attr("fill", "black")
      .attr("x", function(d, index){ 
          return xScale(Math.min(d.all, 0));
      })
      .attr("y", (d, i) => yScale(i))
      .attr("width", d => Math.abs(xScale(d.all) - xScale(0)))
      .attr("height", yScale.bandwidth()/2);
    
    // x axis top
    var x_axis = d3.axisBottom().scale(xScale)
                    .tickFormat(function(d){
                        return d*100.0 + 50.0 + " %";
                    })
                    .tickSize(2).tickPadding(6);

    svg.append("g")
            .attr("transform", "translate(0, " + margin.top/2  +")")
            .call(x_axis);

    // x axis bottom
    x_axis = d3.axisTop().scale(xScale)
                .tickFormat(function(d){
                    return d*100.0 + 50.0 + " %";
                })
                .tickSize(2).tickPadding(6);

    svg.append("g")
            .attr("transform", "translate(0, "  + height  +")")
            .call(x_axis);
    
    // y-axis 2 (for hover fade)
    var y_axis2 = d3.axisLeft().scale(yScale)
                    .tickFormat(function(d,i){
                        if(data[i].mids<data[i].all){
                            return "";
                        }
                        return data[i].team;
                    }) 
                    .tickSize(0).tickPadding(6);
    
    // y-axis
    var y_axis = d3.axisLeft().scale(yScale)
                    .tickFormat(i => data[i].team)
                    .tickSize(0).tickPadding(6); 
    
    // transition  the chart
    setTimeout(function(){
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "yaxis")
            .attr("font-weight", 400)
            .call(y_axis);
        svg.attr("opacity", 1);
    }, 500)
    
}