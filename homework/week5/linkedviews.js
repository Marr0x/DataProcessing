/**
* Course: Data Processing 
* Name: Marwa Ahmed 
* Student number: 10747141
* Assignment: D3 Linked views
* linkedviews.js
**/


/**
* Data sources:
* Better Life Index: https://stats.oecd.org/Index.aspx?DataSetCode=BLI
* Quality of Life Index 2015: https://www.numbeo.com/quality-of-life/rankings_by_country.jsp?title=2015
* Quality of Life Index 2016: https://www.numbeo.com/quality-of-life/rankings_by_country.jsp?title=2016
*
* Some of the used websites:
* https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
* http://bl.ocks.org/markmarkoh/4127667
**/


/**
* Call main function when whole code is loaded.
**/
window.onload = function() {
	loadData();
};


/**
* This function gets the Better Life Index data from API requests and places this data in a queue, 
* and the Quality of Life Index data from a JSON file and places this data in another queue.
* When all data is loaded, the function convertData (for the bar chart) and makeMap are called,
* to make the bar chart and the map.
**/
function loadData() {

	// API request (bli = Better Life Index)
	var bli2015 = "https://stats.oecd.org/SDMX-JSON/data/BLI2015/BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR+GBR.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions";
	var bli2016 = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions";

	// data for bar chart; put data in a queue, so the plot will be made after everything is loaded
	d3.queue()
	  .defer(d3.request, bli2015)
	  .defer(d3.request, bli2016)
	  .awaitAll(convertData);

	// data for map
	d3.queue()
	.defer(d3.json, "QoLI.json")
	.awaitAll(makeMap);
};


/**
* This function converts the data from the API requests into a JSON, 
* then extracts all needed data from the JSON.
**/ 
function convertData(error, response, year = 0) {
	if (error) throw error;

	// convert data to JSON
	var dataBLI = JSON.parse(response[year].responseText);

	// number of countries and variables
	var noCountries = dataBLI.structure.dimensions.observation[0].values.length;
	var noVariables = dataBLI.structure.dimensions.observation[1].values.length;


	/**
	* Iterate through the JSON file to get the names and values of the needed variables 
	* of each country. Put info of each county into separate 
	* dictionaries (info), put all dicionaries in a list (infoCountry) and put the list in one dictionary (obj).
	**/
	var obj = {};
	var countryName = [];
	for (var country = 0; country < noCountries; country++) {

		// array of country names
		countryName[country] = dataBLI.structure.dimensions.observation[0].values[country].name;

		var infoCountry = [];
		var info = {};
		for (var variable = 0; variable < noVariables; variable++) {

			// get variables from each country from the JSON 
			info = (dataBLI.dataSets[0].observations[country + ":" + variable + ":0:0"][0]);
			infoCountry.push(info);
		}
		obj[country] = infoCountry;
	}

	// names of the variables are extracted from the data and put in an array
	var variableName = [];
	for (var i = 0; i < noVariables; i++) {
		variableName[i] = dataBLI.structure.dimensions.observation[1].values[i].name;
	}

	// all the needed extracted data is passed to the next function to make the bar charts
	makeBarChart(obj, countryName, variableName);
};


// global variable to reach the update function of the bar chart
var update;


/** 
* This function makes a bar chart and contains a function to update the bar chart.
**/
function makeBarChart(obj, countryName, variableName, year = 0, country = 0) {

	// set dimentions and margins of the graph
	var margin = {top: 50, right: 100, bottom: 100, left: 50};
	var width = 700 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom / 2;

	// create SVG element
	var svg = d3.select("#containerBar")
				.append("svg")
				.attr("class", "svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom / 2)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale-function for the x-axis
	var xScale = d3.scale.ordinal()
						 .domain(variableName)
						 .rangeBands([margin.left, width]);

	// min and max values of data; max domain for yScale
	var minY = d3.min(obj[country], function(d) { return d; });
	var maxY = d3.max(obj[country], function(d) { return d; });

	// scale-function for the y-axis
	var yScale = d3.scale.linear()
						 .domain([0, maxY])
						 .range([height - margin.bottom, margin.top]).nice();

	// make function to define x-axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom");
	
	// draw the x-axis			
	svg.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(0," + (height - margin.bottom) + ")")
	   .call(xAxis)
	   .selectAll("text")
	   .attr("y", 10)
	   .attr("x", 10)
	   .attr("dy", ".35em")
	   .attr("transform", "rotate(30)")
	   .style("text-anchor", "start")
	   .style("font-size", "12");

	// title x-axis
	svg.append("text")
	   .attr("transform", "translate(" + (width / 2) + " ," + height + ")")
	   .style("text-anchor", "middle")
	   .style("font-size", "20px")
	   .text("Indicators");

	// make function to define y-axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left");

	// call the yAxis function to create the y-axis
	svg.append("g")
	   .attr("class", "axis")
	   .attr("transform", "translate(" + margin.left + ",0)")
	   .call(yAxis);

	// text label for the y-axis
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - margin.left / 2)
	   .attr("x", 0 - (height / 2.5))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .text("Percentage of the population (%)");

	// title graph
	svg.append("text")
	   .attr("class", "title")
	   .attr("y", - margin.top / 3)
	   .attr("x", width / 2)
	   .style("text-anchor", "middle")
	   .style("font-size", "30px")
	   .text("Better Life Index: " + countryName[0]);

	// make bars 
	var padding = 20;
	var rectangles = svg.selectAll("rect")
						.data(obj[country])
						.enter()
						.append("rect")
						.attr("x", function(d, i) {
							return xScale(variableName[i]) + 0.5; })
						.attr("y", function(d, i) { 
							return yScale(d) - 1; })
						.attr("width", (width / variableName.length) - padding)
						.attr("height", function(d) {
							return height - margin.bottom - yScale(d); })
						.attr("fill", "green");


	/**
	* This function updates the bar chart when user clicks on a country.
	**/
	function updateBarChart(name) {

		// search for (the number of) the country in the BetterLifeIndex data
		var country;
		countryName.forEach(function(d, i) {
			if (d == name) {
				country = i;
			};
		});

		// update bar chart by passing the number of the country in the data
		var rectangles = svg.selectAll("rect")
							.data(obj[country])
							.transition()
							.duration(500)
							.attr("x", function(d, i) {
								return xScale(variableName[i]); })
							.attr("y", function(d, i) { 
								return yScale(d) - 1; })
							.attr("width", (width / variableName.length) - padding)
							.attr("height", function(d) {
								return height - margin.bottom - yScale(d); })
							.attr("fill", "green");

		// update country name in title graph
		svg.select(".title")
		   .transition()
		   .duration(500)
		   .attr("class", "title")
		   .attr("y", - margin.top / 3)
		   .attr("x", width / 2)
		   .style("text-anchor", "middle")
		   .style("font-size", "30px")
		   .text("Better Life Index: " + name);
		};

		// make a global function of the updateBarChart function
		update = updateBarChart;
};


/**
* This function makes the map after the data is loaded.
**/
function makeMap(error, data, datasetYear = data[0].data2015) {
	if (error) throw error;

	// iterate over the JSON and put all the qualityOfLifeIndex values in an array
	var onlyValues = [];
	Object.keys(datasetYear).forEach(function(key, i) {
		onlyValues[i] = datasetYear[key].fillColor = (datasetYear[key].qualityOfLifeIndex);
	});

	// get the min and max qualityOfLifeIndex values
	var minValue = Math.min.apply(null, onlyValues);
    var maxValue = Math.max.apply(null, onlyValues);

    // make a color scale, to color the map
	var paletteScale = d3.scale.linear()
							   .domain([minValue,maxValue])
							   .range(["#f8f9c5","#0a8423"]);

    // color the counties on the map, based on the qualityOfLifeIndex values
	Object.keys(datasetYear).forEach(function(key) {
		datasetYear[key].fillColor = paletteScale(datasetYear[key].qualityOfLifeIndex);
	});

	// make map
	var map = new Datamap({
		element: document.getElementById('containerMap'),
		// countries which are not in the dataset will be colored gray
		fills: {
			defaultFill: 'rgba(0,0,0,0.1)'
		},
		scope: 'world',
		data: datasetYear,
	
		// when user clicks on a country, send name of country to the update function, to update the bar chart
		done: function(datamap) {
			datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				update(geography.properties.name);
			});
		},

		// zoom in on Europe
		setProjection: function(element) {
			var projection = d3.geo.equirectangular()
								   .center([13, 53])
								   .rotate([4.4, 0])
								   .scale(600)
								   .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			
			var path = d3.geo.path()
							 .projection(projection);

		return {path: path, projection: projection};
	  	},
		
		// change color of the borders when hovering over country (fill color stays the same)
		geographyConfig: {
			borderColor: "gray",
			popupOnHover: true,
			highlightOnHover: true,
			highlightBorderColor: "black",
			highlightFillColor: "datasetYear[key].fillColor",

			// show tooltip with name and qualityOfLifeIndex when hovering over country
			popupTemplate: function(geo, data) {
				return ['<div class="hoverinfo"><strong>',
				'Country: </strong>'+ geo.properties.name, '</br>' + 
				'<strong>Quality of Life Index: </strong>', data.qualityOfLifeIndex + '</div>'].join('');
			}
		}
	});

	// push info to the Lgend function
	Legend(minValue, maxValue)
};


/**
* This function makes a svg to put a legend in it for the colors on the map. 
* The colors on the map follow a gradient. For the legend only the lowest color and highest 
* color are selected.
**/
function Legend(minValue, maxValue){

	// set dimentions and margins of the graph
	var margin = {top: 10, right: 10, bottom: 10, left: 10};
	var width = 200 - margin.left - margin.right;
	var height = 50 - margin.top - margin.bottom / 2;

	// create SVG element
	var svg = d3.select("#legend")
				.append("svg")
				.attr("class", "svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom / 2)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// lowest and highest values plus there colors are transformed to a JSON
	colorLegend = [JSON.parse('{"values":"Low Quality of Life Index", "color":"#f8f9c5"}'), 
				   JSON.parse('{"values":"High Quality of Life Index", "color":"#0a8423"}')];

	// draw legend
	var legend = svg.selectAll(".legend")
					.data(colorLegend)
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i) { 
						return "translate(0," + i * 15 + ")"; 
					});

	// draw legend rectangles
	legend.append("rect")
		  .attr("x", 0)
		  .attr("y", 0)
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i) { 
				return colorLegend[i].color;
		  });

	// draw legend text
	legend.append("text")
		  .attr("x", 20)
		  // text 5px lower the position of rect
		  .attr("y", 5)
		  .attr("dy", ".40em")
		  .style("text-anchor", "begin")
		  .text(function(d, i) { 
		  		return colorLegend[i].values;
		  });
};





