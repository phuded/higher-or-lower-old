
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
				$.showForm(true, false);
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
			$.showForm(false, true);
		}
	});
	
	$("#cancelGame").click(function(){	
		$.showForm(false, false);
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
			//Clicking on tab - remove any previous saved column config
			$("#drinkersTab table").removeData("sort");
			$.generateDrinkersTab(2,"max_finger","desc");
		}
			
	});

	//Bind key presses
	$(document).keydown(function (e){
		if($("#gameTable").is(":visible") & players.length>0){
			//Up
			if(e.keyCode == 38){
				var hButton = $("#higher");
				hButton.css({'background' : 'url("images/up_arrow_glow.png") no-repeat scroll 0 0 transparent'});
				setTimeout(function() {
					hButton.removeAttr('style');

				}, 200);
				$.nextTurn(true);
			}
			//Down
			else if (e.keyCode == 40){
				var lButton = $("#lower");
				lButton.css({'background' : 'url("images/down_arrow_glow.png") no-repeat scroll 0 0 transparent'});
				setTimeout(function() {
					lButton.removeAttr('style');
				}, 200);
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
	
	//Reset options
	$("#fullBetting").attr('checked',false);
	$("#removeCards").attr('checked',false);
	$("#wholePack").attr('checked',false);
	
};


$.startGame = function(){
	//Reset player
	currentPlayer = 0;
	
	//Reset bet
	currentBet=0;
	$("#totalNumFingers").text(currentBet + " fingers");
	
	players = new Array();
	playersScores = new Array();
	//All cards available
	$.resetPack();
	
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
	currentCard = cards[Math.floor(Math.random()*cards.length)];
	$.displayCard(currentCard);
}


var players = new Array();
var playersScores = new Array();

var currentCard;
var currentPlayer = 0;

var currentBet = 0; 

var cards = new Array();