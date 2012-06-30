var reqHandler = require('./request_handler.js');

module.exports = {
	post: function(response){
		postResponse(r);
	}
}

function postResponse(r){
	
	var params;//build params from passed in Ordrin response
	var options = {
		host: reqHandler.config.s3.url,
		path: '',
		method: 'POST'
	}
	
	var req = https.request(options, function(result){
		var responseString = "";
		response.on('data', function(chunk) {
			responseString += chunk;
		});

		response.on('end', function() {
			//s3's response
			var responseObj = JSON.parse(responseString);
		});
		
	});
	
	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}
