/**
* Data Processing
* Marwa Ahmed, student number 10747141
*
**/

function reqListener (){

	var raw_data = this.responseText;


	// split each row
	var rows = raw_data.split('\n', 365)

	// variables to store the dates and temperature separately 
	var date = []
	var temp = []
	var jsdates = [] 

	// split the date from the temperature
	for (i = 0; i < rows.length; i++){
		var column = rows[i].split(',')
		date.push(column[0])
		
		// '+' makes the temp a javascript number
		temp.push(+column[1])

		// turn dates into javascript dates 
		var year = date[i].substring(0, 4)
		var month = date[i].substring(4, 6)
		var day = date[i].substring(6, 8)
		var jsdate = new Date(year + '-' + month + '-' + day)
		jsdates.push(jsdate)
	}


	/**
	* Function to transform the data to screen coordinates
	*
	**/
	function createTransform(domain, range) {
		// domain is a two-element array of the data bounds [domain_min, domain_max]
		// range is a two-element array of the screen bounds [range_min, range_max]
		// this gives you two equations to solve:
		// range_min = alpha * domain_min + beta
		// range_max = alpha * domain_max + beta
				// a solution would be:

		var domain_min = domain[0]
		var domain_max = domain[1]
		var range_min = range[0]
		var range_max = range[1]

		// formules to calculate the alpha and the beta
		var alpha = (range_max - range_min) / (domain_max - domain_min)
		var beta = range_max - alpha * domain_max

		// returns the function for the linear transformation (y = a * x + b)
		return function(x){
			return alpha * x + beta
		}
	}


	/** 
	* draw the graph
	*
	**/


	var canvas = document.getElementById('canvas')

	var ctx = canvas.getContext('2d')


	// coordinates y-as 
	var min_temp = Math.min(...temp) 
	var max_temp = Math.max(...temp)
	var min_y_screen = 50
	var max_y_sreen = 125


	var temp_transform = createTransform([min_temp, max_temp],[max_y_sreen, min_y_screen])

	y_axis = []
	for (i = 0; i < temp.length; i++)
	{
		var y = temp_transform(temp[i])
		y_axis.push(y)
	}
	console.log(y_axis)

	// coordinates x-as 
	var min_date = Math.min(...jsdates)
	var max_date = Math.max(...jsdates)
	var min_x_screen = 50
	var max_x_screen = 250

	// 
	var date_transform = createTransform([min_date, max_date], [min_x_screen, max_x_screen])

	// transform dates in millisec and then in the right coordinates 
	x_axis = []
	for (i = 0; i < jsdates.length; i++)
	{
		var millisec = jsdates[i].getTime()

		var x = date_transform(millisec)

		x_axis.push(x)
	}
	console.log(x_axis)


	// 
	var height = 125
	var width = 250 
	var margin = 50


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

	// title x and y axes

	
	ctx.font = "8px Arial"
	
	ctx.save()
	ctx.translate(0,0)
	ctx.rotate(-Math.PI/2)
	ctx.fillText("temperature", -height, 30)
	ctx.restore()
	ctx.font = "8px Arial"
	ctx.fillText("Year 2017", width/2, 145)

	// values y-axis 
	var len_y = (height - margin)/6
	var y_temp = [25, 20, 15, 10, 5, 0, -5]
	ctx.font = "6px Ariel"

	var margin_y = margin
	for (i = 0; i < 7; i++)
	{
		ctx.fillText(y_temp[i], 35, margin_y)
		margin_y += len_y

	}


	// months on the x-axis
	var len_month = (width - margin)/12
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
	ctx.font = "7px Arial"

	for (i = 0; i < 12; i++)
	{
		ctx.fillText(months[i], margin, 135)
		margin += len_month
	}

	// title 
	ctx.font = "10px Arial";
	ctx.fillText("Temperature at the De Bilt",10,10);


	// plot data in graph
	ctx.beginPath();
	ctx.lineJoin="round";
	ctx.moveTo(x_axis[0], y_axis[0]);
	ctx.lineWidth = 1;

	for (i = 0; i < x_axis.length; i++)
	{
		ctx.lineTo(x_axis[i + 1], y_axis[i + 1]);
	}
	ctx.stroke();

}


// new request, to get data from browser
var oReq = new XMLHttpRequest();
oReq.addEventListener('load', reqListener);
oReq.open("GET", "https://raw.githubusercontent.com/Marr0x/DataProcessing/master/homework/week2/data_temp_2017.csv");
oReq.send();
























