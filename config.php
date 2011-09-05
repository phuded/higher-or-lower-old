<?php
//$link = mysql_connect('higherorlower.db.7613256.hostedresource.com', 'higherorlower', 'Thorndon32!');
$link = mysql_connect('184.168.194.11', 'higherorlower', 'Thorndon32!');

if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db("higherorlower", $link);
?>