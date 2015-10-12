<?php
$id = null;
$driverInfo = array();


$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);
$driverFio = $params["driverFio"];
$driverPhone = $params["driverPhone"];

$con1 = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
    if (!$con1){
        $err = oci_error($con1);
        var_dump($con1);
        print "Error code = " . $err[code];
        print "Error message = " . $err[message];
        print "Error position = " . $err[offset];
        print "SQL Statement = " . $err[sqltext];
        oci_close($con1);
        die('Не удалось подключиться к БД');
    }

    $query = "SELECT sq_request_all.nextval FROM DUAL";
    $statement = oci_parse($con1, $query);
    if(oci_execute($statement, OCI_DEFAULT))
    {
        $res = oci_fetch_assoc($statement);
        $id = $res["NEXTVAL"];
		//echo "id = ".$id;
        $driverInfo["REQUEST_ID"] = $id;
        //die("id = ".$id);
    }
     else {
        $err = oci_error();
        die("Не удалось выполнить запрос 1 : ".$err[message]);
        echo false;
    }

    $query2 = "INSERT INTO
                         DRIVERS (DRVR_ID,
                                  FIO,
                                  PHONE,
                                  LICENCE_ID)
                         VALUES ($id,
                                 '$driverFio',
                                 '$driverPhone',
                                 0)";

    $statement2 = oci_parse($con1, $query2);

    if(oci_execute($statement2, OCI_COMMIT_ON_SUCCESS)){
        $query3 = "SELECT * FROM drivers WHERE DRVR_ID = $id";
        $statement3 = oci_parse($con1, $query3);
        if(oci_execute($statement3, OCI_DEFAULT)){
            $driver = oci_fetch_assoc($statement3);
            echo json_encode($driver);
        }
    } else {
        $err = oci_error();
        die("Не удалось выполнить запрос 2: ".$err[message]);
        echo "fail";
    }

    oci_close($con1);
?>