<?php
include 'config.php';

$result = mysql_query("SELECT * FROM player order by $_POST[orderBy] $_POST[dir] limit $_POST[start], $_POST[num]");
$total = mysql_query("SELECT count(*) FROM player");

while($row = mysql_fetch_array($result)){
  $arrayRes[] = array('name'=>$row['name'],'maxFingers'=>$row['max_finger'],'maxCorrect'=>$row['max_correct'],'maxIncorrect'=>$row['max_incorrect'],'lastPlayed'=>$row['last_played']);
}
$totalRes = mysql_fetch_row($total);

$output[] = array('max' => $totalRes[0]);
$output[] = $arrayRes;

echo json_encode($output);

?>