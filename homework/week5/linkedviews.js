/**
* Data Processing
* Marwa Ahmed, Student number 10747141
* Assignment: D3 Linked views
**/


window.onload = function() {
	console.log("it works");
	getData();

	var map = new Datamap({element: document.getElementById('container')});
};



/**
* This function gets the data from an API request and places it in a queue. 
* When all data is loaded it calls the function convertData.
**/
function getData(){

	// API request bli = betterLifeIndex
	var bli2015 ="http://stats.oecd.org/SDMX-JSON/data/BLI2015/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+IRL+ITA+JPN+MEX+NLD+NZL+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR+GBR+USA+BRA+RUS.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT+MN+WMN/all?&dimensionAtObservation=allDimensions";
	var bli2016 ="http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+IRL+ITA+JPN+MEX+NLD+NZL+NOR+POL+PRT+SVN+ESP+SWE+CHE+TUR+GBR+USA+BRA+RUS.JE+JE_EMPL+SC+SC_SNTWS+ES+ES_EDUA+EQ+EQ_WATER+HS+HS_SFRH.L.TOT+MN+WMN/all?&dimensionAtObservation=allDimensions";

	// put data in a queue, so the scatterplot will be made after everything is loaded
	d3.queue()
	  .defer(d3.request, bli2015)
	  .defer(d3.request, bli2016)
	  .awaitAll(convertData);
};


function convertData(error, response) {
	if (error) throw error;

	console.log(response);

};

