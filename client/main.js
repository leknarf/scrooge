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
		
	function gist(data){
		this.data;
		tempData = {};//initialize empty object for creating data gist
		tempData[key] = value;
		this.data = tempData;

		this.github_url = 'https://api.github.com/users/scrooge-demo/gists';//data for gists				
		this.sha = '';//store the sha we get
	}
	
	gist.prototype.list = function(){
		$.ajax({
			url: this.github_url+'?access_token='+access_token,
			type: 'GET',
			
	}
	
	gist.prototype.get = function(id){

		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+access_token,
			type: 'GET',
			success: function(response){
				console.log(response);
			}
		});
	}
	
	gist.prototype.post = function(){
		$.ajax({
			url: this.github_url+'?access_token='+access_token,
			type: 'POST',
			data: this.data,
			success: function(response){
				console.log(response);
			}
		});
	}
	
	gist.prototype.delete = function(id){
		$.ajax({
			url: this.github_url+'/'+id+'?access_token='+access_token,
			type: 'DELETE',
			success: function(response){
				console.log(response);
			}
		});
	}
	
	$("button[type=submit]").click(function(){
		g = new gist($("#key").val(),$("#value").val());
		g.post();
	});
});	