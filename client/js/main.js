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
		
	function gist(payload){
		this.access_token = "cd056fe085c2210e24cabcd088be7f9b0babd73e";
		this.payload = payload;
		//for github user "scrooge-demo"
		
		this.data = {
			'public': false,
			'files': {
				'request.json': {
					'content': JSON.stringify(this.payload)
				}
			}
		};
		
		this.github_url = 'https://api.github.com/gists';//data for gists
	}
	
	gist.prototype.list = function(){
		$.ajax({
			url: this.github_url+'?access_token='+this.access_token,
			type: 'GET',
			success: this.success
		});
	};
	
	gist.prototype.get = function(id){
		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+this.access_token,
			type: 'GET',
			success: this.success
		});
	};
	
	gist.prototype.post = function(){
		$.ajax({
			url: this.github_url+'?access_token='+this.access_token,
			type: 'POST',
			data: JSON.stringify(this.data),
			success: this.success
		});
	};
		
	gist.prototype.success = function(response){
		console.log(response);
	};
	
	function s3(payload){
		this.s3_url = "http://scrooge.leknarf.net.s3-website-us-east-1.amazonaws.com/results/";
		this.payload = payload;
		
		$.ajax({
			url: this.s3_url,
			type: 'GET',
			success: this.success,
			error: this.error
		});
	}
	
	s3.prototype.success = function(response){
		console.log('Success!');
		console.log(response);
	};

	s3.prototype.error = function(response){
		console.log('Error!');
		console.log(response);
	};
	
	$("#clientRequest").submit(function(e){
		e.preventDefault();//stop form submission
		var payload = $("#clientRequest").serializeObject()
		g = new gist(payload);
		g.post();
		
	});
	
	$("#zipcode").mask("99999");
	
});	