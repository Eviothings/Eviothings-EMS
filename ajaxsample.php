<?php

header('Access-Control-Allow-Origin: *');

include "config.php";

/*$condition = "1";
if(isset($_GET['userid'])){
   $condition = " id=".$_GET['userid'];
}*/
$userData = mysqli_query($con,"select * from `random` order by id desc limit 10");

$response = array();

while($row = mysqli_fetch_assoc($userData)){

   $response[] = $row;
}


echo json_encode($response);
exit;