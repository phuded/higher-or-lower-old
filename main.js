
$.prepareGame = function(){
	
	//Make tabs
	$("#main").tabs();
	
	//Prepare higher and lower & form buttons
	$('button.gameM, #newGameForm button, #newGameButtons button').button();
	
	// Betting tools
	$("#currentNumFingers").text('0');
	
	//Prepare betting buttons
	$(".infoSlider button").button();
	
	//Set betting buttons
	$(".betButton").click(function(){
		$("#currentNumFingers").text($(this).attr("id").substring(3,4));
	});
	
	$("#bettingSlider").slider({
		range: "min",
		value: 0,
		min: 0,
		max: 4,
		slide: function( event, ui ) {
			$("#currentNumFingers").text(ui.value);
		}
	});
	
	$("#newGame").click(function(){
		//Reset form
		$.resetForm();
		
		//Get Player List
		$.ajax({
			type: "POST",
			url: "listPlayers",
			dataType: "json",
			success: function(json){							
				var options = ''; 
				for (var i = 0; i < json.length; i++) {
					options += '<option value="' + json[i] + '">' + json[i] + '</option>';
				}
				$("div#player_1 select").append(options);
				
				//Show Form
				$.showForm(true);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
					// Error!
			}
		});
		
	});
	
	$("#startGame").click(function(){
		
		var doNotPlay = false;
		
		//Check to ensure all player names are entered
		$("#newGameForm div").each(function(){
			var playerName = $($(this).children("input")[0]).val() + $($(this).children("select")[0]).text();

			if(playerName == ""){
				doNotPlay = true;
			}
		});
		
		if(!doNotPlay){
			$.showForm(false);
			$.startGame();
		}
	});
	
	$("#cancelGame").click(function(){	
		$.showForm(false);
	});
	
	$("#higher").click(function(){
		$.nextTurn(true);
	});
	
	$("#lower").click(function(){
		$.nextTurn(false);
	});
	
	
	$("#addPlayer").click(function(){
		var numPlayers = $("#newGameForm div").size();
		if(numPlayers < 6){
			var gamePlayers = $("#player_1 select").html();
			var newPlayerRow = "<div id='player_"+(numPlayers +1)+"'>Player "+(numPlayers +1)+": <input title='Please enter your name' MAXLENGTH=8></input> or select existing: <select title='Please select a player'>"+gamePlayers+"</select></div>";
			$(newPlayerRow).appendTo("#newGameForm");
		}
	});
		
	$("#removePlayer").click(function(){	
		var lastNum = $("#newGameForm div").size();
		if(lastNum>1){
			$("#newGameForm #player_"+lastNum).remove();
		}
	});
	
	//Disable higher or lower buttons by default
	$('button.game').attr("disabled", true);
	$('button.gameM').button( "option", "disabled", true );
	
	
	//Bind drinkers tab
	$('#main').bind('tabsselect', function(event, ui) {
		if(ui.index == 2){
			$.generateDrinkersTab(2,"max_finger","desc");
		}
			
	});

	
	$(document).keydown(function (e){
		if($("#gameTable").is(":visible") & players.length>0){
			//Up
			if(e.keyCode == 38){
				$.nextTurn(true);
			}
			//Down
			else if (e.keyCode == 40){
				$.nextTurn(false);
			}
			//Left or Right
			else if((e.keyCode == 37 || e.keyCode == 39) && $(document.activeElement).get(0) != $("#bettingSlider a").get(0)){
				var slider = $("#bettingSlider");
				var currentNumEl = $("#currentNumFingers");
				var currentNumFingers = parseInt(currentNumEl.text());
				
				if(e.keyCode == 37 & currentNumFingers > 0){
					slider.slider("value",currentNumFingers-1);
					currentNumEl.text(currentNumFingers-1);
				}
				else if(e.keyCode == 39 & currentNumFingers < slider.slider("option","max")){
					slider.slider("value",currentNumFingers+1);
					currentNumEl.text(currentNumFingers+1);
				}
			
			}
		}
	});
	
};

$.generateDrinkersTab = function(id,orderBy,dir){
	//Clear table
	var table = $("#drinkersTab table");
	table.find("tr:gt(0)").remove();
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
	table.find("tr th").removeClass("asc desc");
	//Add class to current columns
	table.find("tr th:eq("+id+")").addClass(sDir);

	$.ajax({
			type: "POST",
			url: "listScores",
			dataType:"json",
			data:"orderBy="+orderBy+"&dir="+sDir,
			success: function(json){							
				$.each(json, function(index,value){
					var lastPlayed = value.lastPlayed;
					if(!lastPlayed){
						lastPlayed = "";
					}
					else{
						lastPlayed = lastPlayed.substring(8,10) + "/" + lastPlayed.substring(5,7) + "/"+ lastPlayed.substring(0,4);
					}
					table.append("<tr><td>"+(index+1)+"</td><td>" + value.name + "</td><td>" + value.maxFingers + "</td><td>" + value.maxCorrect + "</td><td>" + lastPlayed + "</td></tr>");
				});
				$.showLoading(false);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				table.find("tr:gt(0)").remove();
				$.showLoading(false);
			}
	});
};

$.resetForm = function(){
	$("#newGameForm").find("div:gt(0)").remove();
	$("#newGameForm div:(0) select").html("");
	$("#player_1 input").val("");
	$("#fullBetting").attr('checked',false);
}


$.startGame = function(){
	//Reset player
	currentPlayer = 0;
	
	//Reset bet
	currentBet=0;
	$("#totalNumFingers").text(currentBet + " fingers");
	
	players = new Array();
	playersScores = new Array();
	
	//Reset scoretab
	$("#scoreTab").html("");
	
	//Reset beer
	$(".innerGamePanel").animate({backgroundPosition:'0px 375px'},700);
	
	//Create scoretab var
	var scoreTab = "<table class='scoreTable'>";
	
	//Set players in array
	$("#newGameForm div").each(function(){
		var inputName = $($(this).children("input")[0]).val();
		var playerName = inputName != ""?inputName:$($(this).children("select")[0]).val();
		players.push(playerName);
		playersScores.push(new Array());
		//Add in header row
		scoreTab += "<tr><th>"+playerName+"</th></tr>";
	});
	scoreTab += "</table>"
	
	//Append table to div
	$("#scoreTab").append(scoreTab);
	
	//Enable buttons
	$('button.game').attr("disabled",false);
	$('button.gameM').button( "option", "disabled", false);	
	
	//Infobar
	$("#playerBar").html("<strong>"+players[currentPlayer] + "</strong> guess Higher or Lower!");
	$("#pictureDisplay").hide();
	$("#infoBar").html("");
	
	//New card
	currentCard = (Math.floor(Math.random()*13)) + 2;
	$.displayCard(currentCard);
}


$.nextTurn = function(higher){
	
	//Add just made bet to total bet
	currentBet += parseInt($("#currentNumFingers").text());

	//Reset slider
	$("#bettingSlider").slider({value:0});
	$("#currentNumFingers").text(0);
	
	//Get new card 
	var nextCard = (Math.floor(Math.random()*13)) + 2;
	//Display card
	$.displayCard(nextCard, nextCard>=currentCard);
	
	//Display results, and update scores and set next player
	var correct = $.displayTurnResults(higher,nextCard);
	
	//Finally make the current card the next one
	currentCard=nextCard;
};

//Determine if correct, update picture and text
$.displayTurnResults = function(higher, nextCard){

	var correct = false;
	var oldPlayerName = players[currentPlayer];
	//Depending on whether user pressed higher or lower - compare current card to next and display results
	if(higher){
		if(nextCard >= currentCard){
			$("#infoBar").html("<font size='5' color='#4297D7'>Correct!</font><p>");
			correct=true;
		}
		else{
			$("#infoBar").html("<font size='5' color='red'><strong>"+oldPlayerName + "</strong>, YOU MUST DRINK" +	(currentBet>0?(currentBet>1?"<BR/>"+currentBet + " fingers":"<BR/>"+currentBet + " finger"):"") +"!</font>");
		}
	}
	else{
		if(nextCard <= currentCard){
			$("#infoBar").html("<font size='5' color='#4297D7'>Correct!</font>");		
			correct=true;		
		}
		else{
			$("#infoBar").html("<font size='5' color='red'><strong>"+oldPlayerName + "</strong>, YOU MUST DRINK" +	(currentBet>0?(currentBet>1?"<BR/>"+currentBet + " fingers":"<BR/>"+currentBet + " finger"):"") +"!</font>");
		}	
	}
	
	
	var winningRun = 0;
	
	if(correct){
		//Add 1 for turn just won
		winningRun = 1;
		//Determine any winning streak
		for(var i = playersScores[currentPlayer].length; i--; i>=0){
			var prevTurn = playersScores[currentPlayer][i];
			if(prevTurn){
				winningRun++;
			}
			else{
				break;
			}
		}
	}
	
	//Update DB
	$.ajax({
		type: "POST",
		url: "editPlayer",
		data: "name="+oldPlayerName+"&maxFingers="+(correct?0:currentBet)+"&maxCorrect="+winningRun,
		success: function(msg){							
			//Updated!
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			// Error!
		}
	});
	
	
	//Show or hide Lee
	if(correct){
		$("#pictureDisplay").hide();
		$("#totalNumFingers").text(currentBet + " fingers");
		//Y position of glass
		var offset = 375-currentBet*30;
		offset = (offset < 0)?0:offset;
		$(".innerGamePanel").animate({backgroundPosition:'0px ' + offset+'px'},900);
	}
	else{
		$("#pictureDisplay").show();
		//Reset bet
		currentBet =0;
		$("#totalNumFingers").text(currentBet + " fingers");
		$(".innerGamePanel").animate({backgroundPosition:'0px 375px'},700);
	}
	
	//Update the score
	$.updateScore(correct, currentPlayer);
	
	//Set the next plater
	$.setNextPlayer();
	
	$("#playerBar").html("<strong>"+players[currentPlayer] + "</strong> guess Higher or Lower!");
	
	return correct;
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
	
	var numCols = $("#main").css("width");
	numCols = numCols.substring(0,numCols.length-2);
	numCols = Math.round(numCols/53);
	
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

//Get the next player from the array
$.setNextPlayer = function(){
	if((currentPlayer+1) == players.length){
		currentPlayer = 0;
	}
	else{
		currentPlayer++;
	}
};

//Display the card
$.displayCard = function(cardNum, higher){
	$("#cardDisplay img:visible").hide();
	$("#cardDisplay img#card"+cardNum).show();
	
	$("#cardDisplay img#card"+cardNum).flip({
		direction:higher?'lr':'rl',
		speed: 200
	});
	
	//Check if can display slider
	if((cardNum>5 & cardNum<11) || $("#fullBetting").attr('checked')){
		$(".infoSlider").show();
	}
	else{
		$(".infoSlider").hide();
	}
};

//For mobile - show/hide form
$.showForm = function(show){

	if(show){
		$("#gameTable").hide();
		$("#newGameForm").show();
		$("#newGameButtons").show();
	}
	else{
		$("#gameTable").show();
		$("#newGameForm").hide();
		$("#newGameButtons").hide();
	}
};

$.showLoading = function(show){
	if(show){
		$(".spinner").show();
	}
	else{
		$(".spinner").hide();
	}
};


var players = new Array();
var playersScores = new Array();

var currentCard;
var currentPlayer = 0;

var currentBet = 0; 