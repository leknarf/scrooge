$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(document).ready(function(){
	
	//localStorage will store an array of objects of data gists
	/*localStore = function(){
		return localStorage.setItem(this.key,JSON.stringify(this.value))
	}
	
	
	localGet = function(){
		return JSON.parse(localStorage.getItem(this.key));
	}*/		
		
	function gist(p){
		this.github_url = 'https://api.github.com/gists';//data for gists
		this.access_token = "cd056fe085c2210e24cabcd088be7f9b0babd73e";
		//for github user "scrooge-demo"
		this.sha1 = 0;//initialize to 0
		this.response = '';
		
		this.payload = p;
		this.data = {
			'public': false,
			'files': {
				'request.json': {
					'content': JSON.stringify(this.payload)
				}
			}
		};
		
	}

	//get list of gists	
	gist.prototype.list = function(){
		$.ajax({
			url: this.github_url+'?access_token='+this.access_token,
			type: 'GET',
			success: this.success,
			error: this.error
		});
	};
	
	//get a specific gist
	gist.prototype.get = function(id){
		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+this.access_token,
			type: 'GET',
			success: this.success,
			error: this.error
		});
	};
	
	//create a new gist
	gist.prototype.post = function(){
		$.ajax({
			url: this.github_url+'?access_token='+this.access_token,
			type: 'POST',
			data: JSON.stringify(this.data),
			success: this.success,
			error: this.error
		});
	};
		
	gist.prototype.success = function(response){
		console.log(response);
		this.response = response;
		return true;
	};

	gist.prototype.error = function(response){
		console.log(response);
		this.response = response;
		return false;
	};
	
	gist.prototype.getHash = function(){
		if(this.sha1 == 0){
			this.sha1 = JSON.stringify(this.payload);
		}
		return this.sha1
	}
	
	function s3(g,c){
		this.s3_url = "http://scrooge.leknarf.net.s3-website-us-east-1.amazonaws.com/results/";//base url
		this.gist = g;//gist object
		this.t = '';//timeout variable
		this.tInterval = 2000;//milliseconds
		this.callback = c;//a callback when it finds the json in s3 with response
	}
	
	s3.prototype.poll = function(){
		$.ajax({
			url: this.s3_url+g.getHash()+'.json',
			type: 'GET',
			success: this.success,
			error: this.error
		});
	}
	
	s3.prototype.success = function(response){
		console.log('Success!');
		console.log(response);
		clearTimeout(this.t);
		return response;
	};

	s3.prototype.error = function(response){
		console.log('Error!');//error means file doesn't exist yet
		console.log(response);
		this.t = setTimeout(this.poll,this.tInterval);
		return response;
	};
	
	$("#clientRequest").submit(function(e){
		e.preventDefault();//stop form submission
		var payload = $("#clientRequest").serializeObject()
		g = new gist(payload);
		p = g.post();
		
		//at this point, it's posted.
		//initialize an s3 that deals with it
		s = new s3(g);
		s.poll();
		
	});
	
	$("#zipcode").mask("99999");
	
});	