<?php
include 'config.php';
date_default_timezone_set('GMT');

$insertPlayer = "INSERT INTO player (name, fname, surname, max_correct, max_incorrect, max_finger, last_played) VALUES ('$_POST[name]','$_POST[fname]','$_POST[surname]',0,0,0,UTC_TIMESTAMP())";


if (mysql_query($insertPlayer,$link)){
	 $arrayRes = array ('success'=>true,'result'=>'Player Added');
}
else{
	$arrayRes = array ('success'=>false,'result'=>mysql_error());
}

echo json_encode($arrayRes);

?>