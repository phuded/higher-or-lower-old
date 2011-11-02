<?php
include 'config.php';

$result = mysql_query("SELECT * FROM player order by name asc");

while($row = mysql_fetch_array($result)){
  $arrayRes[] = array('name'=>$row['name'],'fname'=>$row['fname'],'surname'=>$row['surname']);
}

echo json_encode($arrayRes);

?>