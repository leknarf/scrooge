var reqHandler = require('./request_handler.js');

module.exports = {
	newRequest: function (queueObj){
		generateResponse(queueObj);
	}
}

function generateResponse(q){
	var ordrinURL = "r-test.ordr.in"
	
	var params;//build rest of path using queue's params
	var options = {
		host: ordrinURL,
		path: '/dl/datetime,etc',
		method: 'GET'
	}
	
	var req = https.request(option, function(result){
		//pass this response to Fn that puts it to S3
		var responseString = "";
		response.on('data', function(chunk) {
			responseString += chunk;
		});

		response.on('end', function() {
			//at this point, the handler has the queue;
			var responseObj = JSON.parse(responseString);
			console.log(responseObj); 
		});
		
	});
	
	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}