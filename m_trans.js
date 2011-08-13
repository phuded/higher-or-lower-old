//Custom function for closing menu
$.openForm = function(){
	//Clear Search
	$("div#playerList input").val("");
	$('#playerList ul li').removeClass('ui-screen-hidden'); 
	
	//Show Form
	$.mobile.changePage( "#form", {
		transition: "fade",
		changeHash: false
	});

};

//Custom function for closing menu
$.closeForm = function(){
	$.mobile.changePage( "#game", {
		transition: "fade",
		reverse:true,
		changeHash: false
	});
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
};

//Show form panels - list 

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

//Generate drinkers tab
$.generateDrinkersTab = function(id,orderBy,dir){
	//Clear table
	var table = $("#drinkersTab table");
	//When clicking on headers - need to show loading again
	$.showLoading(true);	
	//Get state
	var sDir = table.data("sort");
	
	//If a column has ever been stored
	if(sDir){
		//if same column
		if(sDir.col==id){
			table.data("sort",sDir.dir=="asc"?{col:id,dir:"desc"}:{col:id,dir:"asc"});
		}
		//else set
		else{
			table.data("sort",{col:id,dir:dir});
		}
	}
	//else set
	else{
		table.data("sort",{col:id,dir:dir});
	}
	
	//Set var as actual direction
	sDir = table.data("sort").dir;
	//Remove classes from other columns
	table.find("tr th a span.ui-icon").removeClass("ui-icon-arrow-u ui-icon-arrow-d").addClass("ui-icon-info");
	$('.drinkers_header').attr("data-theme","c").removeClass("ui-btn-up-b ui-btn-hover-b").addClass("ui-btn-up-c");
	//Add class to current columns
	table.find("tr th:eq("+id+") a span.ui-icon").removeClass("ui-icon-info").addClass(sDir=="asc"?"ui-icon-arrow-u":"ui-icon-arrow-d");
	table.find("tr th:eq("+id+") a").attr("data-theme", "b").removeClass("ui-btn-up-c ui-btn-hover-c").addClass("ui-btn-up-b");

	$.ajax({
			type: "POST",
			url: "listScores",
			dataType:"json",
			data:"orderBy="+orderBy+"&dir="+sDir+"&num=12",
			success: function(json){
				//Remove again
				table.find("tr:gt(0)").remove();
				//Populate
				$.each(json, function(index,value){
					//Last Played Code
					/*
					var lastPlayed = value.lastPlayed;
					if(!lastPlayed){
						lastPlayed = "";
					}
					else{
						lastPlayed = lastPlayed.substring(8,10) + "/" + lastPlayed.substring(5,7) + "/"+ lastPlayed.substring(0,4);
					}
					table.append("<tr><td>"+(index+1)+"</td><td>" + value.name + "</td><td>" + value.maxFingers + "</td><td>" + value.maxCorrect + "</td><td>" + lastPlayed + "</td></tr>");
					*/
					table.append("<tr><td>"+(index+1)+"</td><td>" + value.name + "</td><td>" + value.maxFingers + "</td><td>" + value.maxCorrect + "</td></tr>");
				});
				$.showLoading(false);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				table.find("tr:gt(0)").remove();
				$.showLoading(false);
			}
	});
};

//Show loading on drinkers tab
$.showLoading = function(show){
	if(show){
		var table = $("#drinkersTab table");
		table.find("tr:gt(0)").remove();
		$(".spinner").show();
	}
	else{
		$(".spinner").hide();
	}
};