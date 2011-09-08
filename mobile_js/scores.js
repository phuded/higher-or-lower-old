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

/*Show player stats*/
$.showPlayerStats = function(pNum,show){
	if(show){
		//Hide scores
		$(".scoreTable").hide();
		//Set player name
		$("#scoreStats #stats_name").text(players[pNum]);
		
		var numGuesses = playersScores[pNum].length;
		var correct = 0;

		$.each(playersScores[pNum],function(i,v){
			if(v){
				correct++;
			}
		});
		
		var percentage = numGuesses>0?(correct*100/numGuesses).toFixed(1):"0.0";
		
		$("#scoreStats #stats_correct span").text(correct);
		$("#scoreStats #stats_incorrect span").text(numGuesses - correct);	
		$("#scoreStats #stats_percentage span").text(percentage+'%');		
		$("#scoreStats").show();
	}
	else{
		$(".scoreTable").show();
		$("#scoreStats").hide();
	}	
}