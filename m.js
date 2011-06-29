
$.prepareGame = function(){
	//Fix for navbar
	$('.page').live('pageshow',function (e){    
		if (window.location.hash != ''){    
			$('#navbar a').removeClass('ui-btn-active');
			$('#navbar a[href="'+window.location.hash+'"]').addClass('ui-btn-active');
		}    
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
		$("#playerRows div").each(function(){
			var playerName = $($(this).children("input")[0]).val();
			players.push(playerName);
			playersScores.push(new Array());

		});
		
		//Display Player
		$("#playerName").html("<strong>"+players[currentPlayer] + "</strong> guess higher or lower!");
		
		//New card
		currentCard = cards[Math.floor(Math.random()*cards.length)];
		
		//Hide any current card
		$("#cardDisplay").css("background-color","");
		$("#cardDisplay img").hide();
		
		//Close Dialogue
		$('.ui-dialog').dialog('close');
		//Display card
		$.displayCard(currentCard);
	}
};

//Display the card
$.displayCard = function(card){
	$("#cardDisplay img:visible").hide();
	$("#cardDisplay img#card"+card).show();
		
	var cardNum = parseInt(card.split("_")[0]);
	
	//Check if can display betting buttons
	if((cardNum>5 & cardNum<11) || $("#fullBetting").attr('checked')){
		$(".betButton").show();
	}
	else{
		$(".betButton").hide();
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
	//Add just made bet to total bet
	currentBet += parseInt($("#currentNumFingers").text());

	//Reset bet counter
	$("#currentNumFingers").text(0);
	
	//Get new card 
	var nextCard = cards[Math.floor(Math.random()*cards.length)];
	//Display card
	$.displayCard(nextCard);
	//Display results, and update scores and set next player
	$.displayTurnResults(higher,nextCard);
	
	//Finally make the current card the next one
	currentCard=nextCard;
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
			$("#drink div#pictureContainer span#drinkMessage").html("<b>"+oldPlayerName + "</b> you must drink...<br/><b>"+(currentBet>1?currentBet + " fingers!":currentBet + " finger!")+"</b>");
		}
		else{
			$("#drink div#pictureContainer span#drinkMessage").html("<b>"+oldPlayerName + "</b> you must drink...<br/>&nbsp;");
		}
		$.mobile.changePage( "#drink", { transition: "pop"} );
		currentBet =0;
	}
	$("#totalNumFingers").text(currentBet + " fingers");
	
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
	var numPlayers = $("#playerRows div").size();
	if(numPlayers < 6){
		//var gamePlayers = $("#player_1 select").html();
		var newPlayerRow = "<div id='player_"+(numPlayers +1)+"'>Player "+(numPlayers +1)+": <input title='Please enter your name' MAXLENGTH=8></input></div>";
		$(newPlayerRow).appendTo("#playerRows").page();
	}
};
		
$.delPlayerRow = function(){	
	var lastNum = $("#playerRows div").size();
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
			cards.push(i+"_hearts");
			cards.push(i+"_diamonds");
			cards.push(i+"_clubs");
			cards.push(i+"_spades");
		}
	}
	else{
		cards = new Array();
		for(var i =2;i<15;i++){
			cards.push(i+"_hearts");

		}
	}
};

$.compareCards = function(next,current){
	//Returns true if card 1 >= card 2
	return (parseInt(next.split("_")[0]) >= parseInt(current.split("_")[0]));
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