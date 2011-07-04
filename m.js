
$.prepareGame = function(){
	//Fix for navbar
	$('.page').live('pageshow',function (e){    
		if (window.location.hash != ''){    
			$('#navbar a').removeClass('ui-btn-active');
			$('#navbar a[href="'+window.location.hash+'"]').addClass('ui-btn-active');
		}    
	});
	
	$('#drink').live('pageshow',function(event){
			var fingers = $("#numFingers");
			
			fingers.animate({
				fontSize:'3.0em'
			}, 
			400,function() {
				fingers.animate({
					fontSize:'1.0em'
				 }, 
				 300,function() {
				 });
			});
		
	});
};


$.startGame = function(){
	
	var canPlay = true;
		
	//Check to ensure all player names are entered
	$("#playerRows div").each(function(){
		var playerName = $($(this).children("input")[0]).val();

		if(playerName == ""){
			canPlay = false;
		}
	});
		
	if(canPlay){
		//Reset player
		currentPlayer = 0;
		
		//Reset bet
		currentBet=0;
		$("#totalNumFingers").text(currentBet + " fingers");
		
		players = new Array();
		playersScores = new Array();
		//Restore all cards based on toggle
		$.resetPack();
		//Reset bet counter
		$("#currentNumFingers").text(0);
		
		//Set players in array
		$("#playerRows tr").each(function(){
			var playerName = $(this).find("input").val();
			players.push(playerName);
			playersScores.push(new Array());

		});
		
		//Display Player
		$("#playerName").html("<strong>"+players[currentPlayer] + "</strong> guess Higher or Lower!");
		
		//New card
		currentCard = cards[Math.floor(Math.random()*cards.length)];
		
		//Hide any current card
		$("#cardDisplay").css("background-color","");
		$("#cardDisplay img").hide();
		
		//Close Dialogue
		$.closeForm();
		//Display card
		$.displayCard(currentCard,"");
	}
};

//Display the card
$.displayCard = function(card,higher){
	$("#cardDisplay img:visible").hide();
	$("#cardDisplay img#"+card).show();
	
	if(higher!==""){
		$("#cardDisplay img#"+card).flip({
			direction:higher?'lr':'rl',
			speed: 250,
			color:"white"
		});
	}
		
	var cardNum = parseInt(card.substring(1));
	
	//Check if can display betting buttons
	if((cardNum>5 & cardNum<11) || $("#fullBetting").attr('checked')){
		$("#sliderBar").show();
	}
	else{
		$("#sliderBar").hide();
	}
	
	//Remove card if remove cards is enabled
	if($("#removeCards").attr('checked')){
		cards.remove(cards.indexOf(card));
		if(cards.length == 0){
			//If no cards left - reset pack
			$.resetPack();
		}
	}
};


$.nextTurn = function(higher){
	if(players.length>0){
		//Add just made bet to total bet
		currentBet += parseInt($("#currentNumFingers").val());

		//Reset bet counter
		$("#currentNumFingers").val(0).slider("refresh");
		
		//Get new card 
		var nextCard = cards[Math.floor(Math.random()*cards.length)];
		//Display card
		$.displayCard(nextCard,$.compareCards(nextCard,currentCard));
		//Display results, and update scores and set next player
		$.displayTurnResults(higher,nextCard);
		
		//Finally make the current card the next one
		currentCard=nextCard;
	}
};


//Determine if correct, update picture and text
$.displayTurnResults = function(higher, nextCard){

	var correct = false;
	var oldPlayerName = players[currentPlayer];
	
	//Depending on whether user pressed higher or lower - compare current card to next and display results
	if( (higher & $.compareCards(nextCard,currentCard)) || (!higher & $.compareCards(currentCard,nextCard)) ){
		correct=true;
	}
	
	//Show or hide Lee
	if(correct){
		$("#cardDisplay").css("background-color","green");
	}
	else{
		$("#cardDisplay").css("background-color","red");
		//Show Lee
		if(currentBet > 0){
			$("#drink div#pictureContainer span#drinkMessage").html("<b>"+oldPlayerName + "</b> you must drink...<br/><span id='numFingers'>"+(currentBet>1?currentBet + " fingers!":currentBet + " finger!")+"</span>");
		}
		else{
			$("#drink div#pictureContainer span#drinkMessage").html("<b>"+oldPlayerName + "</b> you must drink...<br/>&nbsp;");
		}
		//Load dialogue
		setTimeout('$.mobile.changePage( "#drink", { transition: "pop",changeHash: false} )', 600);	
		currentBet =0;
	}
	$("#totalNumFingers").text(currentBet + ((currentBet>1 || currentBet==0)?" fingers":" finger"));
	
	//Set the next plater
	$.setNextPlayer();
	
	$("#playerName").html("<strong>"+players[currentPlayer] + "</strong> guess Higher or Lower!");
};


//Get the next player from the array
$.setNextPlayer = function(){
	if((currentPlayer+1) == players.length){
		currentPlayer = 0;
	}
	else{
		currentPlayer++;
	}
};


$.addPlayerRow = function(){
	var numPlayers = $("#playerRows tr").size();
	var nextPlayer = numPlayers+1;
	if(numPlayers < 6){
		//var gamePlayers = $("#player_1 select").html();
		var newPlayerRow = "<tr id='player_"+nextPlayer+"'><td><input type='text' value='Player "+nextPlayer+"' MAXLENGTH=8/></td>";
		newPlayerRow += "<td><a id='search_"+nextPlayer+"' href='javascript:$.showPlayerList(true, "+nextPlayer+")' data-role='button' data-icon='search' data-iconpos='notext'>Choose</a></td>";
		newPlayerRow += "</tr>";
		
		$(newPlayerRow).appendTo("#playerRows").page();
	}
};
		
$.delPlayerRow = function(){	
	var lastNum = $("#playerRows tr").size();
	if(lastNum>1){
		$("#playerRows #player_"+lastNum).remove();
	}
};

$.addBet = function(fingers){
	$("#currentNumFingers").text(fingers);
}

//Reset the pack
$.resetPack = function(){
	if($("#wholePack").attr('checked')){
		cards = new Array();
		for(var i =2;i<15;i++){
			cards.push("h"+i);
			cards.push("d"+i);
			cards.push("c"+i);
			cards.push("s"+i);
		}
	}
	else{
		cards = new Array();
		for(var i =2;i<15;i++){
			cards.push("h"+i);

		}
	}
};

$.compareCards = function(next,current){
	//Returns true if card 1 >= card 2
	return (parseInt(next.substring(1)) >= parseInt(current.substring(1)));
};

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
			formContent.fadeIn();
			var num = playerList.data("playerNum");
			$("tr#player_"+num+" input").val(player);
		 });
	}
};

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var players = new Array();
var playersScores = new Array();

var currentCard;
var currentPlayer = 0;

var currentBet = 0; 

var cards = new Array();
