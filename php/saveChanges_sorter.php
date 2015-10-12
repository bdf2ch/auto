<?php
header('Content-Type: application/json');

$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);
$id = $params["id"]; 
$type = $params["transportType"];
$subtype = $params["transportSubType"];

$con1 = oci_connect('purchases', 
					'PURCHASES', 
					'192.168.50.52/ORCLWORK', 
					'AL32UTF8');
if (!$con1){
    $err = oci_error($con1);
    var_dump($con1);
    print "Error code = " . $err[code];
    print "Error message = " . $err[message];
    print "Error position = " . $err[offset];
    print "SQL Statement = " . $err[sqltext];
    oci_close($con1);
        die('Ошибка подключения к базе');
    }
	
	$query = "UPDATE TRANSPORT_ITEMS 
                  SET ITEM_TYPE_ID = {$type},
					  ITEM_SUBTYPE_ID = {$subtype}
              WHERE ITEM_ID = {$id}";
    $statement = oci_parse($con1, $query);

    if(oci_execute($statement, OCI_COMMIT_ON_SUCCESS))
        echo true;
    else {
        $err = oci_error();
        die("Не удалось выполнить запрос : ".$err[message]);
        echo false;
    }
        
    oci_close($con1);
?>