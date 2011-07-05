
$.prepareGame = function(){

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
		
		//Reset scoretab
		$("#scoreTab").html("");
		//Create scoretab var
		var scoreTab = "<table class='scoreTable'>";
		
		//Set players in array
		$("#playerRows tr").each(function(){
			var playerName = $(this).find("input").val();
			players.push(playerName);
			playersScores.push(new Array());
			//Add in header row
			scoreTab += "<tr><th>"+playerName+"</th></tr>";
		});
		scoreTab += "</table>"
	
		//Append table to div
		$("#scoreTab").append(scoreTab);
	
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
		setTimeout('$.openDialog()', 600);	
		currentBet =0;
	}
	$("#totalNumFingers").text(currentBet + ((currentBet>1 || currentBet==0)?" fingers":" finger"));
	
	//Update the score
	$.updateScore(correct, currentPlayer);
	
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

//Update the score for a player
$.updateScore = function(correct, oldPlayer){
	//Add score to array and score tab
	playersScores[oldPlayer].push(correct);
	
	//Get the row object for the old player
	var playerScoreRow = $("#scoreTab table tr:eq("+oldPlayer+")");

	$.addScoreCol(playerScoreRow,correct,oldPlayer);
};

//Add a new column to the score tab
$.addScoreCol = function(playerScoreRow,correct, playerId){
	//If table is full - delete first row before adding latest
	
	var numCols = 6;
	
	if(playerScoreRow.children("td").size() == numCols){
		playerScoreRow.find("td:eq(0)").remove();
	}
	if(correct){
		playerScoreRow.append("<td class='correct'>" + playersScores[playerId].length)
	}
	else{
		playerScoreRow.append("<td class='incorrect'>" + playersScores[playerId].length)
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
