$(document).ready(function(){
	
	//localStorage will store an array of objects of data gists
	/*localStore = function(){
		return localStorage.setItem(this.key,JSON.stringify(this.value))
	}
	
	
	localGet = function(){
		return JSON.parse(localStorage.getItem(this.key));
	}*/		

	var access_token = "bcd040c99bfc7b878c6f49710558bca51ff24094";
	//for github user "scrooge-demo"
		
	function gist(payload){
		this.data = {
			'public': true,
			'files': {
				'request.json': {
					'contents': JSON.stringify(payload)
				}
			}
		};
		
		this.github_url = 'https://api.github.com/gists';//data for gists
	}
	
	gist.prototype.list = function(){
		$.ajax({
			url: this.github_url+'?access_token='+access_token,
			type: 'GET',
			success: this.success
		});
	}
	
	gist.prototype.get = function(id){
		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+access_token,
			type: 'GET',
			success: this.success
		});
	}
	
	gist.prototype.post = function(){
		$.ajax({
			url: this.github_url+'?access_token='+access_token,
			type: 'POST',
			data: this.data,
			success: this.success
		});
	}
	
	gist.prototype.delete = function(id){
		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+access_token,
			type: 'DELETE',
			success: this.success
		});
	}
	
	gist.prototype.success = function(response){
		console.log(response);
	}
	
	$("button[type=submit]").click(function(){
		var payload = $("#payload").val();
		if(!payload){
			payload = '{}';
		}
		try{
			payload = JSON.parse(payload);
		}catch(err){
			console.log(err);
			alert('Could not parse your payload properly. See console for error message.');
			return;
		}
		g = new gist({'payload': payload});
		var action = $(this).text();
		if(action == 'POST'){
			g.post();
		} else if(action == 'LIST'){
			g.list();
		}
	});
	
});	