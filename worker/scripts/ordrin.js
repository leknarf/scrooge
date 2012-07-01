var reqHandler = require('./request_handler.js');
var https = require('https');
var s3 = require('./s3.js');

module.exports = {
	newRequest: function (queueObj){
		generateResponse(queueObj);
	}
}

function generateResponse(q){
	var ordrinURL = "r-test.ordr.in"
	
	var qObj = JSON.parse(q);
	
	var params;//build rest of path using queue's params
	var zip = qObj['zip-code'];
	
	var options = {
		host: ordrinURL,
		path: '/dl/ASAP/77840/East+College+Station/715+University+Drive+?_auth=1,LkAHD4QSAAAA6RoMAABJug',
		method: 'GET'
	}
	
	var req = https.request(options, function(result){
		//pass this response to Fn that puts it to S3
		var responseString = "";
		result.on('data', function(chunk) {
			responseString += chunk;
		});

		result.on('end', function() {
			//at this point, the handler has the queue;
			console.log("got a response from Ordr.in");
			s3.post(q, responseString);
			//var responseObj = JSON.parse(responseString);
			//console.log(responseObj); 
		});
		
	});
	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}