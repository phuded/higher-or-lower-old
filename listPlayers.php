<?php
include 'config.php';

$result = mysql_query("SELECT * FROM player order by name asc");
$arrayRes = array();

while($row = mysql_fetch_array($result)){
	array_push($arrayRes, $row['name']);
}

echo json_encode($arrayRes);

mysql_close($link);
?>