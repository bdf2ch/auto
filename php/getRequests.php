<?php
include 'calendarFunctions.php';

$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);

$department = $params['department'];
$start = $params['start'];
$end = $params['end'];

$result = array();

    //if (is_null($date))
        //$startDate = getFormattedDate();
        //$startDate = "20.09.2012";
    //else
      //  $startDate = $date;

    //echo $startDate;

    $con1 = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
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
              FROM V_AUTO_REQUESTS
              WHERE
              V_AUTO_REQUESTS.START_DATE >= '{$start}' AND
              V_AUTO_REQUESTS.END_DATE <= '{$end}' AND
              V_AUTO_REQUESTS.REQUEST_DEPARTMENT = {$department}";

    /*$query = "SELECT *
              FROM AUTO_REQUESTS
              WHERE AUTO_REQUESTS.TRANSPORT_TYPE_ID = {$id} AND
              AUTO_REQUESTS.START_DATE >= '{$start}' AND
              AUTO_REQUESTS.END_DATE <= '{$end}'";*/
    $statement = oci_parse($con1, $query);

    if(oci_execute($statement, OCI_DEFAULT)){
            while($res = oci_fetch_array($statement))
                array_push($result, $res);
    }
    else {
        $err = oci_error();
        die("Не удалось выполнить звапрос : ".$err[message]);
    }

    oci_close($con1);
    //return json_decode($result);
    echo json_encode($result);
?>
