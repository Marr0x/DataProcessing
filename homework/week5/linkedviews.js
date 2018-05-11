/**
* Data Processing
* Marwa Ahmed, Student number 10747141
* Assignment: D3 Linked views
**/

/*
* Data sources:
* Better Life Index: https://stats.oecd.org/Index.aspx?DataSetCode=BLI
* Quality of Life Index 2015: https://www.numbeo.com/quality-of-life/rankings_by_country.jsp?title=2015
* Quality of Life Index 2016: https://www.numbeo.com/quality-of-life/rankings_by_country.jsp?title=2016
*/


window.onload = function() {
	getData();

	var map = new Datamap({element: document.getElementById('container')});
};


/**
* This function gets the data from an API request and places it in a queue. 
* When all data is loaded it calls the function convertData.
**/
function getData(){

	// API request bli = betterLifeIndex
	var bli2015 ="https://stats.oecd.org/SDMX-JSON/data/BLI2015/BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR+GBR.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions";
	//var bli2016 ="https://stats.oecd.org/SDMX-JSON/data/BLI2016/BEL+CZE+DNK+FIN+FRA+DEU+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR+GBR.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT+MN+WMN/all?&dimensionAtObservation=allDimensions";
	var bli2016 ="https://stats.oecd.org/SDMX-JSON/data/BLI2016/BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions";

	// put data in a queue, so the plot will be made after everything is loaded
	d3.queue()
	  .defer(d3.request, bli2015)
	  .defer(d3.request, bli2016)
	  .awaitAll(convertData);
};


/**
* This function converts the data from the API request into a JSON, 
* then extracts all needed data from the JSON.
**/ 
function convertData(error, response, year = 0) {
	if (error) throw error;

	// convert data to JSON
	var dataBLI = JSON.parse(response[year].responseText)

	// number of countries, variables, inequality (total, men, women)
	var noCountries = dataBLI.structure.dimensions.observation[0].values.length;
	var noVariables = dataBLI.structure.dimensions.observation[1].values.length;
	// var noInequality = dataBLI.structure.dimensions.observation[3].values.length;


	/**
	* Iterate through the JSON file to get the names and values of the needed variables 
	* of each country. Put info of each county into separate 
	* dictionaries (info), put all dicionaries in a list (infoCountry).
	**/
	var obj ={}
	var countryName = [];
	for (var country = 0; country < noCountries; country++){

		// array of country names
		countryName[country] = dataBLI.structure.dimensions.observation[0].values[country].name;

		var infoCountry = [];
		var info = {};
		for (var variable = 0; variable < noVariables; variable++){

			// get variables from each 'catogory' (total, men, women) from each country from the JSON 
			info = (dataBLI.dataSets[0].observations[country + ":" + variable + ":0:0"][0]);
			infoCountry.push(info);
		}
		obj[country] = infoCountry
	}

	console.log(obj)


	// names of variables in the data 
	var variableName = [];
	for (var i = 0; i < noVariables; i++){
		variableName[i] = dataBLI.structure.dimensions.observation[1].values[i].name;
	}

	makeBarChart(infoCountry, countryName, variableName)

};


/** 
* Make bar chart.
**/
function makeBarChart(infoCountry, countryName, variableName, year = 0, country) {

	// set dimentions and margins of the graph
	var margin = {top: 50, right: 100, bottom: 100, left: 50};
	var width = 700 - margin.left - margin.right;
	var height = 400 - margin.top - margin.bottom/2;

	// create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("class", "svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom/2)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scale-function for the x-axis
	var xScale = d3.scale.ordinal()
						 .domain(variableName)
						 .range([margin.left, width - margin.right]);

	// var xScale = d3.scale.ordinal()
	// 					 .domain(infoCountry.map(function(d){return d[0];}))
	// 					 .range([margin.left, width - margin.right]);

	// scale-function for the y-axis
	var yScale = d3.scale.linear()
			   .domain([0, d3.max(infoCountry[year], function(d){ return d[0]; }) ])
			   .range([height - margin.left, 0]);

	// draw the x-axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(variableName, function(d, i){ return i; } );

				
				svg.append("g")
				   .attr("class", "x axis")
				   .attr("transform", "translate(0," + (height - margin.top) + ")")
				   .call(xAxis);

	// title x-axis
	svg.append("text")
	   .attr("transform", "translate(" + (width/2) + " ," + height + ")")
	   .style("text-anchor", "middle")
	   .text("Indicators");

	// make function to define y-axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left");


	// call the yAxis function to create the y-axis
	svg.append("g")
	   .attr("class", "y axis")
	   .attr("transform", "translate(" + margin.left + ",0)")
	   .call(yAxis);


	// text label for the y-axis
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - margin.left/2)
	   .attr("x", 0 - (height/2.5))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .text("Percentage %");


	// title graph
	svg.append("text")
	   .attr("class", "title")
	   .attr("y", -margin.top/2)
	   .attr("x", width/2)
	   .style("text-anchor", "middle")
	   .style("font-size", "30px")
	   .text("Better Life Index");


	// bars 
	var rectangles = svg.selectAll("rect")
						.data(infoCountry)
						.enter()
						.append("rect")
						.attr("x", function(d, i){ return ((xScale(width + margin.left + margin.right)/5) * i)+ margin.left})
						.attr("y", yScale(height - margin.bottom - margin.top))
						.attr("width", 50 )
						.attr("height", function (d) {return (d)} )
						.attr("fill", "blue");
						//.text(function (d, i) { console.log(d); return i});



};





















