var https = require('https');
var ordrin = require('./ordrin.js');
var s3 = require('./s3.js');

module.exports = {
	getQueue : function() {
		getQueue();
	},
	handle : function() {

	},
	popQueue : function() {

	},
	config: function(){
		return config;
	}
}

//abstract the following config object; possibly put it in app.js

config = {
	git : {
		user : 'scrooge-demo',
		token: 'cd056fe085c2210e24cabcd088be7f9b0babd73e'
	},
	s3 : {
		s3_url : 'scrooge.leknarf.net',
		s3_folder : 'results'
	},
	ordrn : {
		access_key: 'LkAHD4QSAAAA6RoMAABJug'
	}
}

function getQueue() {

	var options = {
		host : 'api.github.com',
		path : '/users/' + config.git.user + '/gists?access_token='+ config.git.token,
		method : 'GET'
	}

	var req = https.request(options, function(response) {
		var queueString = "";
		response.on('data', function(chunk) {
			queueString += chunk;
		});

		response.on('end', function() {
			//at this point, the handler has the queue;
			var queue = JSON.parse(queueString);
			handleQueue(queue);
		});
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

function handleQueue(queue){
	queue.forEach(function(val, i, arr){
		getGist(val);
	});
}

function getGist(gistObj){

	var options = {
		host : 'api.github.com',
		path : '/gists/' + gistObj.id +'?access_token='+ config.git.token,
		method : 'GET'
	}

	gistRequest = https.request(options, function(response){

		var content = "";

		response.on('data', function(chunk) {
			content += chunk;
		});

		response.on('end', function() {
			var gist = JSON.parse(content);
			console.log("new request: " + gist["files"]["request.json"].content);
			ordrin.newRequest(gist["files"]["request.json"].content);
		});
	});

	gistRequest.end();
}
