/**
* Course: Data Processing 
* Name: Marwa Ahmed 
* Student number: 10747141
* Assignment: D3 Linked views
**/


/**
* Call main function when whole code is loaded.
**/
window.onload = function() {
	dataMaps();
};


/**
* This function places the data for maps in a queue. When all data is loaded, it calls the function
* makeMaps, to make the map.
**/
function dataMaps(){
	d3.queue()
	.defer(d3.json, "QoLI.json")
	.awaitAll(makeMap)
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

