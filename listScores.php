<?php
$link = mysql_connect('higherorlower.db.7613256.hostedresource.com', 'higherorlower', 'Phuded32');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("higherorlower", $link);

$result = mysql_query("SELECT * FROM player order by $_POST[orderBy] $_POST[dir] limit 10");

while($row = mysql_fetch_array($result)){
  $arrayRes[] = array('name'=>$row['name'],'maxFingers'=>$row['max_finger'],'maxCorrect'=>$row['max_correct'],'lastPlayed'=>$row['last_played']);
}

echo json_encode($arrayRes);

mysql_close($link);
?>