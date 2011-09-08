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