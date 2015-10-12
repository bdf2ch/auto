<?php
//header('Access-Control-Allow-Origin: http://127.0.0.1:3030');
//header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$result = array();

    
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
    
    $query = "SELECT *
              FROM TRANSPORT_ITEMS";       
    $statement = oci_parse($con1, $query);
    
    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement)){
            array_push($result, $res);
		}
    }
    else {
        $err = oci_error();
        die("Не удалось выполнить запрос : ".$err[message]);
    }
        
    oci_close($con1);
    //return json_decode($result);
    echo json_encode($result);
?>