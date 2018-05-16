/**
* Course: Data Processing 
* Name: Marwa Ahmed 
* Student number: 10747141
* Assignment: D3 Linked views
**/


/*
* Data for maps 
*/
function dataMaps(){
	d3.queue()
	.defer(d3.json, "QoLI.json")
	.awaitAll(makeMap)

};

function makeMap(error, data){
	if (error) throw error;

	console.log(data[0])
	console.log(data[0].data2016.BEL.qualityOfLifeIndex)
	
	var dataset2015 = data[0].data2015;
	var dataset2016 = data[0].data2016;

	console.log(dataset2015.BEL.qualityOfLifeIndex)

	// var onlyValues = data.map(function(d, i){ 
	// 	return data[0].data2015[i].qualityOfLifeIndex; });
	
	// var minValue = Math.min.apply(null, onlyValues),
 //        maxValue = Math.max.apply(null, onlyValues);

	// var paletteScale = d3.scale.linear()
 //            .domain([minValue,maxValue])
 //            .range(["#EFEFFF","#02386F"]);

// var color =  
// (["#f8f9c5", "#f4f79e", "#e5f756", "#d2f796", "#bbf263", "#aef756", "#8ff865", "#7ff265","#5def56","28a837"])


	var map = new Datamap({
		element: document.getElementById('container'),
		fills: {
			defaultFill: 'rgba(0,0,0,0.1)'
		},
		scope: 'world',
		data: dataset2015,
	
	done: function(datamap) {
		datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography){
			make(geography.properties.name);
		});
	}

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
	
	geographyConfig: {
		borderColor: "white",
		popupOnHover: true,
		highlightOnHover: true,
		highlightFillColor: "lightgreen",


		popupTemplate: function(geo, data){
			return ['<div class="hoverinfo"><strong>',
			'Country: </strong>'+ geo.properties.name, '</br>' + 
			'<strong>Quality of Life Index: </strong>', data.qualityOfLifeIndex + '</div>'].join('');
		}
	}


	});

};