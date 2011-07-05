//Custom function for closing menu
$.openForm = function(){

	//Get Player List
	$.ajax({
		type: "POST",
		url: "listPlayers",
		dataType: "json",
		success: function(json){							
			var options = ''; 
			for (var i = 0; i < json.length; i++) {
				options += "<li><a href='javascript:$.showPlayerList(false,&#39;"+json[i]+"&#39;)'>"+json[i]+"</a></li>";
			}
			$("div#playerList ul").append(options);
				
			//Show Form
			$.mobile.changePage( "#form", {
				transition: "fade",
				changeHash: false
			});
			
			$(".gameFlag").each(function(){
				if($(this).attr("checked")){
					$(this).next().addClass("ui-btn-active");
				}
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
					// Error!
		}
	});
};

//Custom function for closing menu
$.closeForm = function(){
	$.mobile.changePage( "#game", {
		transition: "fade",
		reverse:true,
		changeHash: false
	});
	document.title = 'HigherOrLower';	
};


//Custom function for opening Lee dialogue
$.openDialog = function(){
	$.mobile.changePage( "#drink", {
		transition: "pop",
		changeHash: false
	});
};

//Custom function for closing Lee dialogue
$.closeDialog = function(){
	$.mobile.changePage( "#game", {
		transition: "pop",
		reverse:true,
		changeHash: false
	});
	document.title = 'HigherOrLower';
};

//Custom function for closing menu
$.showPlayerList = function(show, player){
	var formContent = $(".gameForm");
	var playerList = $("#playerList");
	
	if(show){
		formContent.fadeOut(function() {
			playerList.fadeIn();
		 });		

		playerList.data("playerNum",player);
	}
	else{	
		playerList.fadeOut(function() {
			formContent.fadeIn('fast');
			var num = playerList.data("playerNum");
			$("tr#player_"+num+" input").val(player);
		 });
	}
};


//Slide
$.slideTab = function(rev,tab){
	$.mobile.changePage( "#"+tab, {
		transition: "slide",
		reverse:rev,
		changeHash: false
	});
	
	var navBar = $('#'+tab+'_navbar');
	navBar.find('a').removeClass('ui-btn-active');
	navBar.find('a[href="#'+tab+'"]').addClass('ui-btn-active');

};