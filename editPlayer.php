<?php
include 'config.php';
date_default_timezone_set('GMT');

$playerQuery = mysql_query("SELECT * FROM player where name='$_POST[name]'");
$sql="";
$sqlDate="";

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
   
   $lastPlayed = $player['last_played'];

   if($player['last_played'] < date("Y-m-d")){
	$sqlDate="UPDATE player SET last_played= UTC_TIMESTAMP() where name='$_POST[name]';";
   }

}
else{
	$sql="INSERT INTO player (name, max_correct, max_finger, last_played) VALUES ('$_POST[name]',$_POST[maxCorrect],$_POST[maxFingers],UTC_TIMESTAMP());";
	$result = "Player Added";
}


if(!empty($sql)){
	if (!mysql_query($sql,$link)){
	 die('Error: ' . mysql_error());
	}
}

if(!empty($sqlDate)){
	if (!mysql_query($sqlDate,$link)){
	 die('Error: ' . mysql_error());
	}
}

$arrayRes = array ('success'=>true,'result'=>$result);
echo json_encode($arrayRes);

mysql_close($link);
?>