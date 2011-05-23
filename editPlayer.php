<?php
$link = mysql_connect('higherorlower.db.7613256.hostedresource.com', 'higherorlower', 'Phuded32');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("higherorlower", $link);

$playerQuery = mysql_query("SELECT * FROM player where name='$_POST[name]'");
$sql="";

if(mysql_num_rows($playerQuery)){
   //exists
   $player = mysql_fetch_assoc($playerQuery);
   $exists = "not updated.";
   
   if($_POST[maxFingers] > $player['max_finger']){
	$sql="UPDATE player SET max_finger = $_POST[maxFingers] where name='$_POST[name]'";
	$exists = "updated.";
   }
   
   if($_POST[maxCorrect] > $player['max_correct']){
	$sql="UPDATE player SET max_correct= $_POST[maxCorrect] where name='$_POST[name]'";
	$exists = "updated.";
   }

}
else{
	$sql="INSERT INTO player (name, max_correct, max_finger) VALUES ('$_POST[name]',$_POST[maxCorrect],$_POST[maxFingers])";
	$exists = "added.";
}

if($sql != ""){
	if (!mysql_query($sql,$link)){
	 die('Error: ' . mysql_error());
	}
}
$arrayRes = array ('success'=>true,'text'=>"Player '$_POST[name]' $exists");
echo json_encode($arrayRes);

mysql_close($link);
?>