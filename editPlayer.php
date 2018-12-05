<?php
include 'config.php';
date_default_timezone_set('GMT');

$playerQuery = mysql_query("SELECT * FROM player where name='$_POST[name]'");
$result = "Player not in DB";

if(mysql_num_rows($playerQuery)){
   //exists
   $player = mysql_fetch_assoc($playerQuery);
   $result = "Not Updated";
   
   //Only sent if players last guess was wrong
   if($_POST[maxFingers] > $player['max_finger']){
	$sql="UPDATE player SET max_finger = $_POST[maxFingers] where name='$_POST[name]';";
	$result = "Updated Max Fingers";
   }
   //Only sent if players last guess was correct
   if($_POST[maxCorrect] > $player['max_correct']){
	$sql="UPDATE player SET max_correct= $_POST[maxCorrect] where name='$_POST[name]';";
	$result = "Updated Max Correct";
   }
   //Only sent if players last guess was incorrect
   if($_POST[maxIncorrect] > $player['max_incorrect']){
   	$sql="UPDATE player SET max_incorrect= $_POST[maxIncorrect] where name='$_POST[name]';";
   	$result = "Updated Max Incorrect";
   }
   
   $lastPlayed = $player['last_played'];

   if($player['last_played'] < date("Y-m-d")){
	$sqlDate="UPDATE player SET last_played= UTC_TIMESTAMP() where name='$_POST[name]';";
   }

}


if(isset($sql)){
	if (!mysql_query($sql,$link)){
	 die('Error: ' . mysql_error());
	}
}

if(isset($sqlDate)){
	if (!mysql_query($sqlDate,$link)){
	 die('Error: ' . mysql_error());
	}
}

$arrayRes = array ('success'=>true,'result'=>$result);
echo json_encode($arrayRes);

?>