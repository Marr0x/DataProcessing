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
