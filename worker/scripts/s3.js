var reqHandler = require('./request_handler.js');
var aws = require('aws2js');
var sha = require('sha1');

module.exports = {
	post: function(reque, resp){
		postResponse(reque, resp);
	}
}

function postResponse(request, response){
	//console.log(r);
	request_hash = sha(request);
	
	var access_key_id = process.env.AWS_id;
	var access_key = process.env.AWS_key;
	
	var s3 = aws.load('s3', access_key_id, access_key);
	s3.setBucket('scrooge.leknarf.net');
	s3.putBuffer('results/' + request_hash +'.json', new Buffer(response, 'utf8'), 'public-read', {'content-type': 'text/javascript'}, function (error, result) {
		if (error) console.log(error)
	});
	
	return true;

}
