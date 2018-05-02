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
	var net = "http://stats.oecd.org/SDMX-JSON/data/MEI_TRD/XTEXVA01+XTIMVA01+XTNTVA01.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.CXML.A/all?startTime=2015&endTime=2017&dimensionAtObservation=allDimensions";

	d3.queue()
	  .defer(d3.request, net)
	  .awaitAll(doFunction);
};


/**
*
*
**/
function doFunction(error, response) {
	if (error) throw error;
	console.log(response);
	
	var dataNet = JSON.parse(response[0].responseText)
	
	console.log(dataNet);
	console.log(dataNet.dataSets[0].observations["0:0:0:0:0"][0])

	// number of years, countries, variables
	noYears = 3;
	noCountries = 35;
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

};








