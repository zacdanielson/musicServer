$(document).ready(function(){ 
	$("#serialize").click(function(){ 
		var myobj = {track:$("#track").val(),title:$("#title").val(),artist:$("#artist").val(),album:$("#album").val(),length:$("#length").val(),plays:$("#plays").val(),path:$("#path").val()}; 
		jobj = JSON.stringify(myobj); 
		$("#json").text(jobj);
		var url = "song"; 
		$.ajax({ 
			url:url, 
			type: "POST", 
			data: jobj, 
			contentType: "application/json; charset=utf-8", 
			success: function(data,textStatus) { 
				$("#done").html(textStatus); 
			} 
		})
	}); 
	
	$("#getThem").click(function() { 
		$.getJSON('song', function(data) { 
			console.log(data); 
			var everything = "<ul>"; 
			for(var comment in data) { 
				com = data[comment]; 
				everything += "<li>Title: " + com.title + " -- Artist: " + com.artist + " -- Path" + com.path + "</li>"; 
			} 
			everything += "</ul>"; 
			$("#songs").html(everything); 
		}) 
	})

});

angular.module('songServer', [])
.controller('MainCtrl', [
	'$scope','$http',
	function($scope, $http) {
		$scope.songDB = [];
		$scope.play = function(song) {
			$scope.path = "/uploads/" + song.title;
			var audio = document.getElementById('audio');
        		audio.load(); //call this to just preload the audio without playing
        		audio.play(); //call this to play the song right away
			$scope.test = song.title + " - " + song.artist;
		};
		$scope.getAll = function() {
			console.log("inside the GETALL");
			return $http.get('/song').success(function(data) {
				angular.copy(data, $scope.songDB);
			});
		};
		
		$scope.getAll();
	}]); 
	

	
