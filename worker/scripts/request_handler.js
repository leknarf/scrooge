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
		user : 'scrooge-demo'
	},
	s3 : {
		s3_url : 'scrooge.leknarf.net',
		s3_folder : 'results',
		access_key_id : 'AKIAIWZWQG72NWWW7G3Q',
		access_key : '8RlneaSOIjyiXWgWjf7lWoyTomHofiYSx5LLFcIi'
	},
	ordrn : {
		access_key: 'LkAHD4QSAAAA6RoMAABJug'
	}
}

function getQueue() {

	var options = {
		host : 'api.github.com',
		path : '/users/' + config.git.user + '/gists',
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
			console.log(queue); 
		});
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

function handleQueue(queue){
	//loops over
	//takes parameters from queue object
}



