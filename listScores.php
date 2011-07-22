<?php
include 'config.php';

$result = mysql_query("SELECT * FROM player order by $_POST[orderBy] $_POST[dir] limit $_POST[num]");

while($row = mysql_fetch_array($result)){
  $arrayRes[] = array('name'=>$row['name'],'maxFingers'=>$row['max_finger'],'maxCorrect'=>$row['max_correct'],'lastPlayed'=>$row['last_played']);
}

echo json_encode($arrayRes);

mysql_close($link);
?>