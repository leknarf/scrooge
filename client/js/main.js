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
		this.s = '';
		
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

	//create a new gist
	gist.prototype.post = function(){
		var that = this;
		$.ajax({
			url: that.github_url+'?access_token='+that.access_token,
			type: 'POST',
			data: JSON.stringify(that.data),
			success: function(response){
				console.log(response);
				that.response = response;
				$.meow({
					title: 'A request was submitted',
					message: 'Please wait as our web felines run around.',
					icon: 'nyan-cat.gif',
					sticky: false,
					closeable: true
				});
		
				//make an s3 listener
				that.s = new s3(that);
				//start listening
				that.s.poll(that.s);
		
				return true;
			},
			error: function(jqXHRobj,response,err){
				that.response = response;
				$.meow({
					title: 'The request failed to submit!',
					message: 'Please wait as we run around like headless chickens.',
					icon: 'http://t3.gstatic.com/images?q=tbn:ANd9GcTGZlksZT_IR-8hrPIaVoJ284RpCU9NghAJm81XVjTP4KPhwJhQzEn69r4',
					sticky: false,
					closeable: true
				});
		
				return false;
			}
		});
	};

	
	gist.prototype.getHash = function(){
		if(this.sha1 == 0){
			this.sha1 = window.sha(JSON.stringify(this.payload));
		}
		return this.sha1
	}
	
	function s3(g){
		this.s3_url = "http://scrooge.leknarf.net/results/";//base url
		this.gist = g;//gist object
		this.t = '';//timeout variable
		this.tInterval = 2000;//milliseconds
		this.table = '';
	}
	
	s3.prototype.poll = function(self){
		var that = self;
		$.ajax({
			url: that.s3_url+that.gist.getHash()+'.json',
			type: 'GET',
			success: function(response){
				console.log('Success!');
				console.log(response);
				clearTimeout(that.t);
				$.meow({
					title: 'A request was finished.',
					message: 'Results are now displayed in the accordion below.',
					icon: 'nyan-cat.gif',
					sticky: true,
					closeable: true
				});
		
				$("#accordion").append('<h3><a href=\'#\'></a></h3>').append('<div>'+response+'</div>').data('response',JSON.parse(response)).accordion();		
			},
			error: function(jqXHRobj,response,err){
				//error means file doesn't exist yet
				that.t = setTimeout(function(){that.poll(that)},that.tInterval);
				return response;
			}
		});
	}

	
	$("#clientRequest").submit(function(e){
		//stop form submission
		e.preventDefault();
		//make a gist request
		g = new gist($("#clientRequest").serializeObject());
		//create the gist
		g.post();
	});
	
	$("#zip-code").mask("99999");
	$("#accordion").accordion();
});	

