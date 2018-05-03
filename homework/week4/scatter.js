/**
* Data Processing
* Marwa Ahmed, student number 10747141
* D3 Scatterplot
**/

// https://www.oecd-ilibrary.org/economics/data/main-economic-indicators/international-trade_data-00045-en



window.onload = function() {
	console.log("something");
	getData();

};

/**
* 
*
**/
function getData(){
	//var net = "http://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";
	//var net = "https://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";
	//var net = "http://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";
var net = "https://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+BEL+CAN+CHL+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";

	d3.queue()
	  .defer(d3.request, net)
	  .awaitAll(makeScatterplot);
};


/**
*
*
**/
function makeScatterplot(error, response) {
	if (error) throw error;
	console.log(response);
	
	var dataNet = JSON.parse(response[0].responseText)
	
	console.log(dataNet);
	// console.log(dataNet.dataSets[0].observations["0:0:0:0:0"][0])

	// number of years, countries, variables
	noYears = 3;
	noCountries = 29;
	noVariables = 3;

	// dictionary for the info per year
	var infoYear = {};

	// get import, export and net value for each country for each year
	 for (var year = 0; year < noYears; year++){

	 	// list for info of each country
	 	var dataCountry = [];

	 	for (var country = 0; country < noCountries; country++){

	 		// dictiionary 
	 		var info = {};

	 		//
	 		for (var variable = 0; variable < noVariables; variable++){

	 		// 
			info[variable] = (dataNet.dataSets[0].observations[variable + ":" + country + ":0:0:" + year][0])

	 		}
	 		dataCountry.push(info);
		}
		infoYear[year] = dataCountry;
	}
	console.log(infoYear)



	/** 
	*	make scatterplot
	*
	**/

	// set dimentions and margins of the graph
	var margin = {top: 50, right: 50, bottom: 50, left: 50},
	width = 800 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	// create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log(infoYear[0])

	var xScale = d3.scaleLinear()
			  .domain([d3.min(infoYear[0], function(d){return d[1]}), d3.max(infoYear[0], function(d){
						return d[1];
					})]).nice()
			  .range([margin.left, width - margin.right]);

	var yScale = d3.scaleLinear()
					.domain([0, d3.max(infoYear[0], function(d){
						return d[0];
					})]).nice()
					.range([height - margin.left, 0]);


	var minNet = d3.min(infoYear[0], function(d){return d[2]; });
	var maxNet = d3.max(infoYear[0], function(d){return d[2]; });

	var rScale = d3.scaleLinear()
					.domain([minNet, maxNet])
					.range([2, 7]);

	// color
	var cScale = d3.scaleOrdinal(d3.schemeCategory20);

	// add the x axis
	var xAxis = svg.append("g")
					  .attr("transform", "translate(0," + (height - margin.top) + ")")
					  .call(d3.axisBottom(xScale))

	// text label for the x axis
	svg.append("text")
	   .attr("transform", "translate(" + (width/2) + " ," + height + ")")
	   .style("text-anchor", "middle")
	   .text("Import");

	// add the y axis
	var yAxis = svg.append("g")
					.attr("transform", "translate(" + 50 + ", 0)")
					.call(d3.axisLeft(yScale))

	// text label for the y axis
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - margin.left/2)
	   .attr("x", 0 - (height/2.5))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .text("Export")

	// text title graph
	svg.append("text")
	   .attr("y", -margin.top/2)
	   .attr("x", width/2)
	   .style("text-anchor", "middle")
	   .text("International trade");

	// draw the datapoints
	svg.selectAll("circle")
		.data(infoYear[0])
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return xScale(d[1]);
		})
		.attr("cy", function(d){
			return yScale(d[0]);
		})
		.attr("r", function (d){ 
			return rScale(d[2]);
		})
		.style("fill", function(d){
			console.log(d)
			return cScale(d);
		})


};








