<?php
//$link = mysql_connect('higherorlower.db.7613256.hostedresource.com', 'higherorlower', 'Thorndon32!');
$link = mysql_connect('higherorlower.cklqq8fsjhst.eu-west-1.rds.amazonaws.com', 'higherorlower', 'Thorndon32!');

if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("higherorlower", $link);
?>