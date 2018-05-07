/**
* Data Processing
* Marwa Ahmed, student number 10747141
* Assignment: D3 Scatterplot
* Source data: https://www.oecd-ilibrary.org/economics/data/main-economic-indicators/international-trade_data-00045-en
**/


// call main function when whole code is loaded
window.onload = function() {
	getData();

};


/**
* This function gets the data from an API request and places it in a queue. 
* When all data is loaded it calls the function makeScatterplot, to make the scatterplot.
**/
function getData(){

	// API request
	var trade = "https://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+BEL+CAN+CHL+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";

	// put data in a queue, so the scatterplot will be made after everything is loaded
	d3.queue()
	  .defer(d3.request, trade)
	  .awaitAll(makeScatterplot);
};


/**
* This function converts the data from the API request into a JSON, 
* then extracts all needed data from the JSON and makes a scatterplot form that data.
**/
function makeScatterplot(error, response) {
	if (error) throw error;
	
	// convert data to JSON
	var dataTrade = JSON.parse(response[0].responseText);

	// number of years, countries, variables (import, export, net trade)
	var noYears = dataTrade.structure.dimensions.observation[4].values.length;;
	var noCountries = dataTrade.structure.dimensions.observation[1].values.length;
	var noVariables = dataTrade.structure.dimensions.observation[0].values.length;

	/**
	* Iterate through the JSON file to get the import, export and net value 
	* of each country for each year. Put info of each county into separate 
	* dictionaries (infoCountry), put all dicionaries in a list (dataCountry). 
	* Put the list in one Dictionary (infoYear).
	**/
	var infoYear = {};
	for (var year = 0; year < noYears; year++){

		var dataCountry = [];
		for (var country = 0; country < noCountries; country++){

	 		var infoCountry = {};
	 		for (var variable = 0; variable < noVariables; variable++){

	 		// get data/variables from each country from the JSON
			infoCountry[variable] = (dataTrade.dataSets[0].observations[variable + ":" + country + ":0:0:" + year][0]);
	 		}
	 		dataCountry.push(infoCountry);
		}
		infoYear[year] = dataCountry;
	}

	// put info of each year in a separate variable
	var infoYear1 = infoYear[0], infoYear2 = infoYear[1], infoYear3 = infoYear[2];

	// get country names from the JSON
	var countryName = [];
	for (var i = 0; i < 29; i++){
		countryName.push(dataTrade.structure.dimensions.observation[1].values[i].name);
	}

	/** 
	* Make scatterplot
	**/

	// set dimentions and margins of the graph
	var margin = {top: 50, right: 100, bottom: 100, left: 50};
	var width = 900 - margin.left - margin.right;
	var height = 550 - margin.top - margin.bottom/2;

	// create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("class", "svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom/2)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// make a tooltip, source: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
	var tooltip = d3.select("body")
					.append("div")
					.attr("class", "toolTip")
					.style("position", "absolute");

	// scale-function for the x-axis
	var xScale = d3.scaleLinear()
			  .domain([d3.min(infoYear[0], function(d){return d[1]}), d3.max(infoYear[0], function(d){
						return d[1]; })]).nice()
			  .range([margin.left, width - margin.right]);

	// scale-function for the y-axis
	var yScale = d3.scaleLinear()
					.domain([0, d3.max(infoYear[0], function(d){
						return d[0]; })]).nice()
					.range([height - margin.left, 0]);

	// scale-function for the radius of the circles, radius depends on the Net trade
	var minNet = d3.min(infoYear[0], function(d){return d[2]; });
	var maxNet = d3.max(infoYear[0], function(d){return d[2]; });
	var rScale = d3.scaleLinear()
					.domain([minNet, maxNet])
					.range([2, 8]);

	// I had some problems with the colors of the legend, thats why there are three different color scales here	
	// scale-function for the colors of the circles, color depends on the Net trade
	// var cScale = d3.scaleOrdinal(['#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'])
	// 				.domain([minNet, maxNet]);

	// scale-function for the colors of the circles, color depends on the Net trade
	var cScale = d3.scaleOrdinal(d3.schemeCategory20)
					.domain([minNet, maxNet]);

	// scale-function for the colors of the circles, color depends on the county
	var ccScale = d3.scaleOrdinal(d3.schemeCategory20)
				   .domain(countryName);

	// draw the x axis
	var xAxis = svg.append("g")
					  .attr("transform", "translate(0," + (height - margin.top) + ")")
					  .call(d3.axisBottom(xScale));

	// text label for the x-axis
	svg.append("text")
	   .attr("transform", "translate(" + (width/2) + " ," + height + ")")
	   .style("text-anchor", "middle")
	   .text("Import (x Billion)");

	// draw the y-axis
	var yAxis = svg.append("g")
					.attr("transform", "translate(" + margin.left + ", 0)")
					.call(d3.axisLeft(yScale));

	// text label for the y-axis
	svg.append("text")
	   .attr("transform", "rotate(-90)")
	   .attr("y", 0 - margin.left/2)
	   .attr("x", 0 - (height/2.5))
	   .attr("dy", "1em")
	   .style("text-anchor", "middle")
	   .text("Export (x Billion)");

	// title graph
	svg.append("text")
	   .attr("class", "title")
	   .attr("y", -margin.top/2)
	   .attr("x", width/2)
	   .style("text-anchor", "middle")
	   .style("font-size", "30px")
	   .text("International trade");

	// draw the datapoints
	svg.selectAll("circle")
		.data(infoYear[0])
		.enter()
		.append("circle")
		.attr("cx", function(d){
			// import
			return xScale(d[1]);
		})
		.attr("cy", function(d){
			// export
			return yScale(d[0]);
		})
		.attr("r", function (d){ 
			// net trade
			return rScale(d[2]);
		})
		.style("fill", function(d){
			return (cScale(d[2]));
		})

		// when hovering over the datapoints show name of country 
		.on("mousemove", function(d, i){
	            return tooltip
	              .style("left", d3.event.pageX - 20 + "px")
	              .style("top", d3.event.pageY - 20 + "px")
	              .style("display", "inline-block")
	              .text(countryName[i]);
	        })
		.on("mouseout", function(d){ 
			tooltip.style("display", "none");
		});

		// draw legend
		var legend = svg.selectAll(".legend")
						.data(ccScale.domain())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) { 
							return "translate(0," + i * 15 + ")"; 
						});

		// draw legend colored rectangles
		// the legend is not correct
		legend.append("rect")
			  .attr("x", width - margin.left)
			  .attr("width", 10)
			  .attr("height", 10)
			  .style("fill", function(d, i){ return ccScale(d[2])});

		// draw legend text
		legend.append("text")
			  .attr("x", width - margin.left/2)
			  .attr("y", 10)
			  .attr("dy", ".400em")
			  .style("text-anchor", "begin")
			  .text(function(d, i) { return countryName[i];
			  });
};

// this part doesnot work yet...
// source button code: https://www.w3schools.com/howto/howto_js_dropdown.asp

// var button = d3.selectAll(".year")
// 				.on("click", function () {
//
//						
// 				}
// 			)

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};




