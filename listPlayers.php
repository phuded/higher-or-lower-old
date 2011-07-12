<?php
$link = mysql_connect('higherorlower.db.7613256.hostedresource.com', 'higherorlower', 'Phuded32');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("higherorlower", $link);

$result = mysql_query("SELECT * FROM player order by name asc");

$arrayRes = array();

while($row = mysql_fetch_array($result)){
	array_push($arrayRes, $row['name']);
}

echo json_encode($arrayRes);

mysql_close($link);
?>