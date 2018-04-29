/**
* Data Processing
* Marwa Ahmed, student number 10747141
* Assignment JavaScript line graph
**/


/**
* Source function reqListener: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
* "To send an HTTP request, create an XMLHttpRequest object, open a URL, and send the request."
**/
function reqListener (){

	// return text received from server following a request
	var rawData = this.responseText;

	// split each row of data file
	var rows = rawData.split('\n', 365);

	// variables to store the dates and temperature separately 
	var date = [];
	var temp = [];
	var jsdates = []; 

	// split the date column from the temperature column
	for (var i = 0; i < rows.length; i++){
		var column = rows[i].split(',');
		date.push(column[0]);
		
		// '+' turns the temp into a javascript number
		temp.push(+column[1]);

		// turn dates into javascript dates
		// select year, month, day, put them in the string jsdate 
		var year = date[i].substring(0, 4);
		var month = date[i].substring(4, 6);
		var day = date[i].substring(6, 8);
		var jsdate = new Date(year + '-' + month + '-' + day);
		jsdates.push(jsdate);
	}


	/**
	* Function to transform the data to screen coordinates.
	*
	* Domain is a two-element array of the data bounds [domain_min, domain_max].
	* Range is a two-element array of the screen bounds [range_min, range_max].
	* range_min = alpha * domain_min + beta
	* range_max = alpha * domain_max + beta
	**/
	function createTransform(domain, range) {
		var domainMin = domain[0];
		var domainMax = domain[1];
		var rangeMin = range[0];
		var rangeMax = range[1];

		// formules to calculate the alpha and the beta
		var alpha = (rangeMax - rangeMin) / (domainMax - domainMin);
		var beta = rangeMax - alpha * domainMax;

		// returns the function for the linear transformation (y = a * x + b)
		return function(x){
			return alpha * x + beta;
		}
	}


	/** 
	* Draw the graph
	**/
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// range to draw x-axis, y-axis and data lines in
	var height = 500;
	var width = 900;
	var margin = 100;

	// draw y-axis line
	ctx.beginPath();
	ctx.moveTo(margin, margin);
	ctx.lineWidth = 2;
	ctx.lineTo(margin, height);
	ctx.stroke();

	// draw x-axis line
	ctx.beginPath();
	ctx.moveTo(margin, height);
	ctx.lineWidth = 2;
	ctx.lineTo(width, height);
	ctx.stroke();

	// title x and y axes & turn title y-axis
	ctx.font = "20px Arial";
	ctx.save();
	ctx.translate(0,0);
	ctx.rotate(-Math.PI/2);
	ctx.fillText("Temperature (Celsius)", -height + margin, 30);
	ctx.restore();
	ctx.font = "20px Arial";
	ctx.fillText("Month", width/2, height + margin/2);

	// title of graph
	ctx.font = "20px Arial";
	ctx.fillText("Average temperature in the De Bilt (NL) in 2017", margin * 3, margin/2);

	// coordinates y-as 
	var minTemp = Math.min(...temp); 
	var maxTemp = Math.max(...temp);
	var minYScreen = 100;
	var maxYScreen =  500;

	// function to transform temperature data into screen coordinates
	var tempTransform = createTransform([minTemp, maxTemp],[maxYScreen, minYScreen]);
	yAxis = []
	for (var i = 0; i < temp.length; i++){
		var y = tempTransform(temp[i]);
		yAxis.push(y);
	}

	// coordinates x-as 
	var minDate = Math.min(...jsdates);
	var maxDate = Math.max(...jsdates);
	var minXScreen = 100;
	var maxXScreen = 900;

	// function to transform dates into screen coordinates
	var dateTransform = createTransform([minDate, maxDate], [minXScreen, maxXScreen]);

	// transform dates in millisec and then in the right coordinates 
	xAxis = [];
	for (var i = 0; i < jsdates.length; i++){
		var millisec = jsdates[i].getTime();
		var x = dateTransform(millisec);
		xAxis.push(x);
	}

	// put values (temperatures) on y-axis (I know this is hardcoded...)
	// min and max temps are between -5 and 25 celsius
	var distanceTemp = (height - margin)/6;
	var yTemp = [25, 20, 15, 10, 5, 0, -5];
	ctx.font = "15px Arial";

	// '7' = going from -5 to 25 in steps of 5 
	var marginY = margin;
	for (var i = 0; i < 7; i++){
		ctx.fillText(yTemp[i], 75, marginY);
		marginY += distanceTemp;
	}

	// put months on the x-axis (12 months)
	var distanceMonth = (width - margin)/12;
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	ctx.font = "15px Arial";
	var marginX = margin;
	for (var i = 0; i < 12; i++){
		ctx.fillText(months[i], marginX, height + 25);
		marginX += distanceMonth;
	}

	// plot the data in the graph (start 1 Jan 2017, end 31 Dec 2017)
	ctx.beginPath();
	ctx.lineJoin="round";
	ctx.moveTo(xAxis[0], yAxis[0]);
	ctx.lineWidth = 1;
	for (var i = 0; i < xAxis.length; i++){
		ctx.lineTo(xAxis[i + 1], yAxis[i + 1]);		
		ctx.strokeStyle = "#0080ff";
	}
	ctx.stroke();
}

// request to get data from browser
var oReq = new XMLHttpRequest();
oReq.addEventListener('load', reqListener);
oReq.open("GET", "https://raw.githubusercontent.com/Marr0x/DataProcessing/master/homework/week2/data_temp_2017.csv");
oReq.send();

