/**
* Data Processing
* Marwa Ahmed, student number 10747141
* Assignment: D3 Scatterplot
**/


// Source data: https://www.oecd-ilibrary.org/economics/data/main-economic-indicators/international-trade_data-00045-en


// 
window.onload = function() {
	console.log("something");
	getData();

};

/**
* 
*
**/
function getData(){
	var trade = "https://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+BEL+CAN+CHL+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";

	d3.queue()
	  .defer(d3.request, trade)
	  .awaitAll(makeScatterplot);
};


/**
*
*
**/
function makeScatterplot(error, response) {
	if (error) throw error;
	console.log(response);
	
	var dataTrade = JSON.parse(response[0].responseText)
	
	console.log(dataTrade);
	// console.log(dataTrade.dataSets[0].observations["0:0:0:0:0"][0])

	// number of years, countries, variables (import, export, net trade)
	noYears = 3;
	noCountries = 29;
	noVariables = 3;

	// dictionary for the info per year
	var infoYear = {};

	// get import, export and net value for each country for each year
	 for (var year = 0; year < noYears; year++){

	 	// loop per year through the countries, put info in list
	 	var dataCountry = [];
	 	for (var country = 0; country < noCountries; country++){

	 		// put info of each country in a dictiionary
	 		var info = {};
	 		for (var variable = 0; variable < noVariables; variable++){

	 		// get data/variables from each country from the 'first' year
			info[variable] = (dataTrade.dataSets[0].observations[variable + ":" + country + ":0:0:" + year][0])

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
	var margin = {top: 50, right: 50, bottom: 50, left: 50};
	var width = 800 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("class", "svg")
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

	var minC = d3.min(infoYear[0], function(d){return d[2]; });
	var maxC = d3.max(infoYear[0], function(d){return d[2]; });

	// color
	var cScale = d3.scaleOrdinal(d3.schemeCategory20)
					.domain([minC, maxC]);

	var cValue = function(d){ return d[2];}
	var color = d3.scaleOrdinal(d3.schemeCategory10)

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
			return (cScale(d[2]));
		})


	//
	svg.append("text")
	   .attr("class", "name")
	   .attr("y", height + 10)
	   .attr("x", -margin.left)
	   .style("text-anchor", "left", "8")
	   .style("front-size", "8px")
	   .text("Marwa Ahmed, Student number 10747141");

	svg.append("text")
	   .attr("y", height + 30)
	   .attr("x", -margin.left)
	   .style("text-anchor", "left", "8")
	   .style("front-size", "8px")
	   .text("Assignment: D3 - Scatterplot");

	var word = "Source: OECD ilibrary - International trade"

	svg.append("a")
	   .attr("xlink:href", "https://www.oecd-ilibrary.org/economics/data/main-economic-indicators/international-trade_data-00045-en"+word)
	   .append("text")
	   .attr("y", height + 50)
	   .html('<a href = "https://www.oecd-ilibrary.org/economics/data/main-economic-indicators/international-trade_data-00045-en">My link</a>')
	   .attr("x", -margin.left)
	   .style("text-anchor", "left", "8")
	   .style("pointer-events", "none")
	   .style("fill", "black")
	   .style("front-size", "8px")
	   .text(word);


	// svg.append("text")
	//    .attr("y", height + 45)
	//    .attr("x", -margin.left)
	//    .style("text-anchor", "left", "8")
	//    .style("front-size", "8px")
	//    .text(word);


onclick="myFunction()"

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

};








