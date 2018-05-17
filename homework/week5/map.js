/**
* Course: Data Processing 
* Name: Marwa Ahmed 
* Student number: 10747141
* Assignment: D3 Linked views
**/

window.onload = function() {
	dataMaps();

};

/**
* This function places the data for maps in a queue
**/
function dataMaps(){
	d3.queue()
	.defer(d3.json, "QoLI.json")
	.awaitAll(makeMap)

};
