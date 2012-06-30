
module.exports = {
	getQueue: getQueue(),
	handle: fn,
	popQueue: fn
}

//abstract the following config object; possibly put it in app.js

config: {
	
}

function getQueue(){
	options = {
		host: 'api.github.com',
		port: 80,
		path: '/repos/:user/:repo/git/blobs/'
	}
	
	https.request(options, function(res){
		
	});
}
